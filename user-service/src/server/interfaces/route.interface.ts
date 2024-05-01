import { IncomingMessage, ServerResponse } from "http";

export default interface Route {
    path: string;
    handler: (
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>
    ) => void;
}
