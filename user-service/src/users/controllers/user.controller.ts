import { IncomingMessage, ServerResponse } from "node:http";

import HttpMethods from "../../server/enums/http-methods.enum";
import Router from "../../server/router";
import LoggerService from "../../logger/logger.service";
import UserService from "../services/user.service";
import ExtendedRequest from "../../server/interfaces/extended-request.interface";

export default class UserController extends Router {
    public readonly controllerPath = "/users";

    constructor(
        readonly loggerService: LoggerService,
        private readonly userService: UserService
    ) {
        super(loggerService);

        this.register(HttpMethods.POST, "", this.createUser.bind(this));
        this.register(HttpMethods.GET, "", this.getUsers.bind(this));
        this.register(HttpMethods.GET, "/:id", this.getUser.bind(this));
        this.register(HttpMethods.PUT, "/:id", this.updateUser.bind(this));
        this.register(HttpMethods.DELETE, "/:id", this.deleteUser.bind(this));
    }

    async getUsers(
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>
    ): Promise<void> {
        try {
            const users = await this.userService.getUsers();

            this.sendResponse(res, 200, users);
        } catch (error: any) {
            this.loggerService.error(error.message);

            this.sendResponse(res, error.statusCode, error.message);
        }
    }

    async getUser(
        req: ExtendedRequest,
        res: ServerResponse<IncomingMessage>
    ): Promise<void> {
        const { userId } = req;

        try {
            const user = await this.userService.getUser(userId);

            if (user) {
                this.sendResponse(res, 200, user);
            } else {
                this.sendResponse(res, 404, "User not found");
            }
        } catch (error: any) {
            this.loggerService.error(error.message);

            this.sendResponse(res, error.statusCode, error.message);
        }
    }

    async createUser(
        req: ExtendedRequest,
        res: ServerResponse<IncomingMessage>
    ): Promise<void> {
        const { body } = req;

        try {
            const user = await this.userService.createUser(body);

            this.sendResponse(res, 201, user);
        } catch (error: any) {
            this.loggerService.error(error.message);

            this.sendErrorResponse(res, error.statusCode, error.message);
        }
    }

    async updateUser(
        req: ExtendedRequest,
        res: ServerResponse<IncomingMessage>
    ): Promise<void> {
        const { userId, body } = req;

        try {
            const user = await this.userService.updateUser(userId, body);

            this.sendResponse(res, 200, user);
        } catch (error: any) {
            this.loggerService.error(error.message);

            this.sendErrorResponse(res, error.statusCode, error.message);
        }
    }

    async deleteUser(
        req: ExtendedRequest,
        res: ServerResponse<IncomingMessage>
    ): Promise<void> {
        const { userId } = req;

        try {
            await this.userService.deleteUser(userId);

            this.sendResponse(res, 204, "");
        } catch (error: any) {
            this.loggerService.error(error.message);

            this.sendErrorResponse(res, error.statusCode, error.message);
        }
    }
}
