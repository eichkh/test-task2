export interface Config {
    port: number;
    mongoUri: string;
    rabbitMq: RabbitMq;
}

interface RabbitMq {
    uri: string;
    exchange: RabbitMqExchange;
}

interface RabbitMqExchange {
    name: string;
    type: string;
    durable: boolean;
}
