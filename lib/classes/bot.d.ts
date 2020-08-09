/// <reference types="node" />
import { EventEmitter } from "events";
export interface Options {
    key: string;
    host: string;
}
export interface AnyContext {
    api: Api;
    payload: any;
}
export interface MessageSendOptions {
    attachments: Attachment[];
}
export interface ReplyMessageOptions extends MessageSendOptions {
    useFallback: boolean;
}
export interface MessageContext extends AnyContext {
    message: {
        id: number;
        text: string;
    };
    mentioned: boolean;
    isConversation: boolean;
    send: (message: string, options?: MessageSendOptions) => any;
    reply: (message: string, options?: ReplyMessageOptions) => any;
}
export interface Api {
    user: {
        get: () => any;
    };
    documents: {
        search: () => any;
    };
}
export declare type AnyCallback = (context: AnyContext) => any;
export declare type NewMessageCallback = (context: MessageContext) => any;
export interface Attachment {
    toJson: () => any;
}
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
