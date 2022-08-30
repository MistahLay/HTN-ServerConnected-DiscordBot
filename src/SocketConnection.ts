import { DataResolver } from "discord.js";
import EventEmitter from "events";
import { v4 } from "uuid";
import WebSocket from "ws";
// import { ApiFormat, Format } from "./DataFormats";
import { getReceivables, Receivable } from "./RegisterReceivables";
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
type Format<
    T extends "send" | "receive" | null = null,
    API extends "not" | "request" | "perhaps" | ResponseTypes = "not"
> = (API extends ResponseTypes ? Response<API> : FormatInterface) &
    (T extends "send"
        ? { to: string | string[] }
        : T extends "receive"
        ? { from: string }
        : {}) &
    (API extends "perhaps"
        ? { api?: "response" | "request"; id?: string }
        : API extends "request" | ResponseTypes
        ? { api: API; id: string }
        : {});
type SocketEvents =
    | "ReceivedData"
    | "Connected"
    | "Disconnect"
    | "PMMPCrash"
    | "PMMPStart"
    | "PMMPStop";
type SocketEvent<T extends SocketEvents> = T extends "ReceivedData"
    ? Format<"receive">
    : T extends "PMMPCrash"
    ? string
    : null;
export interface SocketConnection {
    on<T extends SocketEvents>(
        eventName: T,
        listener: (data: SocketEvent<T>) => void
    ): this;
    once<T extends SocketEvents>(
        eventName: T,
        listener: (data: SocketEvent<T>) => void
    ): this;
    emit<T extends SocketEvents>(eventName: T, data: SocketEvent<T>): boolean;
}
export class SocketConnection extends EventEmitter {
    private PMMPOnline: boolean = false;
    interval?: NodeJS.Timer;
    private sockInfo: {
        ip: string;
        port: number;
        name: string;
        password: string;
    } = {
        ip: "localhost",
        port: 8080,
        name: "DiscordBot",
        password: "109214947836572",
    };
    private socket?: WebSocket;
    requests: { [key: string]: (data: any) => void } = {};
    public handleConnection(CreateNewSocket: boolean = false): void {
        if (CreateNewSocket)
            this.socket = new WebSocket(`ws://localhost:${this.sockInfo.port}`);
        this.handleSentData();
        this.socket?.once("open", () => {
            this.socket?.send(
                JSON.stringify({
                    name: this.sockInfo.name,
                    password: this.sockInfo.password,
                })
            );
            this.emit("Connected", null);
        });
        this.socket
            ?.once("close", () => {
                setTimeout(() => {
                    this.handleConnection(true);
                }, 10000);
                this.emit("Disconnect", null);
                this.removeAllListeners();
            })
            .once("error", () => {});
    }

    private async handleSentData(): Promise<void> {
        if (!this.socket) return;
        const receivables = await getReceivables();
        this.socket.on("message", async (data) => {
            try {
                let object: Format<"receive", "perhaps"> = JSON.parse(
                    data.toString()
                );
                if (object.from === "Server")
                    return this.handleServerData(object);
                try {
                    if (
                        (object.data_type === "error" ||
                            object.data_type === "success") &&
                        object.api === "response" &&
                        object.id
                    )
                        return await this.requests[object.id](object.data);
                    const DataModel =
                        receivables[
                            object.data_type +
                                (object.api === "request" ||
                                object.api === "response"
                                    ? "." + object.api
                                    : "")
                        ];
                    if (!DataModel) return;
                    if (
                        !(typeof DataModel.acceptables === "object"
                            ? DataModel.acceptables.includes(object.from)
                            : DataModel.acceptables === object.from)
                    )
                        return;
                    if (object.api && object.id)
                        return await this.requests[object.id](object.data);

                    new DataModel.model(object.data);
                } catch (error) {
                    if (error instanceof TypeError) return console.error(error);
                    if (object.from) console.log("Vfh");
                }
            } catch (error) {
                console.log("Foo");
                if (error instanceof SyntaxError) console.log(data.toString());
            }
        });
    }

    public sendData(data: Format<"send">): void | string {
        if (!this.socket) return "Socket is offline";
        try {
            this.socket.send(JSON.stringify(data));
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
        data: Omit<Format<"send", "request">, "api" | "id"> & {
            api?: "request";
            id?: string;
        },
        cbResponse: (data: any) => void
    ): void | string {
        data.api = "request";
        data.id = v4();
        if (this.requests[data.id]) return this.sendRequest(data, cbResponse);
        this.requests[data.id] = cbResponse;
        this.socket?.send(JSON.stringify(data));
    }

    public sendResponse(
        data: Omit<Format<"send", any>, "api"> & { api?: "response" }
    ): void | string {
        if (!this.socket) return "Socket is offline";
        data.api = "response";
        this.socket.send(JSON.stringify(data));
    }

    private handleServerData(data: Format) {
        if (data.data_type === "ClientClose")
            if (data.data.client === "Pocketmine") this.PMMPOnline = false;
        if (data.data_type === "Clients")
            if ((data.data.clients as string[]).includes("Pocketmine"))
                this.PMMPOnline = true;
        if (data.data_type === "ClientJoin")
            if (data.data.client === "Pocketmine") this.PMMPOnline = true;
    }

    public isPMMPOnline(): boolean {
        return this.PMMPOnline;
    }
}
