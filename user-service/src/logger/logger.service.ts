export default class LoggerService {
    constructor() {
        this.info(`${this.constructor.name} initialized`);
    }

    public log(message: string): void {
        console.log(`\x1b[37m[LOG] \x1b[0m${message}`);
    }

    public error(message: string): void {
        console.error(`\x1b[31m[ERROR] \x1b[0m${message}`);
    }

    public warn(message: string): void {
        console.warn(`\x1b[33m[WARN] \x1b[0m${message}`);
    }

    public info(message: string): void {
        console.info(`\x1b[36m[INFO] \x1b[0m${message}`);
    }

    public debug(message: string): void {
        console.debug(`\x1b[35m[DEBUG] \x1b[0m${message}`);
    }
}
