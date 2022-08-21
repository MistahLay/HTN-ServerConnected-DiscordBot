import query from "@mcpedb/query";
import { APIEmbed, Colors, Message, TextChannel } from "discord.js";
import { client, socket } from "./Client";
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
                value: socket.isPMMPOnline() ? "Online" : "Offline",
            };
        }
        ServerStatus.title = "Server Status: Online :green_circle:";
        ServerStatus.color = Colors.Green;
        if (ServerStatus.footer)
            ServerStatus.footer.text = "version: " + server.version;
        if (message) return await message.edit({ embeds: [ServerStatus] });
        await channel.send({ embeds: [ServerStatus] });
    } catch (error) {
        ServerStatus.fields = [];
        ServerStatus.color = Colors.Red;
        ServerStatus.title = "Server Status: Offline :red_circle:";
        if (message) return await message.edit({ embeds: [ServerStatus] });
        await channel.send({ embeds: [ServerStatus] });
    }
}, 1000 * 5);
