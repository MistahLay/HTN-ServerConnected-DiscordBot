import { Command } from "../RegisterCommands";
module.exports = new Command()
    .setInfo("This will temporarily ban a player")
    .setParamType(["player", "reason", "days", "hours", "minutes"])
    .setExecute((msg, args) => {
        if(!(args[0] && args[1] && args[2] && args[3] && args[4])) {msg.reply("Some arguments are empty pls do s!help to check the command paramaters"); return;}
        console.log(args[2]);
        console.log(Number(args[2]));
        if(isNaN(Number(args[2]))){msg.reply("Days can only be a number"); return;}
        if(isNaN(Number(args[3]))){msg.reply("Hours can only be a number"); return;}
        if(isNaN(Number(args[4]))){msg.reply("Minutes can only be a number"); return;}
        msg.reply({
            embeds: [
                {
                    title: "Test"
                }
            ]
        })
    })