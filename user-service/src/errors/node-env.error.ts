class NodeEnvError extends Error {
    constructor(message: string) {
        message +=
            "\nMake sure you use npm scripts to start the application.\nExample: 'npm run start:prod' or 'npm run start:dev";

        super(message);

        this.name = this.constructor.name;
        this.stack = undefined;
    }
}

class MissingNodeEnvError extends NodeEnvError {
    constructor() {
        super("NODE_ENV is not defined.");
    }
}

class InvalidNodeEnvError extends NodeEnvError {
    constructor() {
        super(
            `Invalid NODE_ENV value.\nExpected 'production' or 'development', received '${process.env.NODE_ENV}'`
        );
    }
}

export { MissingNodeEnvError, InvalidNodeEnvError };
