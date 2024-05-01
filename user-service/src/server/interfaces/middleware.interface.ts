import { IncomingMessage, ServerResponse } from "http";
import { Handler } from "./handler.interface";

export interface Middleware {
    (
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>,
        next: Handler
    ): void;
}
