const Joi = require("joi");

const userJoi = {
    body: Joi.object().keys({
        username: Joi.string().min(6).required(),
        fullName: Joi.object().keys({
            firstname: Joi.string().required(),
            middlename: Joi.string().optional().allow(""),
            lastname: Joi.string().required(),
        }),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required(),
        phoneNumber: Joi.string()
            .pattern(/^\d{10}$/)
            .required()
            .error(new Error("Invalid phone number format")),
    }),
};

const userJoi2 = {
    body: Joi.object().keys({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).max(20).required()
    }),
}

module.exports = { userJoi, userJoi2 };