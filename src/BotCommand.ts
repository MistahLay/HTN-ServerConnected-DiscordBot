import { APIEmbed, Colors, Message } from "discord.js";
import fs from 'fs';
export class Command {
    info: string = "";
    isInvisible:boolean = false;
    requiredServerOnline: boolean = true;
    execute?:(msg: Message, args: string[]) => void;
    paramType:{name:string, type:string}[] = [];
    onExecute(execute:(msg: Message, args: string[]) => void){this.execute = execute; return this;};
    setInfo(info: string) {this.info = info; return this};
    setParamType(types:{name:string, type:string}[]){this.paramType = types; return this;}
    setInvisible(set:boolean){this.isInvisible = set; return this;}
    setRequiredServerOnline(b:boolean){this.requiredServerOnline = b; return this;}
}

export let commandsInfo:APIEmbed = {
    title: "Commands",
    description: "Note: When the server is down most of the commands will not work ofc. \n-LayWasTaken",
    color: Colors.Green,
    fields: []
};

export const commands:{[key:string]: Command} = {}

export async function getCommands():Promise<{[key:string]: Command}>{
    return new Promise(r => {
        fs.readdirSync(__dirname+"/Commands", {withFileTypes: true})
        .filter(value => value.isFile())
        .forEach(value => {
            const cmd = require(__dirname+"/Commands/"+value.name);
            if(!(cmd instanceof Command)) return;
            commands[value.name.replace(".ts", "").toLowerCase()] = cmd;
        });
        r(commands);
    })
}