import { APIEmbed, APIEmbedField, Colors, Message } from "discord.js";
import fs from "fs";
type LiteralUnion<T extends U, U = string[] | string> = T | (U & {});
type Parameters = {
    name: string;
    info?: string;
    rest?: true;
};
export class Command {
    fields: APIEmbedField[] = [];
    info: string = "";
    execute?: (msg: Message, args: string[]) => void;
    parameters: Parameters[] = [];
    optionalParameters: Parameters[] = [];
    roles: string[] = [];
    constructor(
        public requiredServerOnline: boolean = true,
        public isInvisible: boolean = false
    ) {}
    onExecute(execute: (msg: Message, args: any[]) => void) {
        this.execute = execute;
        return this;
    }
    setInfo(info: string) {
        if (this.isInvisible) return this;
        this.info = info;
        return this;
    }
    setParameters(parameters: Parameters[]) {
        this.parameters = parameters;
        let paramInfo = "";
        for (const i of parameters) {
            paramInfo += `${i.name}: ${i.info}\n`;
        }
        this.fields[0] = {
            name: "Arguments",
            value: paramInfo,
        };
        return this;
    }
    setRoles(...roles: string[]) {
        this.roles = roles;
        return this;
    }
}

export let commandsInfo: APIEmbed = {
    title: "Commands",
    description:
        "Note: When the server is down most of the commands will not work ofc. \n-LayWasTaken",
    color: Colors.Green,
    fields: [],
};

export const commands: { [key: string]: Command } = {};

export async function registerCommands(): Promise<{ [key: string]: Command }> {
    return new Promise((r) => {
        fs.readdirSync(__dirname + "/Commands", { withFileTypes: true })
            .filter((value) => value.isFile())
            .forEach((value) => {
                const cmd = require(__dirname + "/Commands/" + value.name);
                if (!(cmd instanceof Command)) return;
                commands[value.name.replace(".ts", "").toLowerCase()] = cmd;
            });
        r(commands);
    });
}
