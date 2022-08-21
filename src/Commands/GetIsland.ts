import { Command } from "../BotCommand";

module.exports = new Command()
   .setInfo("This will ban a player in the ingame server")
   .setParamType([{ name: "islandID", type: "string" }])
   .onExecute((msg, [id]) => {});
