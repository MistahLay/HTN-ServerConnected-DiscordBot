import { Client, Embed, Message } from "discord.js";
import { Command, commands, commandsInfo } from "./Command";
import fs from 'fs';

require('dotenv').config({path: __dirname + "/.env"});
const token = process.env.TOKEN;

const client = new Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "DirectMessages",
        "MessageContent"
    ]
});
client.once("ready", () => {
    console.log("The bot is ready");
});
client.on("messageCreate", async msg => {
    if(msg.author.bot) return;
    if(!msg.content.startsWith("s!")) return;
    const args = msg.content.slice(2).split(" ");
    if(args[0] === "help") {
        msg.reply({embeds:[commandsInfo]});
        return;
    }
    const cmd = commands[args[0]];
    args.shift();
    if(!cmd) return;
    cmd.execute?.(msg, args);
    // commands.forEach(cmdName => {
    //     if(args[0].toLowerCase() === cmdName.toLowerCase()) console.log(":)");
    // });
});
client.login(token);