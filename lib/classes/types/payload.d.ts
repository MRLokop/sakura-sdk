export declare type Payload<T> = {} & T;
export declare type RequestPayload<T> = Payload<T> & {
    type: string;
};
export declare type CallablePayload<T> = RequestPayload<T> & {
    eventId: string;
};
