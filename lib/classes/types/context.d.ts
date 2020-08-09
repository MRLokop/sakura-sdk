import { MessageSendOptions, ReplyMessageOptions } from "./message";
import { Api } from "./sakura";
import Sakura from "../bot";
export interface AnyContext {
    api: Api;
    payload: any;
}
export interface MessageContext extends AnyContext {
    message: {
        id: number;
        text: string;
        senderId: number;
    };
    bot: {
        name: string;
        options: Array<any>;
    };
    mentioned: boolean;
    isConversation: boolean;
    send: (message: string, options?: MessageSendOptions) => any;
    reply: (message: string, options?: ReplyMessageOptions) => any;
}
export interface ContextFactory {
    createMessageContext(sakura: Sakura, msg: any): MessageContext;
}
