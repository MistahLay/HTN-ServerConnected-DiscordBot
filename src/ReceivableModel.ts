import fs from "fs";
import { ArrayModel, ObjectModel } from "objectmodel";
type onReceive<IS_API extends boolean> = IS_API extends true
    ? (data: any, id: string) => void
    : (data: any) => void;
export class Receivable<IS_API extends boolean = false> {
    public cb: onReceive<IS_API> = () => {};
    public model: ObjectModel | ArrayModel | "string" | "number" | "boolean";
    constructor(model: Object | "string" | "number" | "boolean" | any[]) {
        this.model = Array.isArray(model)
            ? new ArrayModel(model)
            : typeof model === "object"
            ? new ObjectModel(model)
            : model;
    }
    onReceive(cb: onReceive<IS_API>): this {
        this.cb = cb;
        return this;
    }
}
export function getReceivables(): Promise<{ [key: string]: Receivable }> {
    return new Promise((r) => {
        let count = 0;
        let receivables: { [key: string]: Receivable } = {};
        const files = fs
            .readdirSync(__dirname + "/Receivables", { withFileTypes: true })
            .filter((value) => value.name.endsWith(".ts"));
        files.forEach((value) => {
            const receivable = require(__dirname +
                "/Receivables/" +
                value.name);
            count++;
            if (!(receivable instanceof Receivable)) {
                count === files.length ? r(receivables) : console.log("E");
                return;
            }
            receivables[value.name.replace(".ts", "")] = receivable;
            count === files.length ? r(receivables) : 0;
        });
    });
}
