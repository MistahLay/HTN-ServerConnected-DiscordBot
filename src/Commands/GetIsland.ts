import { Command } from "../Command";

module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParamType(["island"])
    .setExecute((msg, args) => {
        if(!(args[0])) {msg.reply("Island shouldnt be empty"); return;}
        msg.reply("Yoo thats valid")
    })