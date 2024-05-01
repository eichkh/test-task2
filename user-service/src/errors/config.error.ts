class ConfigError extends Error {
    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;
        this.stack = undefined;
    }
}
