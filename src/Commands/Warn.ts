import { Colors } from "discord.js";
import { Command } from "../BotCommand";
import { socket } from "../Client";

module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParamType([{name: "player", type: "string"}, {name: "reason", type: "string"}])
    .onExecute(async (msg, [player, reason]) => {
        const reply = await msg.reply("**Sending Request...**");
        socket.sendRequest({
            data_type: "PlayerPunish",
            data: {
                player,
                reason,
                staff: msg.author.username,
                type: "warn"
            },
            to: "Pocketmine"
        }, async (data:string|null) => {
            if (data) return await reply.edit(data);
            await reply.edit({content: "",embeds:[{
                title: "Server Warn",
                color: Colors.Yellow,
                description: `${player} was warned by ${msg.author.username}`
            }]});
        })
    })
    .setInvisible(true)