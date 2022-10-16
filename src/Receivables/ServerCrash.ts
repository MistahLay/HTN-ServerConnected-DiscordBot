import { Colors } from "discord.js";
import { channels } from "../Client";
import { Receivable } from "../ReceivableModel";
const channel = channels.CrashLogs;
module.exports = new Receivable("string").onReceive((data: string) => {
    channel.send({
        embeds: [
            {
                title: "Server Crash",
                color: Colors.DarkRed,
                description: "Server has crashed",
                fields: [
                    {
                        name: "Crash Reason",
                        value: data,
                    },
                ],
            },
        ],
    });
});
