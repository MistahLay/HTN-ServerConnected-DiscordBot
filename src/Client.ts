import { ActivityType, Client, Colors, Message, TextChannel } from "discord.js";
import { commands, registerCommands } from "./BotCommand";
import { SocketConnection } from "./SocketConnection";
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/.env" });
const token = process.env.TOKEN;
export const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});
export const socket = new SocketConnection();
export const db = mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    database: "ServerDatabase",
    user: "sqluser",
    password: "password",
    multipleStatements: true,
});
export const channels: { [key: string]: TextChannel } = {};
socket.on("Connected", () => {
    client.user?.setActivity("Main Server Socket", {
        type: ActivityType.Listening,
    });
    console.log("Connected");
});
socket.on("Disconnect", () => {
    client.user?.setActivity();
    console.log("Disconnected");
});
client.once("ready", async () => {
    await registerChannels();
    client.user?.setActivity();
    socket.handleConnection(true);
    await registerCommands();
    require("./PMMPServerStatus");
    console.log("Bot Online");
});
client.on("messageCreate", async (msg) => {
    if (msg.channelId === require("./channels.json").StaffServer.ServerStatus) {
        await msg.delete();
        return;
    }
    if (msg.author.bot) return;
    await CommandValidator(msg);
});
async function CommandValidator(msg: Message) {
    if (!msg.content.startsWith(">")) return;
    const args = msg.content.slice(1).split(" ");
    const cmd = commands[args[0].toLowerCase()];
    args.shift();
    if (!cmd) {
        return msg.reply({
            embeds: [
                {
                    title: "Command Error",
                    color: Colors.Red,
                    description: `Command doesnt exist pls do >help for the list of valid commands`,
                },
            ],
        });
    }
    if (!Object.hasOwn(cmd, "paramType")) {
        cmd.execute?.(msg, args);
        return;
    }
    if (
        !(cmd.paramType.length === 0) &&
        !(cmd.paramType.length <= args.length)
    ) {
        msg.reply({
            embeds: [
                {
                    title: "Command Error",
                    color: Colors.Red,
                    description:
                        "Command is missing " +
                        (cmd.paramType.length - args.length) +
                        " arguments pls do ``>help <command>`` to get more info about the command",
                },
            ],
        });
        return;
    }
    for (let index = 0; index < cmd.paramType.length; index++) {
        switch (cmd.paramType[index].type) {
            case "number":
                if (isNaN(args[index] as any))
                    return msg.reply({
                        embeds: [
                            {
                                title: "Command Error",
                                color: Colors.Red,
                                description: `Parameter <${cmd.paramType[index].name}> must be a number, given string`,
                            },
                        ],
                    });
                break;
            case "string":
                break;
            default:
                if (!cmd.paramType[index].type.includes(args[index]))
                    return msg.reply({
                        embeds: [
                            {
                                title: "Command Error",
                                color: Colors.Red,
                                description: `Parameter <${
                                    cmd.paramType[index].name
                                }> must be ${cmd.paramType[
                                    index
                                ].type.toString()} of these, given ${
                                    args[index]
                                }`,
                            },
                        ],
                    });
                break;
        }
    }
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
