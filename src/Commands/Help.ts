import { APIEmbed, APIEmbedField, Colors } from "discord.js";
import { Command, commands } from "../BotCommand";
const fields: APIEmbedField[] = [];
for (const name in commands) {
    if (commands[name].isInvisible) continue;
    fields.push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: "``>" + name + "`` " + get(commands[name].parameters),
    });
}
export let commandsInfo: APIEmbed = {
    title: "List of Commands",
    description:
        "Note: When the server is down most of the commands will not work ofc. \n-LayWasTaken",
    color: Colors.Green,
    fields,
};
module.exports = new Command(false, true).onExecute(async (msg, args) => {
    if (args[0]) {
        const cmd = commands[args[0]];
        if (cmd) {
            const cmd_args: string = await new Promise((r) => {
                let s: string = "";
                let i = 0;
                cmd.parameters.forEach((p) => {
                    s += `**${p.name}**: ${p.info ?? "No Info"}\n`;
                    i++;
                    if (i === cmd.parameters.length) r(s);
                });
            });
            msg.reply({
                embeds: [
                    {
                        title: args[0].toUpperCase() + " Info",
                        color: Colors.Green,
                        description: commands[args[0]].info,
                        fields: [
                            {
                                name: "Arguments",
                                value: cmd_args,
                            },
                        ],
                    },
                ],
            });
            return;
        }
        msg.reply({
            embeds: [
                {
                    title: "Command Error",
                    color: Colors.Red,
                    description:
                        "Unknown command pls do ``>help`` for the list of commands",
                },
            ],
        });
        return;
    }
    if (!(commandsInfo.fields?.length === 0)) {
        msg.reply({ embeds: [commandsInfo] });
        return;
    }
    msg.reply({ embeds: [commandsInfo] });
});
function get(param: { name: string }[]): string {
    let str = "";
    param.forEach((v) => {
        str += ` <${v.name}>`;
    });
    return str;
}
