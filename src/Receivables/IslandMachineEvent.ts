import { Colors } from "discord.js";
import { ObjectModel } from "objectmodel";
import { channels } from "../Client";
import { Receivable } from "../RegisterReceivables";
import { CoordinateInterface, Model } from "../Utils/CoordinateModel";
const channel = channels.IslandLogs;
export interface IslandMachineEvent {
    islandID: string;
    machine: "drill" | "net" | "cannon";
    owner: string;
    location: CoordinateInterface;
    event: "removed" | "placed";
    level: string;
}
module.exports = new Receivable(
    new ObjectModel({
        islandID: String,
        machine: ["drill", "net", "cannon"],
        owner: String,
        location: Model,
        event: ["removed", "placed"],
        level: Number,
    }),
    "Pocketmine"
).setCallback((data: IslandMachineEvent) => {
    channel.send({
        embeds: [
            {
                title: `Island machine event`,
                color: Colors.DarkButNotBlack,
                description: `**${data.machine.toUpperCase()}** has been ${
                    data.event
                }`,
                fields: [
                    {
                        name: "Location",
                        value: `x: ${data.location.x}\ny: ${data.location.y}\nz: ${data.location.z}`,
                    },
                    {
                        name: "IslandID",
                        value: data.islandID,
                    },
                    {
                        name: `Other ${data.machine} info`,
                        value: `Owner: ${data.owner} \nlevel: ${data.level}`,
                    },
                ],
            },
        ],
    });
});
