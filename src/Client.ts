import { APIEmbedField, Client, Message, TextChannel } from "discord.js";
import { commands, registerCommands } from "./BotCommand";
import mysql from "mysql";
import dotenv from "dotenv";
import { ServerSocket } from "./ServerSocket";

dotenv.config({ path: __dirname + "/.env" });
const token = process.env.TOKEN;
export const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});
export const db = mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    database: "ServerDatabase",
    user: "sqluser",
    password: "password",
    multipleStatements: true,
});
export const channels: { [key: string]: TextChannel } = {};
export const socket = new ServerSocket();
client.on("ready", async () => {
    await registerChannels();
    await registerCommands();
    console.log("Bot is ready");
});
const s = require("./channels.json").StaffServer as { [key: string]: string };
client.on("messageCreate", async (msg) => {
    if (s[msg.channelId]) {
        await msg.delete();
        return;
    }
    if (msg.author.bot) return;
    await CommandValidator(msg);
});
// prettier-ignore
function commandError(msg:Message, reason: string, fields: APIEmbedField[] = []){
    msg.reply({embeds:[{
        title: "Command Error",
        description: reason,
        fields
    }]});
}
// prettier-ignore
async function CommandValidator(msg: Message) {
    if (!msg.content.startsWith(">")) return;
    let args = msg.content.slice(1).split(" ");
    if(!args[0]) return commandError(msg, "Pls input a command")
    const cmd = commands[args.shift()?.toLowerCase() ?? "unknown"];
    if(!cmd) return commandError(msg, "Command doesn't exists");
    if(cmd.requiredServerOnline)
        if(socket.isOnline()) return commandError(msg, "Command requires the ingame server to be online")
    if(!(cmd.roles.length === 0))
        if(await (new Promise((r) => {
        let current = 0;
        const roles = msg.member?.roles.cache.size;
        msg.member?.roles.cache.forEach(role => {
            if(cmd.roles.includes(role.id)) r(true);
            if(current === roles) r(false);
        })
    }))) return commandError(msg, "Command cannot be used");
    if(!(cmd.parameters.length === 0) && cmd.parameters.length <= args.length) return commandError(msg, `${cmd.parameters.length - args.length} arguments we're added, need ${cmd.parameters.length}`);
    await cmd.execute?.(msg, args);
}
async function registerChannels() {
    const rwchannels = require("./channels.json").StaffServer as {
        [key: string]: string;
    };
    for (const key in rwchannels) {
        channels[key] = client.channels.cache.get(
            rwchannels[key]
        ) as TextChannel;
    }
}
client.login(token);
