import { IncomingMessage, ServerResponse } from "http";

import HttpMethods from "./enums/http-methods.enum";
import { Handler } from "./interfaces/handler.interface";

import Route from "./types/router";
import LoggerService from "../logger/logger.service";
import ExtendedRequest from "./interfaces/extended-request.interface";

class Router {
    constructor(readonly loggerService: LoggerService) {
        this.loggerService.info(
            `${this.constructor.name} has been initialized`
        );
    }

    private routes: Route = {
        [HttpMethods.GET]: {},
        [HttpMethods.POST]: {},
        [HttpMethods.PUT]: {},
        [HttpMethods.DELETE]: {},
        [HttpMethods.PATCH]: {},
    };

    register(method: HttpMethods, path: string, handler: Handler): void {
        this.routes[method][path] = handler;
    }

    use(routerPath: string, router: Router): void {
        for (const method in router.routes) {
            const methodRoutes = router.routes[method as HttpMethods];

            for (const path in methodRoutes) {
                const fullPath = `${routerPath}${path}`;
                const handler = methodRoutes[path];
                this.routes[method as HttpMethods][fullPath] = handler;
            }
        }

        this.loggerService.info(
            `${router.constructor.name} has been registered. Path: ${routerPath}`
        );
    }

    route(req: ExtendedRequest, res: ServerResponse<IncomingMessage>): void {
        const { method, url } = req;

        this.loggerService.debug(
            `Request received. Method: ${method}, URL: ${url}`
        );

        let routeHandler = this.routes[method as HttpMethods][url as string];
        if (!routeHandler) {
            routeHandler = this.routes[method as HttpMethods][req.urlToProcess];
        }

        if (routeHandler) {
            routeHandler(req, res);
        } else {
            this.sendErrorResponse(res, 404, "Page not found");
        }
    }

    protected sendResponse(
        res: ServerResponse<IncomingMessage>,
        statusCode: number,
        body: any
    ): void {
        res.writeHead(statusCode, { "Content-Type": "application/json" });

        res.end(JSON.stringify(body));
    }

    protected sendErrorResponse(
        res: ServerResponse,
        statusCode: number,
        message: string
    ): void {
        this.sendResponse(res, statusCode, {
            statusCode,
            messages: message.replace("Error: ", "").split(", "),
        });
    }
}

export default Router;
