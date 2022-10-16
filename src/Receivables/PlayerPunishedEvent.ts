import { APIEmbed, Colors } from "discord.js";
import { channels } from "../Client";
import { Receivable } from "../ReceivableModel";

export interface PlayerPunishEvent {
    player: String;
    type: "banned" | "kicked" | "muted" | "warned" | "tempbanned";
    time?: {
        days: number;
        hours: number;
        minutes: number;
    };
    reason: string;
    staff: string;
}
const channel = channels.ModLogs;
module.exports = new Receivable({
    player: String,
    type: ["banned", "kicked", "muted", "warned", "tempbanned"],
    time: [
        {
            days: Number,
            hours: Number,
            minutes: Number,
        },
    ],
    reason: String,
    staff: String,
}).onReceive((data: PlayerPunishEvent) => {
    const embed: APIEmbed = {
        title: "PlayerPunished",
        color: Colors.DarkRed,
        description: `${data.player} has been ${data.type} by ${data.staff}`,
        fields: [
            {
                name: "Reason",
                value: data.reason,
            },
        ],
    };
    data.time && (data.type === "muted" || data.type === "tempbanned")
        ? embed.fields?.push({
              name: `${data.type === "muted" ? "Mute" : "Ban"} expiration`,
              value: `days: ${data.time.days}, hours: ${data.time.hours}, minutes: ${data.time.minutes}`,
          })
        : 0;
    channel.send({
        embeds: [embed],
    });
});
