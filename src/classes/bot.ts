import {EventEmitter} from "events";
import * as WebSocket from "ws";

import {CallablePayload, Payload} from "./types/payload";
import {Api} from "./types/sakura";
import {ContextFactory} from "./types/context";
import {SimpleContextFactory} from "./impl/SimpleContextFactory";
import {NewMessageCallback} from "./types/callback";

export interface Options {
    key: string;
    host: string;
}

export interface Attachment {
    toJson: () => any;
}


declare interface Sakura {
    on(type: "error", cb: (err: any) => void);

    on(type: "open", cb: VoidFunction);

    on(type: "close", cb: (code: number) => void);

    on(type: "socket-error", cb: (error: any) => void);

    on(type: "message.new", cb: NewMessageCallback);
}

class Sakura extends EventEmitter {
    private connection: WebSocket;
    private options: Options;
    private api: Api;
    private eventCallbacks: { [id: string]: (ev: any) => any } = {};
    private contextFactory: ContextFactory;

    constructor(options: Options) {
        super();

        this.contextFactory = new SimpleContextFactory();
        this.api = {
            user: {
                get: (uid) => {
                    return this.sendAndGet({
                        type: "users.get",
                        randomId: (Math.random() * 1000) + "-users.get",
                        userId: uid
                    })
                }
            },
            documents: {
                search: (query, count = 20, offset = 0) => {
                    return this.sendAndGet({
                        type: "docs.search",
                        randomId: (Math.random() * 1000) + "-docs.search",
                        query, offset, count
                    })
                }
            }
        }
        this.options = options;
        this.connect();
    }

    private connect() {
        this.connection = new WebSocket(this.options.host);
        this.connection.on("open", this.onOpen.bind(this));
        this.connection.on("message", this.onMessage.bind(this));
        this.connection.on("error", (err) => {
            this.emit("socket-error", err);
        });
        this.connection.on("close", code => {
            if (code === 1006) setTimeout(this.onClose.bind(this), 5000)
            else this.emit("close", code);
        });
    }

    private onClose(code: number) {
        this.emit("close", code);
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
            this.emit("open");
        } else this.emit("error", "connection is not opened");
    }

    private onMessage(data: WebSocket.Data) {
        if (typeof data !== "string") return;

        const msg: {
            type: string;
            eventId: string;
            payload: any;
        } = JSON.parse(data);

        switch (msg.type) {
            case "response":
                if (this.eventCallbacks[msg.eventId]) {
                    this.eventCallbacks[msg.eventId](msg.payload)
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

    public send(data: Payload<any | undefined>) {
        this.connection.send(JSON.stringify(data));
    }

    public sendAndGet<T>(data: CallablePayload<any | undefined>): Promise<T> {
        this.send(data);
        return new Promise<T>((resolve, reject) => {
            this.eventCallbacks[data.eventId] = resolve;
        });
    }

    private includeApi() {

    }
}


export default Sakura;