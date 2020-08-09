const { Sakura } = require("../lib");
const { UrlPhotoAttachment } = require("../lib/classes/attachments")

const bot = new Sakura({
    key: "test",
    host: "ws://localhost:3122/"
});

bot.on("message.new", (ctx) => {
    if (!ctx.isConversation || ctx.mentioned) {
        ctx.reply(ctx.message.text, {
            attachments: [
                UrlPhotoAttachment.from("https://sun9-3.userapi.com/jpY3vJ4l86Y9I1rE5UMoFl1DZgsnm4_GqtxqGg/C4ZV5yAov9c.jpg")
            ]
        });
    }
});
