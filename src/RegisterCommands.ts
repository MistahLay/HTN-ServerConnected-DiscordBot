import { APIEmbed, Colors, Embed, Message, ModalSubmitFields } from "discord.js";
import fs from 'fs';
export class Command {
    info?: string;
    execute?:(msg: Message, args: string[]) => void;
    paramType?:string[];
    setExecute(execute:(msg: Message, args: string[]) => void){this.execute = execute; return this;};
    setInfo(info: string) {this.info = info; return this};
    setParamType(types:string[]){this.paramType = types; return this;}
}
export let commands:{[key: string]:Command} = {};
fs.readdirSync(__dirname+"/Commands", {withFileTypes: true})
    .filter(value => value.isFile())
    .forEach(value => {
        const cmd = require(__dirname+"/Commands/"+value.name);
        if(!(cmd instanceof Command)) return;
        commands[value.name.replace(".ts", "").toLowerCase()] = cmd;
    })

export let commandsInfo:APIEmbed = {
    title: "Commands",
    description: "This is the list of the commands",
    color: Colors.Green,
    fields: []
};

for (const key in commands) {
    (async() => {
        const value = commands[key];
        commandsInfo.fields?.push({
            name: key,
            value: `**s!${key.toLowerCase()}`+await getCommandParams(value)+"**"
        })
        console.log(commandsInfo)
    })()
}

function getCommandParams(info:Command):Promise<string>{
    return new Promise((resolve, reject) => {
        let params = "";
        let iteration = 0;
        info.paramType?.forEach(type => {
            params += ` <${type}> `
            iteration++
            if(iteration===info.paramType?.length) resolve(params)
        });
    })
}