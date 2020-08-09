import { Attachment } from "../bot";
export interface MessageSendOptions {
    attachments: Attachment[];
}
export interface ReplyMessageOptions extends MessageSendOptions {
    useFallback: boolean;
}
