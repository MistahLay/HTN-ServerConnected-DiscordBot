import { Command } from "../RegisterCommands";

module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParamType(["player"])
    .setExecute((msg, args) => {
        if(!(args[0])) {msg.reply("Player shouldnt be empty"); return;}
        msg.reply("Yoo thats valid")
    })