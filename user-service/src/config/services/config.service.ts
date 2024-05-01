import dotenv from "dotenv";

import {
    InvalidNodeEnvError,
    MissingNodeEnvError,
} from "../../errors/node-env.error";

import NodeEnv from "../enums/node-env.enum";
import { Config } from "../interfaces/config.interface";
import LoggerService from "../../logger/logger.service";
import ValidatorService from "../../validator/services/validator.service";
import ConfigSchema from "../validation-schemas/config.schema";

export default class ConfigService {
    private config: Config = {} as Config;

    constructor(
        private readonly loggerService: LoggerService,
        private readonly validatorService: ValidatorService
    ) {
        this.checkNodeEnv();

        const { parsed } = dotenv.config({
            path: `.env.${process.env.NODE_ENV}`,
        }) as dotenv.DotenvConfigOutput;

        this.validatorService.validate(
            ConfigSchema,
            parsed as dotenv.DotenvParseOutput
        );
        this.prepareConfig(parsed as dotenv.DotenvParseOutput);

        this.loggerService.info(
            `ConfigService initialized with NODE_ENV: ${process.env.NODE_ENV}`
        );
    }

    public get<ConfigKey extends keyof Config>(
        key: ConfigKey
    ): Config[ConfigKey] {
        return this.config[key];
    }

    private checkNodeEnv(): void {
        if (!process.env.NODE_ENV) {
            throw new MissingNodeEnvError();
        }

        if (
            process.env.NODE_ENV !== NodeEnv.Development &&
            process.env.NODE_ENV !== NodeEnv.Production
        ) {
            throw new InvalidNodeEnvError();
        }
    }

    private prepareConfig(parsed: dotenv.DotenvParseOutput): void {
        this.config = {
            port: Number(parsed.PORT),
            mongoUri: parsed.MONGO_URI,
            rabbitMq: {
                uri: parsed.RABBITMQ_URI,
                exchange: {
                    name: parsed.RABBITMQ_EXCHANGE_NAME,
                    type: parsed.RABBITMQ_EXCHANGE_TYPE,
                    durable: parsed.RABBITMQ_EXCHANGE_DURABLE === "true",
                },
            },
        };
    }
}
