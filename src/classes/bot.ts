import {
    EventEmitter
} from "events";
import * as WebSocket from "ws";

import Logger from "./logger";

interface Options {
    key: string;
    host: string;
}

interface AnyContext {
    payload: any;
}

interface MessageContext {
    message: {
        text: string;
    };

    mentioned: boolean;

    send: (message: string) => any;
    reply: (message: string, options?: {
        useFallback: boolean;
    }) => any;
}

type AnyCallback = (context: AnyContext) => any;
type NewMessageCallback = (context: MessageContext) => any;

declare interface Sakura {
    on(event: "message.new", listener: NewMessageCallback): this;

    on(event: string, listener: AnyCallback): this;
}

class Sakura extends EventEmitter {
    private connection: WebSocket;
    private options: Options;

    constructor(options: Options) {
        super();

        this.options = options;
        this.connect();
    }

    private connect() {
        this.connection = new WebSocket(this.options.host);
        this.connection.on("open", this.onOpen.bind(this));
        this.connection.on("message", this.onMessage.bind(this));
        this.connection.on("error", () => setTimeout(this.onError.bind(this), 5000));
    }

    private onError() {
        Logger.warning("Connection error. Reconnecting...");
        this.connect();
    }

    private onOpen() {
        this.send({
            type: "bot.online",
            payload: {
                key: this.options.key
            }
        });
    }

    private onMessage(data: WebSocket.Data) {
        if (typeof data !== "string") return;

        const msg: {
            type: string;
            eventId: string;
            payload: any;
        } = JSON.parse(data);

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
                Logger.error(`Error: ${msg.payload.message}`);
                break;

            default:
                this.emit(msg.type, {
                    payload: msg.payload
                });
                break;
        }
    }

    private send(data) {
        this.connection.send(JSON.stringify(data));
    }
}

export default Sakura;