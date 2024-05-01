import Joi from "joi";

const ConfigSchema = Joi.object({
    PORT: Joi.string().pattern(/^\d+$/).required().messages({
        "string.base": "PORT must be a string",
        "string.pattern.base": "PORT must contain only numeric characters",
        "any.required": "PORT is required",
    }),
    MONGO_URI: Joi.string()
        .pattern(/^mongodb:\/\//)
        .required()
        .messages({
            "string.base": "MONGO_URI must be a string",
            "string.pattern.base": 'MONGO_URI must start with "mongodb://"',
            "any.required": "MONGO_URI is required",
        }),
    RABBITMQ_URI: Joi.string()
        .pattern(/^amqp:\/\//)
        .required()
        .messages({
            "string.base": "RABBITMQ_URI must be a string",
            "string.pattern.base": 'RABBITMQ_URI must start with "amqp://"',
            "any.required": "RABBITMQ_URI is required",
        }),
    RABBITMQ_EXCHANGE_NAME: Joi.string().required().messages({
        "string.base": "RABBITMQ_EXCHANGE_NAME must be a string",
        "any.required": "RABBITMQ_EXCHANGE_NAME is required",
    }),
    RABBITMQ_EXCHANGE_DURABLE: Joi.string()
        .valid("true", "false")
        .required()
        .messages({
            "string.base": "RABBITMQ_EXCHANGE_DURABLE must be a string",
            "any.only":
                'RABBITMQ_EXCHANGE_DURABLE must be either "true" or "false"',
            "any.required": "RABBITMQ_EXCHANGE_DURABLE is required",
        }),
    RABBITMQ_EXCHANGE_TYPE: Joi.string()
        .valid("direct", "topic", "fanout")
        .required()
        .messages({
            "string.base": "RABBITMQ_EXCHANGE_TYPE must be a string",
            "any.only":
                'RABBITMQ_EXCHANGE_TYPE must be either "direct", "topic", or "fanout"',
            "any.required": "RABBITMQ_EXCHANGE_TYPE is required",
        }),
});

export default ConfigSchema;
