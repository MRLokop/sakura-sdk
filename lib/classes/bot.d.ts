/// <reference types="node" />
import { EventEmitter } from "events";
import { CallablePayload, Payload } from "./types/payload";
import { NewMessageCallback } from "./types/callback";
export interface Options {
    key: string;
    host: string;
}
export interface Attachment {
    toJson: () => any;
}
declare interface Sakura {
    on(type: "error", cb: (err: any) => void): any;
    on(type: "open", cb: VoidFunction): any;
    on(type: "close", cb: (code: number) => void): any;
    on(type: "socket-error", cb: (error: any) => void): any;
    on(type: "message.new", cb: NewMessageCallback): any;
}
declare class Sakura extends EventEmitter {
    private connection;
    private options;
    private api;
    private eventCallbacks;
    private contextFactory;
    constructor(options: Options);
    private connect;
    private onClose;
    private onOpen;
    private onMessage;
    send(data: Payload<any | undefined>): void;
    sendAndGet<T>(data: CallablePayload<any | undefined>): Promise<T>;
    private includeApi;
}
export default Sakura;
