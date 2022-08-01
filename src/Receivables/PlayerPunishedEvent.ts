import { Colors, TextChannel } from "discord.js"
import { ObjectModel } from "objectmodel"
import { client } from "../Client"
import { Receivable } from "../RegisterReceivables"

export interface PlayerPunishEvent {
    player: String
    type: "banned"|"kicked"|"muted"|"warned"|"tempbanned"
    time?: {
        days: number
        hours: number
        minutes: number
    }
    staff: string
}

module.exports = new Receivable(
new ObjectModel({
    player: String,
    type: ["banned","kicked","muted","warned","tempbanned"],
    time: {
        days: Number,
        hours: Number,
        minutes: Number
    },
    staff: String
})
,"Pocketmine")
.setCallback((data:PlayerPunishEvent) => {
    const channel = client.channels.cache.get(require("../channels.json").StaffServer.ModLogs) as TextChannel
    channel.send({
        embeds: [{
            title: "PlayerPunished",
            color: Colors.DarkRed,
            description: `${data.player} has been ${data.type} by ${data.staff}`,
            fields: (data.time && (data.type === "muted" || data.type === "tempbanned")) ? [{
                name: `${data.type.toUpperCase()} time` ,
                value: `days: ${data.time.days}\nhours: ${data.time.hours}\nminutes: ${data.time.minutes}`
            }] : []
        }]
    })
})