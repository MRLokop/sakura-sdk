"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
class Logger {
    static log(data) {
        console.log(chalk `[Sakura] {${data}}`);
    }
    static warning(text) {
        console.log(chalk `[Sakura] {yellow ${text}}`);
    }
    static error(message) {
        console.error(chalk `[Sakura] {red ${message}`);
    }
}
exports.default = Logger;
