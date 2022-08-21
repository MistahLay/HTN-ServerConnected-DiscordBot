import { Colors, TextChannel } from "discord.js";
import { ObjectModel } from "objectmodel";
import { client } from "../Client";
import { Receivable } from "../RegisterReceivables";
module.exports = new Receivable(
    new ObjectModel({
        crash_reason: String,
    }),
    "Pocketmine"
).setCallback((data: { crash_reason: string }) => {
    const crashLogChannel = client.channels.cache.get(
        require("../channels.json").StaffServer.CrashLogs
    ) as TextChannel;
    crashLogChannel.send({
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
