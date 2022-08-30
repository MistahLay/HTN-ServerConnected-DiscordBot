import { AttachmentBuilder, Colors } from "discord.js";
import { Command } from "../BotCommand";
import { socket } from "../Client";
import GetPlayerFace from "../Utils/GetPlayerFace";
export interface Player {
    rank: string;
    is_staff: boolean;
    island_id?: string;
    play_time: number;
    money: number;
    kill_stat: {
        current_place: number;
        kills: number;
    };
    friends: string[];
    discord?: string;
    face: string;
    ban_expiration?: {
        days: number;
        hours: number;
        minutes: number;
    };
    xuid: string;
    status: "online" | "banned" | "offline" | "temporary_banned";
    bank_money: number;
    votes: number;
}
const OnlineIcon = new AttachmentBuilder("./Utils/Online.png").setName(
    "status.png"
);
const OfflineIcon = new AttachmentBuilder("./Utils/Offline.png").setName(
    "status.png"
);
const Banned = new AttachmentBuilder("./Utils/Banned.png").setName(
    "status.png"
);
const Temporary_Banned = new AttachmentBuilder("./Utils/TempBan.png").setName(
    "status.png"
);
module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParamType([{ name: "player", type: "string" }])
    .onExecute((msg, [player]) => {
        socket.sendRequest(
            {
                data: {
                    player,
                },
                data_type: "GetPlayerInfo",
                to: "Pocketmine",
            },
            async (data: Player) => {
                console.log(data);
                const face = await GetPlayerFace(data.face);
                try {
                    await msg.reply({
                        embeds: [
                            {
                                title: `${
                                    data.is_staff ? "Staff Member: " : ""
                                }${player} (${data.rank.toUpperCase()}) info`,
                                color: Colors.Green,
                                thumbnail: { url: "attachment://face.png" },
                                description:
                                    "The list of info about the player",
                                fields: [
                                    {
                                        name: "Identifiers(IDs)",
                                        value: `**XUID**: ${
                                            data.xuid
                                        }\n**Discord**: ${
                                            data.discord ?? "Not Connected"
                                        }\n**Island**: ${
                                            data.island_id ??
                                            "Haven't joined an island"
                                        }`,
                                    },
                                    {
                                        name: "Leaderboard Rank",
                                        value: `**Kills**: #${data.kill_stat.current_place}\n**Money**: #${data.money}`,
                                    },
                                    {
                                        name: "Friends",
                                        value:
                                            data.friends.length === 0
                                                ? "0 friends :("
                                                : data.friends.toString(),
                                    },
                                    {
                                        name: "Others",
                                        value: `**Money**: $${data.money}\n**Bank Money**: $${data.bank_money}\n**Kills**: ${data.kill_stat.kills}\n**Votes**: ${data.votes}`,
                                    },
                                ],
                                footer: {
                                    icon_url: "attachment://status.png",
                                    text:
                                        (data.status === "temporary_banned"
                                            ? "Temporarily Banned"
                                            : data.status
                                                  .charAt(0)
                                                  .toUpperCase() +
                                              data.status.slice(1)) +
                                        (data.status === "temporary_banned"
                                            ? data.ban_expiration
                                                ? `${data.ban_expiration.days} days, 
                                                ${data.ban_expiration.hours} hours, 
                                                ${data.ban_expiration.minutes} minutes`
                                                : "No expiration given"
                                            : "") +
                                        " • Play Time:" +
                                        data.play_time,
                                },
                            },
                        ],
                        files: [
                            face,
                            data.status === "online"
                                ? OnlineIcon
                                : data.status === "banned"
                                ? Banned
                                : data.status === "temporary_banned"
                                ? Temporary_Banned
                                : OfflineIcon,
                        ],
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        );
    });
