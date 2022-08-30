import { Colors } from "discord.js";
import { ObjectModel } from "objectmodel";
import { channels } from "../Client";
import { Receivable } from "../RegisterReceivables";

export interface IslandPlayersEvent {
    islandID: string;
    player: string;
    event: "banned" | "kicked" | "invited" | "left" | "demoted" | "promoted";
    punisher?: string;
}
const channel = channels.PlayerLogs;
module.exports = new Receivable(
    new ObjectModel({
        islandID: String,
        player: String,
        event: ["banned", "kicked", "invited", "left", "demoted", "promoted"],
        punisher: String,
    }),
    "Pocketmine"
).setCallback((data: IslandPlayersEvent) => {
    channel.send({
        embeds: [
            {
                color:
                    data.event === "banned" ||
                    data.event === "kicked" ||
                    data.event === "left" ||
                    data.event === "demoted"
                        ? Colors.Red
                        : Colors.Green,
                title: `${data.player} has ${
                    data.event === "left" ? "left" : "been" + data.event
                }`,
                description:
                    data.event === "left"
                        ? undefined
                        : `${data.player} has been ${data.event} by ${data.punisher}`,
                fields: [
                    {
                        name: "IslandID",
                        value: data.islandID,
                    },
                ],
            },
        ],
    });
});
