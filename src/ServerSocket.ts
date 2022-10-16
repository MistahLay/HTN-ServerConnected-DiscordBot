import ws, { Server } from "ws";
import fs from "fs";
import { randomUUID } from "crypto";
import { getReceivables } from "./ReceivableModel";
import { ArrayModel, ObjectModel } from "objectmodel";

type AnyObject = { [key: string | symbol | number]: any };
type ResponseTypes = "response-error" | "response-success" | "response";
interface FormatInterface {
    data_type: string;
    data: AnyObject;
}
type Response<T extends ResponseTypes> = Omit<
    FormatInterface,
    "data_type" | "data"
> &
    (T extends "response-error"
        ? { data_type: "error"; data: string }
        : T extends "response-success"
        ? { data_type: "success" }
        : FormatInterface);
type Format<API extends "not" | "request" | "perhaps" | ResponseTypes = "not"> =
    (API extends ResponseTypes ? Response<API> : FormatInterface) &
        (API extends "perhaps"
            ? { api?: "response" | "request"; id?: string }
            : API extends "request" | ResponseTypes
            ? { api: API; id: string }
            : {});
export class ServerSocket {
    private server: Server;
    private pmmp?: ws;
    private requests: { [key: string]: (data: any) => void } = {};
    private token: string;

    constructor() {
        if (!process.env.PORT) throw new Error("Port must be added");
        if (!process.env.HOST) throw new Error("Host must be added");
        if (!process.env.PMMP_TOKEN_PATH)
            throw new Error("Token Path doesnt exists");
        this.token = fs.readFileSync(process.env.PMMP_TOKEN_PATH, {
            encoding: "utf-8",
        });
        const port = parseInt(process.env.PORT);
        this.server = new Server({
            port: port,
            host: process.env.HOST,
        });
        this.server.on("connection", (client) => {
            const timeout = setTimeout(
                () => client.close(102, "Timeout"),
                1000 * 20
            );
            client.once("message", (data) => {
                try {
                    if (this.pmmp)
                        return client.close(100, "Client is already using it");
                    const token = data.toString();
                    if (!(this.token === token)) return client.close();
                    clearTimeout(timeout);
                    client.once("error", () => {});
                    client.once("close", () => (this.pmmp = undefined));
                    this.pmmp = client;
                    this.listenData(client);
                } catch (error) {
                    client.close(101, "Data isn't valid json");
                }
            });
        });
    }

    public isOnline() {
        return !!this.pmmp;
    }

    private async listenData(client: ws) {
        const receivables = await getReceivables();
        client.on("message", async (m) => {
            try {
                const object = JSON.parse(m.toString());
                try {
                    if (
                        !object.data_type &&
                        typeof object.data_type === "string"
                    )
                        return;
                    if (!object.data) return;
                    const DataModel =
                        receivables[
                            object.data_type +
                                (object.api === "request" ||
                                object.api === "response"
                                    ? "." + object.api
                                    : "")
                        ];
                    if (DataModel) {
                        if (typeof DataModel.model === "string")
                            if (!(typeof object.data === DataModel.model))
                                return;
                        if (
                            DataModel.model instanceof ArrayModel ||
                            DataModel.model instanceof ObjectModel
                        )
                            DataModel.model(object.data);
                        object.api && object.id
                            ? await (
                                  DataModel.cb as (
                                      data: any,
                                      id: string
                                  ) => void
                              )(object.data, object.id)
                            : await DataModel.cb(object.data);
                        if (object.api === "response" && object.id)
                            this.requests[object.id](object.data);
                        return;
                    }
                    if (object.api === "response" && object.id)
                        this.requests[object.id](object.data);
                } catch (error) {
                    client.close(103, "Invalid Types");
                }
            } catch (error) {
                client.close(103, "Data isnt valid JSON");
            }
        });
    }

    public sendData(data: Format): void | string {
        try {
            this.pmmp?.send(JSON.stringify(data));
        } catch (error) {
            if (error instanceof Error) console.log("Cant send data");
        }
    }

    /**
     * @param data The request
     * @param cbResponse data will be a string if it's an error and an object if success
     * @returns void
     */
    public sendRequest(
        data: Omit<Format<"request">, "api" | "id"> & {
            api?: "request";
            id?: string;
        },
        cbResponse: (data: any) => void
    ): void | string {
        data.api = "request";
        data.id = randomUUID();
        if (this.requests[data.id]) return this.sendRequest(data, cbResponse);
        this.requests[data.id] = cbResponse;
        this.pmmp?.send(JSON.stringify(data));
    }

    public sendResponse(
        data: Omit<Format<any>, "api"> & { api?: "response" }
    ): void | string {
        if (!this.pmmp) return "Socket is offline";
        data.api = "response";
        this.pmmp.send(JSON.stringify(data));
    }

    /**
     *
     * @param token If token is null then it will generate a random uuid(v4) as the token
     */
    public changeToken(token: string | null = null) {
        const i = token ?? randomUUID();
        this.token = i;
        return token;
    }
}
