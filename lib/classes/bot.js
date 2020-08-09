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
        this.connection.on("error", () => { });
        this.connection.on("close", code => {
            if (code === 1006)
                setTimeout(this.onClose.bind(this), 5000);
            else
                logger_1.default.log(`Server close connection with code ${code}`);
        });
    }
    onClose() {
        logger_1.default.warning("Connection error. Reconnecting...");
        this.connect();
    }
    onOpen() {
        if (this.connection.readyState === WebSocket.OPEN) {
            this.send({
                type: "bot.online",
                payload: {
                    key: this.options.key
                }
            });
        }
        else
            logger_1.default.error("Connection is not opened");
    }
    onMessage(data) {
        if (typeof data !== "string")
            return;
        const msg = JSON.parse(data);
        switch (msg.type) {
            case "message.new":
                this.emit("message.new", {
                    message: {
                        id: msg.payload.id,
                        text: msg.payload.text
                    },
                    mentioned: msg.payload.mentioned,
                    isConversation: msg.payload.isConversation,
                    send: (message, options) => {
                        this.send({
                            type: "message.send",
                            eventId: msg.eventId,
                            payload: {
                                text: message,
                                attachments: options ? options.attachments.map(attachment => attachment.toJson()) : undefined
                            }
                        });
                    },
                    reply: (message, options) => {
                        let payload = {
                            text: message,
                            replyTo: msg.payload.id,
                            attachments: options ? options.attachments.map(attachment => attachment.toJson()) : undefined
                        };
                        if (options.useFallback === true)
                            payload.useFallback = true;
                        this.send({
                            type: "message.reply",
                            eventId: msg.eventId,
                            payload: payload
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
    includeApi() {
    }
}
exports.default = Sakura;
