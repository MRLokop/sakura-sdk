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
    reply: (message: string, options?: {
        useFallback: boolean;
    }) => any;
}
declare type AnyCallback = (context: AnyContext) => any;
declare type NewMessageCallback = (context: MessageContext) => any;
declare interface Sakura {
    on(event: "message.new", listener: NewMessageCallback): this;
    on(event: string, listener: AnyCallback): this;
}
declare class Sakura extends EventEmitter {
    private connection;
    private options;
    constructor(options: Options);
    private connect;
    private onError;
    private onOpen;
    private onMessage;
    private send;
}
export default Sakura;
