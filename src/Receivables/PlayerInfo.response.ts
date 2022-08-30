import { ArrayModel, ObjectModel } from "objectmodel";
import { Receivable } from "../RegisterReceivables";

module.exports = new Receivable(
    new ObjectModel({
        xuid: String,
        rank: String,
        is_staff: Boolean,
        status: ["banned", "online", "offline", "temp_banned"],
        island_id: [String],
        play_time: Number,
        kill_stat: {
            current_place: Number,
            kills: Number,
        },
        friends: ArrayModel(String),
        discord: [String],
        face: [String],
        money: Number,
        bank_money: Number,
        votes: Number
    }),
    "Pocketmine"
);
