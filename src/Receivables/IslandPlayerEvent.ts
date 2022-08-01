import { Colors, Emoji, TextChannel } from "discord.js"
import { ObjectModel } from "objectmodel"
import { client } from "../Client"
import { Receivable } from "../RegisterReceivables"

export interface IslandPlayersEvent {
    islandID: string
    player: string
    event: "banned"|"kicked"|"invited"|"left"|"demoted"|"promoted"
    punisher?: string
}

module.exports = new Receivable(new ObjectModel({
    islandID: String,
    player: String,
    event: ["banned","kicked","invited","left","demoted","promoted"],
    punisher: String
}), "Pocketmine")
.setCallback((data:IslandPlayersEvent) => {
    (client.channels.cache.get(require("../channels.json").StaffServer.IslandLogs) as TextChannel)
        .send({embeds:[{
            color: (data.event === "banned" || data.event === "kicked" || data.event === "left" || data.event === "demoted") ? Colors.Red : Colors.Green,
            title: `${data.player} has ${data.event === "left" ? "left" : "been" + data.event}`,
            description: 
                data.event === "left" ? undefined : 
                `${data.player} has been ${data.event} by ${data.punisher}`,
            fields: [{
                name: "IslandID",
                value: data.islandID
            }]
    }]})
})