import { ObjectModel } from "objectmodel";

export interface Default {
    success:boolean
}

module.exports = new ObjectModel({
    success:Boolean
})