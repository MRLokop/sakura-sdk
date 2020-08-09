import {AnyContext, MessageContext} from "./context";

export type AnyCallback = (context: AnyContext) => any;
export type NewMessageCallback = (context: MessageContext) => any;
