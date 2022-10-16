import { APIEmbed, APIEmbedField, AttachmentBuilder, Colors } from "discord.js";
import { Command } from "../BotCommand";
import { socket } from "../Client";
import GetPlayerFace from "../Utils/GetPlayerFace";
export interface Player {
    rank: string;
    is_staff: boolean;
    island_id?: string;
    play_time: number;
    money: {
        current_place: number;
        amount: number;
    };
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
const statusIcon = {
    online: OnlineIcon,
    banned: Banned,
    offline: OfflineIcon,
    temporary_banned: Temporary_Banned,
};
const status = {
    online: "Online",
    offline: "Offline",
    banned: "Banned",
    temporary_banned: "Temporarily Banned",
};
const QueryInfo = "is_banned";
module.exports = new Command()
    .setInfo("This will ban a player in the ingame server")
    .setParameters([
        {
            name: "Player",
            info: "Replace spaces of the name with + or use an XUID",
        },
        { name: "Queries", info: QueryInfo },
    ])
    .onExecute((msg, [player, queries]) => {
        const name = (player as string).replace("+", " ");
        const query = (queries as string[]).includes("all")
            ? "all"
            : (queries as string[]);
        socket.sendRequest(
            {
                data: {
                    player: name,
                    queries: query,
                },
                data_type: "GetPlayerInfo",
            },
            async (data: Player) => {
                const face = await GetPlayerFace(data.face);
                let fields: APIEmbedField[] = [];
                if (query === "all") {
                    fields[0] = {
                        name: "Identifiers(IDs)",
                        value: `**XUID**: ${data.xuid}\n**Discord**: ${
                            data.discord ?? "Not Connected"
                        }\n**Island**: ${
                            data.island_id ?? "Haven't joined an Island"
                        }`,
                    };
                    fields[1] = {
                        name: "Leaderboard Rank",
                        value: `**Kills**: ${data.kill_stat.current_place}\n**Money**: ${data.money.current_place}`,
                    };
                    fields[2] = {
                        name: "Friends",
                        value: data.friends.toString(),
                    };
                    fields[3] = {
                        name: "Others",
                        value: `**Money**: $${data.money.amount}\n**Bank Money**: $${data.bank_money}\n**Kills**: ${data.kill_stat.kills}\n**Votes**: ${data.votes}\n**Ranks**: ${data.rank}`,
                    };
                }
                try {
                    const embed: APIEmbed = {
                        title: `${name.toUpperCase()}'s INFO`,
                        description: "The queried info",
                        fields,
                        footer: {
                            text: `${status[data.status]} • Play Time: ${
                                data.play_time
                            }`,
                        },
                    };
                    msg.reply({
                        embeds: [embed],
                        files: [face, statusIcon[data.status]],
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        );
    });
