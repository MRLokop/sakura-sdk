/// <reference types="node" />
import { EventEmitter } from "events";
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
declare type AnyCallback = (context: AnyContext) => any;
declare type NewMessageCallback = (context: MessageContext) => any;
declare interface Sakura {
    on(event: "message.new", listener: NewMessageCallback): this;
    on(event: string, listener: AnyCallback): this;
}
declare class Sakura extends EventEmitter {
    private connection;
    constructor(options: Options);
    private send;
}
export default Sakura;
