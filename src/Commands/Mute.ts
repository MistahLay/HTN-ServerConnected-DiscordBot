import { Colors } from "discord.js";
import { Command } from "../BotCommand";
import { socket, channels } from "../Client";

module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParameters([
        { name: "player", info: "Use the XUID" },
        { name: "reason" },
        { name: "days" },
        { name: "hours" },
        { name: "minutes" },
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
            },
            async (data: string | null) => {
                if (data) return await reply.edit(data);
                const embed = {
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
                };
                await reply.edit(embed);
                await channels.ModLogs.send(embed);
            }
        );
    });
