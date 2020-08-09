"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const WebSocket = require("ws");
const SimpleContextFactory_1 = require("./impl/SimpleContextFactory");
class Sakura extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.eventCallbacks = {};
        this.contextFactory = new SimpleContextFactory_1.SimpleContextFactory();
        this.api = {
            user: {
                get: (uid) => {
                    return this.sendAndGet({
                        type: "users.get",
                        randomId: (Math.random() * 1000) + "-users.get",
                        userId: uid
                    });
                }
            },
            documents: {
                search: (query, count = 20, offset = 0) => {
                    return this.sendAndGet({
                        type: "docs.search",
                        randomId: (Math.random() * 1000) + "-docs.search",
                        query, offset, count
                    });
                }
            }
        };
        this.options = options;
        this.connect();
    }
    connect() {
        this.connection = new WebSocket(this.options.host);
        this.connection.on("open", this.onOpen.bind(this));
        this.connection.on("message", this.onMessage.bind(this));
        this.connection.on("error", (err) => {
            this.emit("socket-error", err);
        });
        this.connection.on("close", code => {
            if (code === 1006)
                setTimeout(this.onClose.bind(this), 5000);
            else
                this.emit("close", code);
        });
    }
    onClose(code) {
        this.emit("close", code);
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
            this.emit("open");
        }
        else
            this.emit("error", "connection is not opened");
    }
    onMessage(data) {
        if (typeof data !== "string")
            return;
        const msg = JSON.parse(data);
        switch (msg.type) {
            case "response":
                if (this.eventCallbacks[msg.eventId]) {
                    this.eventCallbacks[msg.eventId](msg.payload);
                    return;
                }
                break;
            case "message.new":
                this.emit("message.new", this.contextFactory.createMessageContext(this, msg));
                break;
            case "error":
                // Logger.error(`Error: ${msg.payload.message}`);
                this.emit("error", msg);
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
    sendAndGet(data) {
        this.send(data);
        return new Promise((resolve, reject) => {
            this.eventCallbacks[data.eventId] = resolve;
        });
    }
    includeApi() {
    }
}
exports.default = Sakura;
