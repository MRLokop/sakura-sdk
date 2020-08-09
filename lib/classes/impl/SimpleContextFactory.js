"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleContextFactory = void 0;
class SimpleContextFactory {
    createMessageContext(sakura, msg) {
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
                let payload = {
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
        };
    }
}
exports.SimpleContextFactory = SimpleContextFactory;
