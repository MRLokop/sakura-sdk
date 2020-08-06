/// <reference types="node" />
import { EventEmitter } from "events";
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
    };
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
    private onClose;
    private onOpen;
    private onMessage;
    private send;
    private includeApi;
}
export default Sakura;
