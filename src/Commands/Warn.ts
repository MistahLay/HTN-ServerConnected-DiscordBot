import { Colors } from "discord.js";
import { Command } from "../BotCommand";
import { socket, channels } from "../Client";

module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParameters([
        { name: "player", info: "Use the XUID" },
        { name: "reason" },
    ])
    .onExecute(async (msg, [player, reason]) => {
        const reply = await msg.reply("**Sending Request...**");
        socket.sendRequest(
            {
                data_type: "PlayerPunish",
                data: {
                    player,
                    reason,
                    staff: msg.author.username,
                    type: "warn",
                },
            },
            async (data: string | null) => {
                if (data) return await reply.edit(data);
                const embed = {
                    content: "",
                    embeds: [
                        {
                            title: "Server Warn",
                            color: Colors.Yellow,
                            description: `${player} was warned by ${msg.author.username}`,
                            fields: [
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
