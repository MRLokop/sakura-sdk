import * as chalk from "chalk";

export default class Logger {
    static log(data) {
        console.log(chalk`[Sakura] ${data}`);
    }
    
    static warning(text: string) {
        console.log(chalk`[Sakura] {yellow ${text}}`);
    }

    static error(message: string) {
        console.error(chalk`[Sakura] {red ${message}`);
    }
}