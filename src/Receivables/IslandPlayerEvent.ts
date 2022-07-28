import { ObjectModel } from "objectmodel"

export interface IslandPlayersEvent {
    islandID: string
    player: string
    event: "banned"|"kicked"|"invited"|"left"|"demoted"|"promoted"
    punisher?: string
}

module.exports = new ObjectModel({
    islandID: String,
    player: String,
    event: String,
    punisher: ["banned","kicked","invited","left","demoted","promoted"]
})