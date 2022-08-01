import { ThreadAutoArchiveDuration } from "discord.js";
import fs from "fs";
import { ObjectModel } from "objectmodel";

export class Receivable 
{
    public cb?:(data:any) => void
    constructor(public model:ObjectModel, public acceptables:String|string[]){
        if(!(model instanceof ObjectModel)) throw new Error("Invalid model");        
    }
    setCallback(cb:(data:any) => void):this{
        this.cb = cb;
        return this;
    }
}
const f = {};
export function get():Promise<{[key:string]:Receivable}> {
    return new Promise(r => {
        let count = 0;
        let receivables:{[key:string]:Receivable} = {}
        const files = fs.readdirSync(__dirname+"/Receivables", {withFileTypes: true})
            .filter(value => value.name.endsWith(".ts"))
        files.forEach(value => {
            const receivable = require(__dirname+"/Receivables/"+value.name);
            count++;
            if(!(receivable instanceof Receivable)) {count === files.length ? r(receivables) : console.log("E");return;}
            receivables[value.name.replace(".ts", "")] = receivable;
            count === files.length ? r(receivables) : 0
        })
    })
}