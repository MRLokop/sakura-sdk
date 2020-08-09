import {ContextFactory, MessageContext} from "../types/context";
import Sakura from "../bot";

export class SimpleContextFactory implements ContextFactory {
    createMessageContext(sakura: Sakura, msg: any): MessageContext {
        return {
            message: {
                id: msg.payload.id,
                text: msg.payload.text,
                senderId: msg.payload.senderId
            },
            bot: msg.payload.bot,
            mentioned: msg.payload.mentioned,
            isConversation: msg.payload.isConversation,
            send: (message, options) => {
                sakura.send({
                    type: "message.send",
                    eventId: msg.eventId,
                    payload: {
                        text: message,
                        attachments: options ? options.attachments.map(attachment => attachment.toJson()) : undefined
                    }
                });
            },
            reply: (message, options) => {
                let payload: {
                    text: string;
                    useFallback?: boolean;
                    replyTo: any;
                    attachments: any;
                } = {
                    text: message,
                    replyTo: msg.payload.id,
                    attachments: options ? options.attachments.map(attachment => attachment.toJson()) : undefined
                };

                if (options.useFallback === true)
                    payload.useFallback = true;

                sakura.send({
                    type: "message.reply",
                    eventId: msg.eventId,
                    payload: payload
                });
            }
        } as MessageContext;
    }

}