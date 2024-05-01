import { IncomingMessage } from "http";

export default interface ExtendedRequest extends IncomingMessage {
    [key: string]: any;

    body: any;
    params: any;
    query: any;
}
