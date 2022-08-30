import { Colors } from "discord.js";
import { ObjectModel } from "objectmodel";
import { channels } from "../Client";
import { Receivable } from "../RegisterReceivables";
const channel = channels.CrashLogs;
module.exports = new Receivable(
    new ObjectModel({
        crash_reason: String,
    }),
    "Pocketmine"
).setCallback((data: { crash_reason: string }) => {
    channel.send({
        embeds: [
            {
                title: "Server Crash",
                color: Colors.DarkRed,
                description: "Server has crashed",
                fields: [
                    {
                        name: "Crash Reason",
                        value: data.crash_reason,
                    },
                ],
            },
        ],
    });
});
