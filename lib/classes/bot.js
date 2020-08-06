"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const events_1 = require("events");
const WebSocket = require("ws");
class Sakura extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.connection = new WebSocket(options.host);
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
                        message: msg.payload.text,
                        mentioned: msg.payload.mentioned,
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
                                    text: message,
                                    replyTo: msg.payload.id
                                }
                            });
                        }
                    });
                    break;
                case "error":
                    console.error(chalk `{red Error: ${msg.payload.message}}`);
                    break;
                default:
                    this.emit(msg.type, {
                        payload: msg.payload
                    });
                    break;
            }
        });
        this.connection.on("close", () => {
            setTimeout(() => {
                console.log(chalk `yellow Connection error. Reconnecting...`);
                this.connection = new WebSocket(options.host);
            }, 5000);
        });
    }
    send(data) {
        this.connection.send(JSON.stringify(data));
    }
}
exports.default = Sakura;
