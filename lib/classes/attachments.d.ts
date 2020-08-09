/// <reference types="node" />
import { Attachment } from "./bot";
export declare type UrlPhotoAttachmentOptions = {
    url: string;
    headers?: Array<string>;
};
export declare type BufferedPhotoAttachmentOptions = {
    buffer: Buffer;
    filename: string;
};
export declare class UrlPhotoAttachment implements Attachment {
    private readonly options;
    private constructor();
    static from(url: string, headers?: Array<string>): UrlPhotoAttachment;
    static form(options: UrlPhotoAttachmentOptions): UrlPhotoAttachment;
    toJson(): any;
}
export declare class BufferedPhotoAttachment implements Attachment {
    private readonly options;
    private constructor();
    static form(buffer: Buffer, filename: string): BufferedPhotoAttachment;
    static formFile(filePath: string): BufferedPhotoAttachment;
    toJson(): any;
}
