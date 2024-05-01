import { IncomingMessage, ServerResponse } from "http";
import ExtendedRequest from "./extended-request.interface";

export interface Handler {
    (req: ExtendedRequest, res: ServerResponse<IncomingMessage>): void;
}
