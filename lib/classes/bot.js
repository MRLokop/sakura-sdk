"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const WebSocket = require("ws");
class Sakura extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.connection = new WebSocket("");
        this.connection.on("open", () => {
            this.send({
                type: "bot.online",
                payload: {
                    key: options.key
                }
            });
        });
        this.connection.on("message", data => {
            if (typeof data !== "string")
                return;
            const msg = JSON.parse(data);
            switch (msg.type) {
                case "message.new":
                    this.emit("message.new", {
                        message: msg.payload,
                        send: message => {
                            this.send({
                                type: "message.send",
                                eventId: msg.eventId,
                                payload: {
                                    text: message
                                }
                            });
                        },
                        reply: message => {
                            this.send({
                                type: "message.reply",
                                eventId: msg.eventId,
                                payload: {
                                    text: message
                                }
                            });
                        }
                    });
                    break;
                default:
                    this.emit(msg.type, {
                        payload: msg.payload
                    });
                    break;
            }
        });
    }
    send(data) {
        this.connection.send(JSON.stringify(data));
    }
}
exports.default = Sakura;
