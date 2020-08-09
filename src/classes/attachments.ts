import { Attachment } from "./bot";

import * as url from "url";
import * as path from "path";
import * as fs from "fs";

export type UrlPhotoAttachmentOptions = {
    url: string,
    headers?: Array<string>
};

export type BufferedPhotoAttachmentOptions = {
    buffer: Buffer,
    filename: string
};

export class UrlPhotoAttachment implements Attachment {
    private readonly options: UrlPhotoAttachmentOptions;

    private constructor(options: UrlPhotoAttachmentOptions) {
        this.options = options;
    }

    static from(url: string, headers?: Array<string>) {
        return UrlPhotoAttachment.form({
            url, headers
        });
    }

    static form(options: UrlPhotoAttachmentOptions) {
        return new UrlPhotoAttachment(options);
    }

    toJson(): any {
        return {
            type: "image/url",
            filename: path.basename(url.parse(this.options.url).pathname),
            ...this.options
        }
    }
}

export class BufferedPhotoAttachment implements Attachment {
    private readonly options: BufferedPhotoAttachmentOptions;

    private constructor(options: BufferedPhotoAttachmentOptions) {
        this.options = options;
    }

    static form(buffer: Buffer, filename: string) {
        return new BufferedPhotoAttachment({
            buffer, filename
        });
    }

    static formFile(filePath: string) {
        return BufferedPhotoAttachment.form(fs.readFileSync(filePath), path.basename(filePath));
    }

    toJson(): any {
        return {
            type: "image/base64",
            data: this.options.buffer.toString('base64'),
            filename: this.options.filename
        }
    }
}
