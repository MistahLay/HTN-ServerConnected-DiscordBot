import { Colors, TextChannel } from "discord.js";
import { ObjectModel } from "objectmodel";
import { client } from "../Client";
import { Receivable } from "../ReceivableModel";
type Events = "pay" | "auction" | "shop" | "sold";
export interface EconomyEvent {
    player: string;
    event: Events;
    money: number;
    receiver?: string;
    item?: string;
    amount?: number;
}
module.exports = new Receivable({
    player: String,
    event: ["pay", "auction", "shop", "sold"],
    money: Number,
    receiver: [String],
    item: [String],
    amount: [Number],
}).onReceive((data: EconomyEvent) => {
    (
        client.channels.cache.get(
            require("../channels.json").StaffServer.EconomyLogs
        ) as TextChannel
    ).send({
        embeds: [
            {
                title:
                    data.event === "pay"
                        ? "Player Pay Event"
                        : data.event === "auction"
                        ? "Auction Event"
                        : data.event === "shop"
                        ? "Shop event"
                        : "Player Sold Event",
                description:
                    data.event === "pay"
                        ? `${data.player} has payed ${data.receiver} $${data.amount}`
                        : data.event === "auction"
                        ? `${data.player} has bought ${data.amount} of ${data.receiver}'s **${data.item}** for $${data.money}`
                        : data.event === "shop"
                        ? `${data.player} has bought ${data.amount} of **${data.item}** for $${data.money}`
                        : `${data.player} has sold ${data.amount} of ${data.item} for $${data.money}`,
                color:
                    data.event === "auction"
                        ? 0x663611
                        : data.event === "pay"
                        ? Colors.Green
                        : data.event === "shop"
                        ? Colors.DarkGreen
                        : Colors.Gold,
            },
        ],
    });
});
