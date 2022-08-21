import { Colors } from "discord.js";
import { Command } from "../BotCommand";
import { socket } from "../Client";

module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParamType([
        { name: "player", type: "string" },
        { name: "reason", type: "string" },
        { name: "days", type: "number" },
        { name: "hours", type: "number" },
        { name: "minutes", type: "number" },
    ])
    .onExecute(async (msg, [player, reason, days, hours, minutes]) => {
        const reply = await msg.reply("**Sending Request...**");
        socket.sendRequest(
            {
                data_type: "PlayerPunish",
                data: {
                    time: {
                        minutes,
                        days,
                        hours,
                    },
                    player,
                    reason,
                    staff: msg.author.username,
                    type: "mute",
                },
                to: "Pocketmine",
            },
            async (data: string | null) => {
                if (data) return await reply.edit(data);
                await reply.edit({
                    content: "",
                    embeds: [
                        {
                            title: "Server Mute",
                            color: Colors.Yellow,
                            description: `${player} was muted by ${msg.author.username}`,
                            fields: [
                                {
                                    name: "Mute Expiration",
                                    value: `${days} days, ${hours} hours, ${minutes} minutes`,
                                },
                                {
                                    name: "Reason",
                                    value: reason,
                                },
                            ],
                        },
                    ],
                });
            }
        );
    });
