import { ObjectModel } from "objectmodel"
import { Receivable } from "../RegisterReceivables"

export interface Player {
    id: number
    rank: string
    isStaff: boolean
    isOnline: boolean
    islandId: string
    onlineTime: number
    killStat: {
        currentPlace: number
        kills: number
    }
    friends: string[]
    discord: string
}

module.exports = new Receivable(new ObjectModel({
    id: Number,
    rank: String,
    isStaff: Boolean,
    isOnline: Boolean,
    islandId: String,
    onlineTime: Number,
    killStat: {
        currentPlace: Number,
        kills: Number
    },
    friends: [String],
    discord: String
}), "Pocketmine")
