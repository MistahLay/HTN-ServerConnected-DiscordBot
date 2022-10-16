import { Colors, Message } from "discord.js";
import { Command } from "../BotCommand";
import { db, socket } from "../Client";

module.exports = new Command()
    .setInfo("For connecting to a ingame account")
    .setParameters([
        {
            name: "ingame-name",
            info: "Your ingame name",
        },
        { name: "code", info: "The code that was given" },
    ])
    .onExecute(async (msg, [name, code]) => {
        const m: Message<boolean> = await msg.reply("checking...");
        if (isNaN(code as any)) return m.edit("Code is not a valid number");
        db.query(
            `SELECT EXISTS(SELECT xuid FROM discord_codes WHERE code='${code}' AND name='${name}')`,
            async (err, res) => {
                if (err) {
                    await m.edit({
                        embeds: [
                            {
                                title: "Error",
                                description: err.message,
                                color: Colors.Red,
                            },
                        ],
                    });
                    return;
                }
                socket.sendData({
                    data: res.xuid,
                    data_type: "Discord_Connected",
                });
                await m.edit({
                    embeds: [
                        {
                            title: "Success",
                            color: Colors.Green,
                            description: "Successfully connected account",
                        },
                    ],
                });
            }
        );
    });
