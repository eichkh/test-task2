import {
    IncomingMessage,
    ServerResponse,
    Server,
    createServer,
} from "node:http";

import Router from "./router";
import { Middleware } from "./interfaces/middleware.interface";
import { Handler } from "./interfaces/handler.interface";
import ExtendedRequest from "./interfaces/extended-request.interface";

export default class HttpServer {
    private readonly server: Server;
    private middlewares: Array<Middleware> = [];

    constructor(private readonly router: Router) {
        this.server = createServer(
            (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
                this.handleMiddlewares(
                    req as ExtendedRequest,
                    res,
                    (req, res) => {
                        this.router.route(req, res);
                    }
                );
            }
        );
    }

    private handleMiddlewares(
        req: ExtendedRequest,
        res: ServerResponse<IncomingMessage>,
        finalHandler: Handler
    ): void {
        let index = 0;

        const next = (): void => {
            index++;

            if (index < this.middlewares.length) {
                this.middlewares[index](req, res, next);
            } else {
                finalHandler(req, res);
            }
        };

        if (this.middlewares.length > 0) {
            this.middlewares[0](req, res, next);
        } else {
            finalHandler(req, res);
        }
    }

    use(middleware: Middleware): void {
        this.middlewares.push(middleware);
    }

    start(port: number): void {
        this.server.listen(port);
    }
}
