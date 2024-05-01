import Joi from "joi";

const GetUserByIdSchema = Joi.string().length(24).hex().messages({
    "string.base": "User ID must be a string",
    "string.length": "User ID must be exactly 24 characters",
    "string.hex": "User ID must be a valid hexadecimal string",
});

export default GetUserByIdSchema;
