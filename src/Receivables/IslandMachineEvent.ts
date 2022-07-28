import { ObjectModel } from "objectmodel"
import { CoordinateInterface, Model } from "../Utils/CoordinateModel"

export interface IslandMachineEvent {
    islandID: string
    machine: "drill"|"net"|"cannon"
    owner: string
    location: CoordinateInterface
    event: "removed"|"placed"
    level: string
}
module.exports = new ObjectModel(
    {
        islandID: String,
        machine: ["drill","net","cannon"],
        owner: String,
        location: Model,
        event: ["removed","placed"],
        level: Number
    }
)
