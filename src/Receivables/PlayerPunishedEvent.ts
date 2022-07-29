import { ObjectModel } from "objectmodel"
import { Receivable } from "../RegisterReceivables"

export interface PlayerPunishEvent {
    player: String
    type: "banned"|"kicked"|"mute"|"warned"|"tempban"
    time?: {
        days: number
        hours: number
        minutes: number
    }
    staff: string
}

module.exports = new Receivable(
new ObjectModel({
    player: String,
    type: ["banned","kicked","mute","warned","tempban"],
    time: {
        days: Number,
        hours: Number,
        minutes: Number
    },
    staff: String
})
,"Pocketmine")

