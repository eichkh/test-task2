import Joi from "joi";

const CreateUserSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Name must be a string",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
});

export default CreateUserSchema;
