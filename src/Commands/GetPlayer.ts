import { Command } from "../BotCommand";

module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParamType([{ name: "player", type: "string" }])
    .onExecute((msg, [player]) => {});
