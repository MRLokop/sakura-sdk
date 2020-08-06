const { Sakura } = require("../lib");

const bot = new Sakura({
    key: "test",
    host: "ws://localhost:3122/"
});

bot.on("message.new", ({ message, send }) => {
    send(message.text);
});