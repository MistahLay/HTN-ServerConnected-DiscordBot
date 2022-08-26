import { TextChannel } from "discord.js";
import { ObjectModel } from "objectmodel";
import { client } from "../Client";
import { Receivable } from "../RegisterReceivables";
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

module.exports = new Receivable(
    new ObjectModel({
        player: String,
        event: ["dies", "join", "quit", "vote"],
        position: [Model],
        lastDamager: [String],
        cause: [String],
        isNew: [Boolean],
        voteParty: [Number],
    }),
    "Pocketmine"
).setCallback((data: PlayerEvent) => {
    const channel = client.channels.cache.get(
        require("../channels.json").StaffServer.PlayerLogs
    ) as TextChannel;
    const Fields: { name: string; value: string }[] =
        data.event === "dies"
            ? [
                  {
                      name: "LastDamager",
                      value: `${data.lastDamager}`,
                  },
                  {
                      name: "Cause",
                      value: `${data.cause}`,
                  },
                  {
                      name: "Position",
                      value: `x: ${data.position?.x}\ny: ${data.position?.y}\nz: ${data.position?.z}`,
                  },
              ]
            : data.event === "vote"
            ? [
                  {
                      name: "CurrentVotes",
                      value: `${data.voteParty}`,
                  },
              ]
            : [];
    if (data.event === "join" || data.event === "quit")
        return channel.send(
            `${data.isNew ? "New player " : ""}${data.player} ${
                data.event === "quit" ? "left" : "joined"
            } the game`
        );
    if (data.voteParty === 100)
        return (
            channel.send(":tada: VoteParty has been commenced :tada: "),
            channel.send({
                embeds: [
                    {
                        title: `${data.isNew ? "New " : ""}${data.player} has ${
                            data.event === "dies"
                                ? data.event.replace("s", "d")
                                : data.event + "ed"
                        }`,
                        fields: Fields,
                    },
                ],
            })
        );
});
