"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const WebSocket = require("ws");
const logger_1 = require("./logger");
class Sakura extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this.connect();
    }
    connect() {
        this.connection = new WebSocket(this.options.host);
        this.connection.on("open", this.onOpen.bind(this));
        this.connection.on("message", this.onMessage.bind(this));
        this.connection.on("error", () => setTimeout(this.onError.bind(this), 5000));
    }
    onError() {
        logger_1.default.warning("Connection error. Reconnecting...");
        this.connect();
    }
    onOpen() {
        this.send({
            type: "bot.online",
            payload: {
                key: this.options.key
            }
        });
    }
    onMessage(data) {
        if (typeof data !== "string")
            return;
        const msg = JSON.parse(data);
        switch (msg.type) {
            case "message.new":
                this.emit("message.new", {
                    message: {
                        text: msg.payload.text
                    },
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
                logger_1.default.error(`Error: ${msg.payload.message}`);
                break;
            default:
                this.emit(msg.type, {
                    payload: msg.payload
                });
                break;
        }
    }
    send(data) {
        this.connection.send(JSON.stringify(data));
    }
}
exports.default = Sakura;
