import uuid from 'uuid';
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
class SendableApi extends Sendable {
    api?:"request"|"response";
    id:string = uuid.v4();
    setId(id:string){
        if(!(typeof id === "number")) throw new TypeError("id must be a number");
        this.id = id;
        return this;
    }
}

export class SendableRequest extends SendableApi{
    api:"request" = "request";
}

export class SendableResponse{
    api: "response" = "response"
    id:number = 0
    success: true|string = true
    setId(id: number){
        this.id = id;
        return this;
    }
    setError(err: string){
        this.success = err;
        return this;
    }
}