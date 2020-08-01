const { Sakura } = require("sakura-sdk");

const bot = new Sakura({
    key: "test"
});

bot.on("message.new", ({ message, send }) => {
    send(message.text);
});