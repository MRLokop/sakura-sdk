export interface Api {
    user: {
        get: (uid: number) => Promise<any>;
    };
    documents: {
        search: (query: string, count?: number, offset?: number) => Promise<any>;
    };
}
export declare type BotMeResponse = {
    name: string;
    description: string;
};
