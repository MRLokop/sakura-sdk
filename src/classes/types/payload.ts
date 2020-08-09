export type Payload<T> = {} & T

export type RequestPayload<T> = Payload<T> & {
    type: string
}

export type CallablePayload<T> = RequestPayload<T> & {
    eventId: string
}