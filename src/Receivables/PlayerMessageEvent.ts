import { TextChannel } from "discord.js";
import { ObjectModel } from "objectmodel";
import { client } from "../Client";
import { Receivable } from "../RegisterReceivables";
const channel = client.channels.cache.get("979636677624602634") as TextChannel;
module.exports = new Receivable(
    new ObjectModel({ player: String, message: String }),
    "Pocketmine"
).setCallback((msg: { player: string; message: string }) =>
    channel.send(`${msg.player} **≫** ${msg.message}`)
);
