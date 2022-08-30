import { AttachmentBuilder } from "discord.js";
import gm from "gm";
export default function (face?: string): Promise<AttachmentBuilder> {
    return new Promise((r) => {
        if (!face)
            return r(
                new AttachmentBuilder(__dirname + "/default.png", {
                    name: "face.png",
                })
            );
        gm(face).identify((err) =>
            err
                ? r(
                      new AttachmentBuilder(__dirname + "/default.png", {
                          name: "face.png",
                      })
                  )
                : r(
                      new AttachmentBuilder(face, {
                          name: "face.png",
                      })
                  )
        );
    });
}
