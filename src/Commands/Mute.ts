import { Command } from "../BotCommand";

module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParamType([
        {name: "player", type: "string"}, 
        {name: "reason", type: "string"}, 
        {name: "days", type: "number"}, 
        {name: "hours", type: "number"}, 
        {name: "minutes", type: "number"}
    ])
    .onExecute((msg, args) => {
        if(!(args[0] && args[1] && args[2] && args[3] && args[4])) {msg.reply("Some arguments are empty pls do s!help to check the command paramaters"); return;}
        msg.reply("Yoo thats valid")
    })