import { Command } from "../BotCommand";
import { socket } from "../Client";
import { SendableRequest } from "../Sendable";
module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParamType([{name: "player", type: "string"}, {name: "reason", type: "string"}])
    .onExecute((msg, args) => {
        const request = new SendableRequest();
        socket.sendRequest(request, data => {
            
        });
    })