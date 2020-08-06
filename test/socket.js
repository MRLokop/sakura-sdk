const WebSocket = require("ws");

const wss = new WebSocket.Server({
    port: 3122
});

wss.on("connection", ws => {
    console.log("Connected");

    ws.on("close", () => {
        console.log("Disconnected");
    });
});