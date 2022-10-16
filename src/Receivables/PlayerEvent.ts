import { Colors } from "discord.js";
import { ObjectModel } from "objectmodel";
import { channels } from "../Client";
import { Receivable } from "../ReceivableModel";
import { CoordinateInterface, Model } from "../Utils/CoordinateModel";
export interface PlayerEvent {
    player: string;
    event: "dies" | "join" | "quit" | "vote";
    position?: CoordinateInterface;
    lastDamager?: string;
    cause?: string;
    isNew?: boolean;
    voteParty?: number;
}

module.exports = new Receivable({
    player: String,
    event: ["dies", "join", "quit", "vote"],
    position: [Model],
    lastDamager: [String],
    cause: [String],
    isNew: [Boolean],
    voteParty: [Number],
}).onReceive((data: PlayerEvent) => {
    const channel = channels.ModLogs;
    switch (data.event) {
        case "join":
        case "quit":
            channel.send(
                `${data.isNew ? "New player " : ""}${data.player} ${
                    data.event === "quit" ? "left" : "joined"
                } the game`
            );
            return;
        case "vote":
            channel.send(
                `${data.player} has voted\ncurrent votes: ${data.voteParty}`
            );
            data.voteParty === 100
                ? channel.send(":tada: VoteParty has been commenced :tada:")
                : 0;
            return;
        case "dies":
            if (!data.cause) return;
            if (!data.lastDamager) return;
            channel.send({
                embeds: [
                    {
                        color: Colors.Red,
                        title: `${data.player} died`,
                        fields: [
                            {
                                name: "LastDamager",
                                value: data.lastDamager,
                            },
                            {
                                name: "Cause",
                                value: data.cause,
                            },
                            {
                                name: "Position",
                                value: `x: ${data.position?.x}, y: ${data.position?.y}, z: ${data.position?.z}`,
                            },
                        ],
                    },
                ],
            });
            return;
        default:
            console.log("Invalid event type received");
            return;
    }
});
