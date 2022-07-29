import { ObjectModel } from "objectmodel"
import { Receivable } from "../RegisterReceivables"

export interface EconomyEvent {
    player: string
    event: "pay"|"auction"|"shop"|"sold"
    money: number
    receiver?: string
    item?: string
    amount?: number
}

module.exports = new Receivable(new ObjectModel({
    player: String,
    event: ["pay","auction","shop","sold"],
    money: Number,
    receiver: [String],
    item: [String],
    amount: [String]
}), "Pocketmine")
