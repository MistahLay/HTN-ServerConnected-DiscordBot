import { ObjectModel } from 'objectmodel'
import { Receivable } from '../RegisterReceivables'
import {CoordinateInterface, Model} from '../Utils/CoordinateModel'
export interface PlayerEvent {
    player: string
    event: "dies"|"join"|"quit"
    position: CoordinateInterface
    lastDamager: string
    cause: string
    isNew?: boolean
}

module.exports = new Receivable(new ObjectModel({
    player: String,
    event: ["dies","join","quit"],
    position: Model,
    lastDamager: String,
    cause: String,
    isNew: [Boolean]
}), "Pocketmine")