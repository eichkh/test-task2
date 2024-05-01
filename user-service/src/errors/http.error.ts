class HttpError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}

class NotFoundError extends HttpError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}

class BadRequestError extends HttpError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

export { NotFoundError, BadRequestError };
