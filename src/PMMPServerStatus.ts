import query from "@mcpedb/query";
import { APIEmbed, Colors, Message, TextChannel } from "discord.js";
import { Server } from "ws";
import { client, socket } from "./Client";
import { ServerSocket } from "./ServerSocket";
const channel = client.channels.cache.get(
    require("./channels.json").StaffServer.ServerStatus
) as TextChannel;
export const ServerStatus: APIEmbed = {
    title: "Server Status: :green_circle:",
    color: Colors.Green,
    description: "Player Lists using **@mcpedb/query**",
    fields: [
        {
            name: "Players",
            value: "online: \n\nplayers:",
        },
        {
            name: "Socket",
            value: "Unknown",
        },
    ],
    footer: {
        text: "version: 1.19.20",
    },
};
function getCurrentMessage(): Promise<Message | null> {
    return new Promise(async (r) => {
        const messages = await channel.messages.fetch({ limit: 1 });
        messages.forEach((v) => r(v));
        r(null);
    });
}
(async () => {
    const message = await getCurrentMessage();
    if (message) return;
    channel.send({ embeds: [ServerStatus] });
})();
setInterval(async () => {
    const message = await getCurrentMessage();
    if (!(message?.author.id === client.user?.id)) return;
    try {
        const server = await query("play.fallentech.io", 19132, 1000 * 3);
        if (ServerStatus.fields) {
            ServerStatus.fields[0] = {
                name: "Players",
                value: `\`\`Online:\`\` **${server.online}/${
                    server.max
                }**\n\`\`HitList:\`\` ${server.players.toString()}`,
            };
            ServerStatus.fields[1] = {
                name: "Socket",
                value: socket.isOnline() ? "Alive" : "Dead",
            };
        }
        ServerStatus.title = "Server Status: Online :green_circle:";
        ServerStatus.color = socket.isOnline() ? Colors.Green : Colors.Yellow;
        if (ServerStatus.footer)
            ServerStatus.footer.text = "version: " + server.version;
        if (message) return await message.edit({ embeds: [ServerStatus] });
        await channel.send({ embeds: [ServerStatus] });
    } catch (error) {
        if (ServerStatus.fields) {
            ServerStatus.fields[0] = {
                name: "Socket",
                value: socket.isOnline() ? "Alive" : "Dead",
            };
        }
        ServerStatus.title = "Server Status: Offline :red_circle:";
        ServerStatus.description = "@everyone THERE IS SOMETHING WRONG";
        ServerStatus.color = socket.isOnline() ? Colors.Red : Colors.Orange;
        if (ServerStatus.footer)
            ServerStatus.footer.text = "version: " + "unknown";
        if (message) return await message.edit({ embeds: [ServerStatus] });
        await channel.send({ embeds: [ServerStatus] });
    }
}, 1000 * 5);
