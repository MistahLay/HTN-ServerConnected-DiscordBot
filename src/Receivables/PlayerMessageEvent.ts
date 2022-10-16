import { ObjectModel } from "objectmodel";
import { channels } from "../Client";
import { Receivable } from "../ReceivableModel";
const channel = channels.ServerChat;
module.exports = new Receivable({ player: String, message: String }).onReceive(
    (msg: { player: string; message: string }) =>
        channel.send(`${msg.player} **≫** ${msg.message}`)
);
