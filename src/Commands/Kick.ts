import { Colors, TextChannel } from "discord.js";
import { Command } from "../BotCommand";
import { channels, socket } from "../Client";
module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParamType([
        { name: "player", type: "string" },
        { name: "reason", type: "string" },
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
                    type: "kick",
                },
                to: "Pocketmine",
            },
            async (data: string | null) => {
                if (data) return reply.edit(data);
                const embed = {
                    content: "",
                    embeds: [
                        {
                            title: "Server Kick",
                            color: Colors.Yellow,
                            description: `${player} was kicked by ${msg.author.username}`,
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
