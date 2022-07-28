import {CoordinateInterface} from '../Utils/CoordinateModel'
export interface PlayerEvent {
    player: string
    event: "dies"|"join"|"quit"
    position: CoordinateInterface
    lastDamager: string
    cause: string
    isNew: [boolean]
}