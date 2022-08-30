import { APIEmbed, Attachment, Colors, TextChannel } from "discord.js";
import { Command } from "../BotCommand";
import { client } from "../Client";
const types = ["reason", "attachment", "false", "appealed"];
const channel = client.channels.cache.get(
    require("../channels.json").StaffServer.ModLogs
) as TextChannel;
module.exports = new Command()
    .setInfo(`To edit a existing log.`)
    .setParamType([
        { name: "EditType", type: types },
        { name: "Reasons", type: "string", optional: true },
    ])
    .onExecute(async (msg, [id, type, reason]) => {
        try {
            const log = await channel.messages.fetch(id);
            const embed = Object.assign({}, log.embeds[0]) as APIEmbed;
            if (!embed.fields) return await msg.reply("Invalid message");
            switch (type) {
                case "reason":
                    if (!reason) return await msg.reply("Should have a reason");
                    embed.fields[0] = {
                        name: "Reason",
                        value: "Updated " + reason,
                    };
                    await log.edit({ embeds: [embed] });
                    await msg.reply("Success!");
                    return;
                case "attachment":
                    // await log.edit({ attachments: log.attachments.});
                    return;
                case "false":
                    embed.color = Colors.DarkGreen;
                    embed.title = "False Punishment";
                    await log.edit({ embeds: [embed] });
                    await msg.reply("Success!");
                    return;
                case "appealed":
                    embed.color = Colors.Green;
                    embed.title = "Punishment Appealed";
                    embed.description = `Reason: \n`;
                    return;
                default:
                    msg.reply("Invalid type");
                    return;
            }
        } catch (error) {
            msg.reply("Message doesnt exist");
        }
    });
