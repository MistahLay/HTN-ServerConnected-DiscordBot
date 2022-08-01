import EventEmitter from 'events';
import net from 'net';
import { Receivable, get } from './RegisterReceivables';
import { Sendable, SendableRequest, SendableResponse } from './Sendable';
export interface SentJsonObject {
    from: string
    data_type: string|"None"
    data?: any
    api?: "response"|"request"
    id?: number
    success: string|true
}
type SocketEvents = "ReceivedData"|"Connected"|"Disconnected";
type SocketEvent<T extends SocketEvents> = 
    T extends "ReceivedData" ? SentJsonObject : null|undefined;
export interface SocketConnection {
    on<T extends SocketEvents>(eventName:T, listener:(data:SocketEvent<T>) => void):this;
    once<T extends SocketEvents>(eventName:T, listener:(data:SocketEvent<T>) => void):this;
    emit<T extends SocketEvents>(eventName:T, data: SocketEvent<T>):boolean;
}
export class SocketConnection extends EventEmitter
{
    private interval?:NodeJS.Timer;
    private socket?:net.Socket;
    private sockInfo:{
        ip: string,
        port: number,
        name: string,
        password: string
    } = {
        ip: "localhost",
        port: 8080,
        name: "DiscordBot",
        password: "109214947836572"
    };
    requests: {[key:string]:(data:any) => void} = {};
    constructor() {super();this.handleConnection()}
    private handleConnection():void{
        this.socket = new net.Socket;
        this.socket.on('connect', () => {this.emit("Connected",null);this.clearInterval();this.socket?.write(JSON.stringify({
            name: this.sockInfo.name,
            password: this.sockInfo.password
        }));
        this.clearInterval()});
        this.handleSentData();
        this.socket.on('close', err => {this.emit("Disconnected",null);this.runInterval()});
        this.socket.on('error', err => {this.runInterval()});
        this.socket.connect({host: this.sockInfo.ip, port: this.sockInfo.port});
    }
    
    private runInterval():void{
        if(this.interval) return;
        this.interval = setInterval(() => this.socket?.connect({host: this.sockInfo.ip, port: this.sockInfo.port}), 2000);
    }

    private clearInterval():void{
        if(!this.interval) return;
        clearInterval(this.interval);
    }
    
    private async handleSentData():Promise<void>{
        if(!this.socket) return;
        const receivables = await get();
        this.socket.on("data", data => {
            try {
                let object:SentJsonObject = JSON.parse(data.toString());
                if(object.data_type === "None") {this.emit("ReceivedData", object);return;}
                try {
                    if(!object.data) return;
                    const DataModel = receivables[object.data_type+((object.api === "request" || object.api === "response") ? "."+object.api : "")]
                    if(!DataModel) return;
                    typeof object.from;
                    if(!(typeof DataModel.acceptables === "object" ? DataModel.acceptables.includes(object.from) : DataModel.acceptables === object.from)) return;                    
                    new DataModel.model(object.data);
                    DataModel.cb?.(typeof object.success === "string" ? object.success : object.data)
                    this.emit("ReceivedData", object);
                } catch (error) {
                    if(error instanceof TypeError) return console.error(error)
                    if(object.from) console.log("Vfh")
                }
            } catch (error) {
                if(error instanceof SyntaxError) console.log("Its a invalid json object somehow");
            }
        })
    }

    public sendData(data:Sendable):void|string{
        if(!(data instanceof Sendable)) return "Data is valid";
        if(!this.socket) return "Socket is offline";
        this.socket.write(JSON.stringify(data))
    }
    public sendRequest(data:SendableRequest, cbResponse: (data:Receivable) => void):void|string{
        if(!this.socket) return "Socket is offline";
        if(!(data instanceof SendableRequest)) return "Data isnt valid";
        if(this.requests[data.id]) return "Id must be different";
        this.requests[data.id] = cbResponse;
        this.socket.write(JSON.stringify(data));
    }

    public sendResponse(data:SendableResponse):void|string{
        if(!(data instanceof SendableResponse)) return "Data is valid";
        if(!this.socket) return "Socket is offline";
        this.socket.write(JSON.stringify(data))
    }
}