import { EventEmitter } from "events";
import * as WebSocket from "ws";

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
    reply: (message: string) => any;
}

type AnyCallback = (context: AnyContext) => any;
type NewMessageCallback = (context: MessageContext) => any;

declare interface Sakura {
    on(event: "message.new", listener: NewMessageCallback): this;

    on(event: string, listener: AnyCallback): this;
}

class Sakura extends EventEmitter {
    private connection: WebSocket;

    constructor(options: Options) {
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
            if (typeof data !== "string") return;

            const msg: {
                type: string;
                eventId: string;
                payload: any;
            } = JSON.parse(data);

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
                                    replyTo: 0
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

    private send(data) {
        this.connection.send(JSON.stringify(data));
    }
}

export default Sakura;