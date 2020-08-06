"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const events_1 = require("events");
const WebSocket = require("ws");
class Sakura extends events_1.EventEmitter {
    constructor(options) {
        super();
        try {
            this.options = options;
            this.connection = new WebSocket(options.host);
            this.setup();
        }
        catch (_a) {
            this.onClose();
        }
    }
    setup() {
        this.connection.on("open", this.onOpen.bind(this));
        this.connection.on("message", this.onMessage.bind(this));
        this.connection.on("close", this.onClose.bind(this));
    }
    onClose() {
        setTimeout(() => {
            console.log(chalk `{yellow Connection error. Reconnecting...}`);
            try {
                this.connection = new WebSocket(this.options.host);
                this.setup();
            }
            catch (_a) {
                this.onClose();
            }
        }, 5000);
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
                console.error(chalk `{red Error: ${msg.payload.message}}`);
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
