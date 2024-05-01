import Joi from "joi";

export default class ValidatorService {
    public validate(schema: Joi.Schema, data: any): void {
        const validationResult = schema.validate(data, { abortEarly: false });

        if (validationResult.error) {
            const errorMessage = validationResult.error.details
                .map((detail) => detail.message)
                .join(", ");
            throw new Error(errorMessage);
        }
    }
}
