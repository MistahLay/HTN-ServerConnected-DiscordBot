import EventEmitter from 'events';
import net from 'net';

interface SentJsonObject {
    from: string
    data_type: string
    data: object
    api?: "response"|"request"
    id?: number
}

interface SendableObject {
    to: string|string[]
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
        password: ""
    }
    constructor() {super();this.handleConnection()}
    private handleConnection():void{
        this.socket = new net.Socket;
        this.socket.on('connect', () => {this.emit("Connected",null);this.clearInterval()});
        this.handleSentData();
        this.socket.on('close', err => {this.emit("Disconnected",null);this.runInterval()});
        this.socket.on('error', err => {this.runInterval()});
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
                const object:SentJsonObject = JSON.parse(data.toString());
                this.emit("ReceivedData", object);
                
            } catch (error) {
                if(error instanceof SyntaxError) console.log("Its a invalid json object somehow");
            }
        })
    }

    private sendData(data:SendableObject):void{}
}