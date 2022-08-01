import { APIEmbed, Colors } from "discord.js";
import { Command, commands } from "../BotCommand";
export let commandsInfo:APIEmbed = {
    title: "List of Commands",
    description: "Note: When the server is down most of the commands will not work ofc. \n-LayWasTaken",
    color: Colors.Green,
    fields: []
};
module.exports = new Command()
    .onExecute(async (msg, args) => {
        if(args[0]) {
            if(commands[args[0]]){
                msg.reply({embeds:[{
                    title: args[0].toUpperCase() + " Info",
                    color: Colors.Green,
                    description: commands[args[0]].info
                }]})
                return;
            }
            msg.reply({embeds:[{
                title: "Command Error",
                color: Colors.Red,
                description: "Unknown command pls do ``c?help`` for the list of commands"
            }]})
            return;
        }
        if(!(commandsInfo.fields?.length === 0)) {
            msg.reply({embeds:[commandsInfo]});
            return;
        }
        commandsInfo.fields = [];
        for (const name in commands) {
            if(commands[name].isInvisible) continue;
            commandsInfo.fields.push({
                name: name.charAt(0).toUpperCase()+name.slice(1),
                value: "``c?"+name+"`` "+get(commands[name].paramType)
            });
        }
        msg.reply({embeds:[commandsInfo]});
    })
    .setInvisible(true)
function get(param:{name:string, type:string}[]):string{
    let str = "";
    param.forEach(v => {
        str+=` <${v.name}>`;
    });
    return str;
}