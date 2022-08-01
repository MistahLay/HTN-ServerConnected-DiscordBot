import { Command } from "../BotCommand";
module.exports = new Command()
    .setInfo("This will temporarily ban a player")
    .setParamType([
        {name: "player", type: "string"}, 
        {name: "reason", type: "string"}, 
        {name: "days", type: "number"}, 
        {name: "hours", type: "number"}, 
        {name: "minutes", type: "number"}
    ])
    .onExecute((msg, args) => {

    })