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
    api: Api;
    payload: any;
}

interface MessageContext extends AnyContext {
    message: {
        id: number;
        text: string;
    };
    mentioned: boolean;

    isConversation: boolean;

    send: (message: string) => any;
    reply: (message: string, options?: {
        useFallback: boolean;
    }) => any;
}

interface Api {
    user: {
        get: () => any;
    }
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
        this.connection.on("error", () => {});
        this.connection.on("close", code => {
            if (code === 1006) setTimeout(this.onClose.bind(this), 5000)
            else Logger.log(`Server close connection with code ${code}`);
        });
    }

    private onClose() {
        Logger.warning("Connection error. Reconnecting...");
        this.connect();
    }

    private onOpen() {
        if (this.connection.readyState === WebSocket.OPEN) {
            this.send({
                type: "bot.online",
                payload: {
                    key: this.options.key
                }
            });
        } else Logger.error("Connection is not opened");
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
                        id: msg.payload.id,
                        text: msg.payload.text
                    },
                    mentioned: msg.payload.mentioned,
                    isConversation: msg.payload.isConversation,
                    send: message => {
                        this.send({
                            type: "message.send",
                            eventId: msg.eventId,
                            payload: {
                                text: message
                            }
                        });
                    },
                    reply: (message, options) => {
                        let payload: {
                            text: string;
                            useFallback?: boolean;
                            replyTo: any;
                        } = {
                            text: message,
                            replyTo: msg.payload.id
                        };

                        if (options.useFallback === true)
                            payload.useFallback = true;

                        this.send({
                            type: "message.reply",
                            eventId: msg.eventId,
                            payload: payload
                        });
                    }
                } as MessageContext);
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

    private includeApi() {
        
    }
}

export default Sakura;