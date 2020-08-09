import { ContextFactory, MessageContext } from "../types/context";
import Sakura from "../bot";
export declare class SimpleContextFactory implements ContextFactory {
    createMessageContext(sakura: Sakura, msg: any): MessageContext;
}
