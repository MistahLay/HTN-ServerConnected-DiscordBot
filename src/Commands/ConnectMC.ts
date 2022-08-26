import { Colors } from "discord.js";
import { Command } from "../BotCommand";
import { db } from "../Client";

module.exports = new Command()
    .setInfo(
        "For connecting to a ingame account \nNote: You need to add what discord specification(id or tag) you gave, if you gave a discord tag then add 'tag', if you gave a discord id then add 'id'"
    )
    .setParamType([
        { name: "discord specification", type: "string" },
        { name: "code", type: "number" },
    ])
    .onExecute(async (msg, [type, code]) => {
        if (!(type === "id" || type === "tag"))
            return msg.reply("Invalid discord specification");
        const reply = await msg.reply("Checking...");
        await db.query(
            `SELECT * FROM discord_codes WHERE discord='${
                type === "id" ? msg.author.id : msg.author.tag
            }' AND code='${code}'`,
            null,
            async (err, res) => {
                if (err) {
                    return await reply.edit({
                        content: "",
                        embeds: [
                            {
                                color: Colors.Red,
                                title: "Something went wrong try again later",
                            },
                        ],
                    });
                }
                if (res.length === 0)
                    return await reply.edit({
                        content: "",
                        embeds: [
                            {
                                color: Colors.Red,
                                title: "Invalid code or discord specification",
                            },
                        ],
                    });
                const { xuid } = res[0];
                db.query(
                    `UPDATE players SET discord='${msg.author.id}' WHERE xuid='${xuid}';DELETE FROM discord_codes WHERE xuid='${xuid}'`,
                    async (err) => {
                        if (err)
                            return await reply.edit({
                                content: "",
                                embeds: [
                                    {
                                        color: Colors.Red,
                                        title: "Something went wrong try again later",
                                    },
                                ],
                            });
                        db.query(
                            `SELECT name FROM players WHERE xuid='${xuid}'`,
                            (err, name) =>
                                reply.edit({
                                    content: "",
                                    embeds: [
                                        {
                                            color: Colors.Green,
                                            title: "Success!!",
                                            description:
                                                "You have connected to " +
                                                name[0].name,
                                        },
                                    ],
                                })
                        );
                    }
                );
            }
        );
    });
