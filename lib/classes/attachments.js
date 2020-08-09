"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferedPhotoAttachment = exports.UrlPhotoAttachment = void 0;
const url = require("url");
const path = require("path");
const fs = require("fs");
class UrlPhotoAttachment {
    constructor(options) {
        this.options = options;
    }
    static from(url, headers) {
        return UrlPhotoAttachment.form({
            url, headers
        });
    }
    static form(options) {
        return new UrlPhotoAttachment(options);
    }
    toJson() {
        return Object.assign({ type: "image/url", filename: path.basename(url.parse(this.options.url).pathname) }, this.options);
    }
}
exports.UrlPhotoAttachment = UrlPhotoAttachment;
class BufferedPhotoAttachment {
    constructor(options) {
        this.options = options;
    }
    static form(buffer, filename) {
        return new BufferedPhotoAttachment({
            buffer, filename
        });
    }
    static formFile(filePath) {
        return BufferedPhotoAttachment.form(fs.readFileSync(filePath), path.basename(filePath));
    }
    toJson() {
        return {
            type: "image/base64",
            data: this.options.buffer.toString('base64'),
            filename: this.options.filename
        };
    }
}
exports.BufferedPhotoAttachment = BufferedPhotoAttachment;
