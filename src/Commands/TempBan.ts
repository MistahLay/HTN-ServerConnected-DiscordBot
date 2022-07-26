import { Command } from "../Command";

module.exports = new Command()
    .setInfo("This will temporarily ban a player")
    .setParamType(["player", "reason", "days", "hours", "minutes"])
    .setExecute((msg, args) => {
        if(!(
            typeof args[0] === "string" &&
            typeof args[1] === "string" &&
            typeof +args[2] === "number" &&
            typeof +args[3] === "number" &&
            typeof +args[4] === "number"
        )) return;

    })