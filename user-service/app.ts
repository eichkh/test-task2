import UserController from "./src/users/controllers/user.controller";
import Router from "./src/server/router";
import HttpServer from "./src/server/server";
import ConfigService from "./src/config/services/config.service";
import LoggerService from "./src/logger/logger.service";
import DatabaseService from "./src/database/services/database.service";
import UserService from "./src/users/services/user.service";
import UserRepository from "./src/users/repositories/user.repository";
import ValidatorService from "./src/validator/services/validator.service";
import parseUrlParams from "./src/server/middlewares/parse-url-params.middleware";
import parseBody from "./src/server/middlewares/parse-body.middleware";
import QueueService from "./src/queue/services/queue.service";

async function app() {
    const loggerService = new LoggerService();
    const validatorService = new ValidatorService();
    const configService = new ConfigService(loggerService, validatorService);

    const databaseService = new DatabaseService(loggerService, configService);
    await databaseService.connect();

    const queueService = new QueueService(loggerService, configService);
    await queueService.init();

    const router = new Router(loggerService);

    const userCollection = databaseService.getCollection("users");
    const userRepository = new UserRepository(userCollection);
    const userService = new UserService(
        userRepository,
        validatorService,
        queueService
    );
    const userController = new UserController(loggerService, userService);

    router.use(userController.controllerPath, userController);

    const server = new HttpServer(router);
    server.use(parseUrlParams as any);
    server.use(parseBody as any);

    server.start(configService.get("port"));

    process.on("SIGINT", async () => {
        try {
            await databaseService.close();
            await queueService.close();
        } catch (error) {
            console.error("Error closing services:", error);

            process.exit(1);
        }

        process.exit(0);
    });
}

app();
