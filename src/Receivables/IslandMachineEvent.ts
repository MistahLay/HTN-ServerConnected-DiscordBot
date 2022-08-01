import { Colors, TextChannel } from "discord.js"
import { ObjectModel } from "objectmodel"
import { client } from "../Client"
import { Receivable } from "../RegisterReceivables"
import { CoordinateInterface, Model } from "../Utils/CoordinateModel"

export interface IslandMachineEvent {
    islandID: string
    machine: "drill"|"net"|"cannon"
    owner: string
    location: CoordinateInterface
    event: "removed"|"placed"
    level: string
}
module.exports = new Receivable(new ObjectModel(
    {
        islandID: String,
        machine: ["drill","net","cannon"],
        owner: String,
        location: Model,
        event: ["removed","placed"],
        level: Number
    }
), "Pocketmine")
.setCallback((data:IslandMachineEvent) => {
    const channel = client.channels.cache.get(require("../channels.json").StaffServer.IslandLogs) as TextChannel;
    channel.send({embeds:[
        {
            title: `Island machine event`,
            color: Colors.DarkButNotBlack,
            description: `**${data.machine.toUpperCase()}** has been ${data.event}`,
            fields: [
                {
                    name: "Location",
                    value: `x: ${data.location.x}\ny: ${data.location.y}\nz: ${data.location.z}`
                },
                {
                    name: "IslandID",
                    value: data.islandID
                },
                {
                    name: `Other ${data.machine} info`,
                    value: `Owner: ${data.owner} \nlevel: ${data.level}`
                }
            ]
        }
    ]})
})