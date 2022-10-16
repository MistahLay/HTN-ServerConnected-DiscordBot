import { Colors } from "discord.js";
import { Command } from "../BotCommand";
import { socket, channels } from "../Client";
module.exports = new Command(true)
    .setInfo("This will ban a player in the ingame server")
    .setParameters([
        { name: "player", info: "Recommended to use the player's XUID" },
        { name: "reason" },
    ])
    .onExecute(async (msg, [player, reason]) => {
        const reply = await msg.reply("**Sending Request...**");
        const username = msg.author.username;
        socket.sendRequest(
            {
                data_type: "PlayerPunish",
                data: {
                    player,
                    reason,
                    staff: username,
                    type: "ban",
                },
            },
            async (data: string | null) => {
                if (data) return await reply.edit(data);
                await reply.delete();
                const embed = {
                    content: "",
                    embeds: [
                        {
                            title: "Server Ban",
                            color: Colors.Red,
                            description: `${player} was permanently banned by ${username}`,
                            fields: [
                                {
                                    name: "Reason",
                                    value: reason,
                                },
                            ],
                        },
                    ],
                };
                await msg.reply(embed);
                await channels.ModLogs.send(embed);
                return;
            }
        );
    });
