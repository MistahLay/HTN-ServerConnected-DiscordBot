import fs from "fs";
import { ObjectModel } from "objectmodel";

export class Receivable 
{
    constructor(public model:ObjectModel, public acceptables:String|string[]){
        if(!(model instanceof ObjectModel)) throw new Error("Invalid model");        
    }
}
export let receivables:{[key:string]:Receivable} = {}
fs.readdirSync(__dirname+"/Receivables", {withFileTypes: true})
.filter(value => value.name.endsWith(".ts"))
.forEach(value => {
    const receivable = require(value.name);
    if(!(receivable instanceof Receivable)) return;
    receivables[value.name.replace(".ts", "")];
})
