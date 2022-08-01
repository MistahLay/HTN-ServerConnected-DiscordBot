import { Command } from "../BotCommand";

module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParamType([{name: "player", type: "string"}, {name: "reason", type: "string"}])
    .onExecute((msg, args) => {
        if(!(args[0] && args[1])) {msg.reply("Some arguments are empty pls do s!help to check the command paramaters"); return;}
        msg.reply("Yoo thats valid")
    })
    .setInvisible(true)