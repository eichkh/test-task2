import ampq from "amqplib";

import LoggerService from "../../logger/logger.service";
import ConfigService from "../../config/services/config.service";
import RoutingKeys from "../enums/routing-keys.enum";

export default class QueueService {
    private exchangeName: string;

    private connection!: ampq.Connection;
    private chanel!: ampq.Channel;

    constructor(
        private readonly loggerService: LoggerService,
        private readonly configService: ConfigService
    ) {
        this.exchangeName = this.configService.get("rabbitMq").exchange.name;

        this.loggerService.info(`${this.constructor.name} initialized`);
    }

    async init(): Promise<void> {
        try {
            const { uri, exchange } = this.configService.get("rabbitMq");

            this.connection = await ampq.connect(uri);
            this.chanel = await this.connection.createChannel();

            this.loggerService.info("Connected to RabbitMQ");

            this.chanel.assertExchange(exchange.name, exchange.type, {
                durable: exchange.durable,
            });
        } catch (error) {
            console.error("Error connecting to RabbitMQ:", error);

            throw error;
        }
    }

    sendMessageToExchange(routingKey: RoutingKeys, message: string): void {
        try {
            this.chanel.publish(
                this.exchangeName,
                routingKey,
                Buffer.from(message)
            );

            this.loggerService.debug(
                `[x] Message: ${message} with routing key: ${routingKey} to exchange: ${this.exchangeName} `
            );
        } catch (error: any) {
            this.loggerService.error(error.message);
        }
    }

    async close(): Promise<void> {
        try {
            await this.connection.close();

            console.log("Disconnected from RabbitMQ");
        } catch (error) {
            console.error("Error closing RabbitMQ connection:", error);

            throw error;
        }
    }
}
