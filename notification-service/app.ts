import ampq from "amqplib";
import dotenv from "dotenv";

dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
});

async function app() {
    if (!process.env.RABBITMQ_URI) {
        throw new Error("RABBITMQ_URI is required");
    }
    if (!process.env.RABBITMQ_EXCHANGE_NAME) {
        throw new Error("RABBITMQ_EXCHANGE_NAME is required");
    }
    if (!process.env.RABBITMQ_EXCHANGE_TYPE) {
        throw new Error("RABBITMQ_EXCHANGE_TYPE is required");
    }
    if (!process.env.RABBITMQ_EXCHANGE_DURABLE) {
        throw new Error("RABBITMQ_EXCHANGE_DURABLE is required");
    }
    if (!process.env.RABBITMQ_QUEUES) {
        throw new Error("RABBITMQ_QUEUES is required");
    }

    const connection = await ampq.connect(process.env.RABBITMQ_URI);
    const chanel = await connection.createChannel();

    chanel.assertExchange(
        process.env.RABBITMQ_EXCHANGE_NAME,
        process.env.RABBITMQ_EXCHANGE_TYPE,
        {
            durable: process.env.RABBITMQ_EXCHANGE_DURABLE === "true",
        }
    );

    const queues = JSON.parse(process.env.RABBITMQ_QUEUES);

    // only because it's a simplified example
    queues.forEach((queue: any) => {
        chanel.assertQueue(queue.name, {
            durable: queue.durable,
        });
        chanel.bindQueue(
            queue.name,
            process.env.RABBITMQ_EXCHANGE_NAME as string,
            queue.routingKey
        );

        chanel.consume(queue.name, (message) => {
            if (message) {
                console.log(
                    `Received message from queue ${
                        queue.name
                    }: ${message.content.toString()}`
                );

                //do something with the message

                chanel.ack(message);
            }
        });
    });

    console.log("Waiting for messages...");
}

app();
