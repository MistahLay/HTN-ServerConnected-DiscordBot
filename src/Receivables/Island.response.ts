import { ArrayModel, ObjectModel } from "objectmodel";
import { Receivable } from "../ReceivableModel";
import { CoordinateInterface, Model } from "../Utils/CoordinateModel";
export interface Island {
    machines?: {
        type: "cannon" | "drill" | "net";
        level: number;
        owner: string;
        location: CoordinateInterface;
    }[];
    cubegens?: {
        type: String;
        level: number;
        owner: string;
        location: CoordinateInterface;
    }[];
    members?: {
        permission: string;
        name: string;
    }[];
    spawners?: {
        location: CoordinateInterface;
        level: String;
        type: string;
    }[];
}

module.exports = new Receivable({
    machines: [
        ArrayModel({
            type: ["cannon", "drill", "net"],
            level: Number,
            owner: String,
            location: Model,
        }),
    ],
    cubegens: [
        ArrayModel({
            type: String,
            level: Number,
            owner: String,
            location: Model,
        }),
    ],
    members: [
        ArrayModel({
            member: String,
            permission: String,
        }),
    ],
    spawners: [
        ArrayModel({
            type: String,
            level: Number,
            location: Model,
        }),
    ],
});
