import { ActivityType, Client, Colors, Message } from "discord.js";
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
        if (
            cmd.paramType[index].type === "number" &&
            isNaN(args[index] as any)
        ) {
            msg.reply({
                embeds: [
                    {
                        title: "Command Error",
                        color: Colors.Red,
                        description: `Parameter <${cmd.paramType[index].name}> must be a number, given string`,
                    },
                ],
            });
            return;
        }
    }
    await cmd.execute?.(msg, args);
}

client.login(token);
