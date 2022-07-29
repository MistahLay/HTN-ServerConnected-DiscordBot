export class Sendable {
    data?: any
    data_type?: string   
    to?: string|string[]
    setData(data:any){this.data = data;return this;}
    setDataType(type:string){
        if(!(typeof type === "string")) throw new TypeError("DataType must be a string");
        return this;
    }
    sendTo(to:string|string[]){
        if(typeof to === "string" || Array.isArray(to)) throw new TypeError("to must be string or string[]")
        return this;
    }
}
export class SendableApi extends Sendable {
    api?:"request"|"response";
    id:number = Math.round(Math.random() * 1000);
    setApiType(api_type:"request"|"response"){
        if(!(api_type === "request" || api_type === "response")) throw new TypeError("api_type must be a request or response type");
    }
    setId(id:number){
        if(!(typeof id === "number")) throw new TypeError("id must be a number");
        this.id = id;
        return this;
    }
}