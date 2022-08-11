import { Client, Colors } from "discord.js";
import { commands, getCommands } from "./BotCommand";
import { SocketConnection } from "./SocketConnection";
require("dotenv").config({ path: __dirname + "/.env" });
const token = process.env.TOKEN;

export const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});
export const socket = new SocketConnection();
client.once("ready", () => {
  console.log("The bot is ready");
});
(async () => await getCommands())();
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith("c?")) return;
  const args = msg.content.slice(2).split(" ");
  const cmd = commands[args[0].toLowerCase()];
  args.shift();
  if (!cmd) {
    msg.reply({
      embeds: [
        {
          title: "Command Error",
          color: Colors.Red,
          description: `Command doesnt exist pls do c?help for the list of valid commands`,
        },
      ],
    });
  }
  if (!Object.hasOwn(cmd, "paramType")) {
    cmd.execute?.(msg, args);
    return;
  }
  if (!(cmd.paramType.length === 0) && !(cmd.paramType.length <= args.length)) {
    msg.reply({
      embeds: [
        {
          title: "Command Error",
          color: Colors.Red,
          description:
            "Command is missing " +
            (cmd.paramType.length - args.length) +
            " arguments pls do ``c?help <command>`` to get more info about the command",
        },
      ],
    });
    return;
  }
  for (let index = 0; index < cmd.paramType.length; index++) {
    if (cmd.paramType[index].type === "number" && isNaN(args[index] as any)) {
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
});
client.login(token);
