import { ObjectModel } from "objectmodel";
import { channels } from "../Client";
import { Receivable } from "../RegisterReceivables";
const channel = channels.ServerChat;
module.exports = new Receivable(
    new ObjectModel({ player: String, message: String }),
    "Pocketmine"
).setCallback((msg: { player: string; message: string }) =>
    channel.send(`${msg.player} **≫** ${msg.message}`)
);
