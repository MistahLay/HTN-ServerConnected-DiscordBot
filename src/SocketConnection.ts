import EventEmitter from "events";
import net from "net";
import { v4 } from "uuid";
// import { ApiFormat, Format } from "./DataFormats";
import { getReceivables } from "./RegisterReceivables";
type AnyObject = { [key: string | symbol | number]: any };
type LiteralUnion<T extends U, U = string> = T | (U & {});
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
   : null | undefined;
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
   private interval?: NodeJS.Timer;
   private socket?: net.Socket;
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
   requests: { [key: string]: (data: any) => void } = {};
   constructor() {
      super();
      this.handleConnection();
   }
   private handleConnection(): void {
      this.socket = new net.Socket();
      this.socket.on("connect", () => {
         this.emit("Connected", null);
         this.clearInterval();
         this.socket?.write(
            JSON.stringify({
               name: this.sockInfo.name,
               password: this.sockInfo.password,
            })
         );
         this.clearInterval();
      });
      this.handleSentData();
      this.socket.on("close", (err) =>
         this.interval ? null : this.runInterval()
      );

      this.socket.on("error", (err) => this.runInterval());
      this.socket.connect({
         host: this.sockInfo.ip,
         port: this.sockInfo.port,
      });
   }

   private runInterval(): void {
      if (this.interval) return;
      this.interval = setInterval(
         () =>
            this.socket?.connect({
               host: this.sockInfo.ip,
               port: this.sockInfo.port,
            }),
         2000
      );
   }

   private clearInterval(): void {
      if (!this.interval) return;
      clearInterval(this.interval);
   }

   private async handleSentData(): Promise<void> {
      if (!this.socket) return;
      const receivables = await getReceivables();
      this.socket.on("data", async (data) => {
         try {
            let object: Format<"receive", "perhaps"> = JSON.parse(data.toString());
            if (object.from === "Server") return this.handleServerData(object);
            try {
               if ((object.data_type === "error" || object.data_type === "success") && object.api === "response" && object.id)
                  return await this.requests[object.id](object.data);
               const DataModel =
                  receivables[
                     object.data_type +
                        (object.api === "request" || object.api === "response"
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
               new DataModel.model(object.data);
               await DataModel.cb?.(object.data);
               // this.emit("ReceivedData", object);
            } catch (error) {
               if (error instanceof TypeError) return console.error(error);
               if (object.from) console.log("Vfh");
            }
         } catch (error) {
            if (error instanceof SyntaxError) console.log(data.toString());
         }
      });
   }

   public sendData(data: Format<"send">): void | string {
      if (!this.socket) return "Socket is offline";
      try {
         this.socket.write(JSON.stringify(data));
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
      data: Omit<Format<"send", "request">, "api"|"id"> & {api?: "request", id?: string},
      cbResponse: (data: any) => void,
   ): void | string {
      if (!this.socket) return "Socket is offline";
      data.api = 'request';
      data.id = v4();
      if (this.requests[data.id])
         return this.sendRequest(data, cbResponse)
      this.requests[data.id] = cbResponse;
      this.socket.write(JSON.stringify(data));
   }

   public sendResponse(data: Omit<Format<"send", any>, "api"> & {api?:"response"}): void | string {
      if (!this.socket) return "Socket is offline";
      data.api = "response";
      this.socket.write(JSON.stringify(data));
   }

   private handleServerData(data: Format) {
      if (data.data_type === "ClientClose") {
         if (data.data.client === "Pocketmine") this.PMMPOnline = false;
         return;
      }
      if (data.data_type === "Clients") {
         for (const iterator of data.data.clients) {
            if (iterator === "Pocketmine") {
               this.PMMPOnline = true;
               return;
            }
         }
      }
   }

   public isPMMPOnline(): boolean {
      return this.PMMPOnline;
   }
}
