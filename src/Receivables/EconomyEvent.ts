import { ObjectModel } from "objectmodel"

export interface EconomyEvent {
    player: string
    event: "pay"|"auction"|"shop"|"sold"
    money: number
    receiver?: string
    item?: string
    amount?: number
}

module.exports = new ObjectModel({
    player: String,
    event: ["pay","auction","shop","sold"],
    money: Number,
    receiver: [String],
    item: [String],
    amount: [String]
})