import { EventEmitter } from "events";
import * as WebSocket from "ws";

interface Options {
    key: string;
}

interface AnyContext {
    payload: any;
}

interface MessageContext {
    message: {
        text: string;
    };

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
            if (typeof data !== "string") return;

            const msg: {
                type: string;
                eventId: string;
                payload: any;
            } = JSON.parse(data);

            switch (msg.type) {
                case "message.new":
                    this.emit("message.new", {
                        message: msg.payload,
                        send: message => {
                            this.send({
                                type: "send.message",
                                eventId: msg.eventId,
                                payload: {
                                    text: message
                                }
                            });
                        },
                        reply: message => {
        
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