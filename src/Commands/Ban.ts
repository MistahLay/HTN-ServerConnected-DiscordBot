import { Command } from "../Command";

module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParamType(["player", "reason"])
    .setExecute((msg, args) => {
        if(!(
            typeof args[0] === "string" &&
            typeof args[1] === "string" 
        )) return;
        msg.reply("Yoo thats valid")
    })