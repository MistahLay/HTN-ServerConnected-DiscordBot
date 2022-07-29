import { ObjectModel } from "objectmodel"
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
    event: String,
    punisher: ["banned","kicked","invited","left","demoted","promoted"]
}), "Pocketmine")
