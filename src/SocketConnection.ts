import EventEmitter from 'events';
import net from 'net';
import { receivables } from './RegisterReceivables';
import { Sendable } from './Sendable';

export interface SentJsonObject {
    from: string
    data_type: string
    data: object
    api?: "response"|"request"
    id?: number
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
    }
    constructor() {super();this.handleConnection()}
    private handleConnection():void{
        this.socket = new net.Socket;
        this.socket.on('connect', () => {this.emit("Connected",null);this.socket?.write(JSON.stringify({
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
        this.interval = setInterval(() => {}, 1000);
    }

    private clearInterval():void{
        if(!this.interval) return;
        clearInterval(this.interval);
    }
    
    private handleSentData():void{
        if(!this.socket) return;
        this.socket.on("data", data => {
            try {
                let object:SentJsonObject = JSON.parse(data.toString());
                try {
                    const DataModel = receivables[object.data_type+((object.api === "request" || object.api === "response") ? "."+object.api : "")]
                    if(Array.isArray(DataModel.acceptables) ? DataModel.acceptables.includes(object.from) : DataModel.acceptables === object.from ? true : false) return;                    
                    new DataModel.model(object.data);
                    this.emit("ReceivedData", object);
                } catch (error) {
                    if(error instanceof TypeError) return console.log("BRUHH")
                    if(object.from) console.log("Vfh")
                }
            } catch (error) {
                if(error instanceof SyntaxError) console.log("Its a invalid json object somehow");
            }
        })
    }

    public sendData(data:Sendable):boolean{
        if(!(data instanceof Sendable)) return false;
        if(!this.socket) return false;
        this.socket.write(JSON.stringify(data))
        return true;
    }
}
new SocketConnection()