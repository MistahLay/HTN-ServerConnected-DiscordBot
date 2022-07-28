import { Command } from "../RegisterCommands";

module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParamType(["player", "reason"])
    .setExecute((msg, args) => {
        if(!(args[0] && args[1])) {msg.reply("Some arguments are empty pls do s!help to check the command paramaters"); return;}
        msg.reply("Yoo thats valid")
    })