import { Colors } from "discord.js";
import { Command } from "../BotCommand";
import { socket } from "../Client";
module.exports = new Command()
    .setInfo("This will temporarily ban a player")
    .setParamType([
        {name: "player", type: "string"}, 
        {name: "reason", type: "string"}, 
        {name: "days", type: "number"}, 
        {name: "hours", type: "number"}, 
        {name: "minutes", type: "number"}
    ])
    .onExecute(async (msg, [player, reason, days, hours, minutes]) => {
        const reply = await msg.reply("**Sending Request...**");
        socket.sendRequest({
            data_type: "PlayerPunish",
            data: {
                player,
                reason,
                time:{
                    minutes,
                    days,
                    hours,
                },
                staff: msg.author.username,
                type: "tempban"
            },
            to: "Pocketmine"
        }, async (data:string|null) => {
            if (data) return await reply.edit(data);
            await reply.edit({content: "",embeds:[{
                title: "Server Temporary Ban",
                color: Colors.Orange,
                description: `${player} was temporarily banned by ${msg.author.username}`,
                fields:[{
                    name: "Ban Expiration",
                    value: `${days} days, ${hours} hours, ${minutes} minutes`
                }]
            }]});
        })
    })