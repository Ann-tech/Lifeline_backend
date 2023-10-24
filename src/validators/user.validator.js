const joi = require('joi');
const logger = require('../logging/logger');

const userValidationMiddleware = async function(req, res, next) {
    try {
        const userPayload = req.body;
        await userValidator.validateAsync(userPayload);
        next()
    } catch(err) {
        logger.error(err);
        return res.status(400).json({success: false, message: err.details[0].message})
    }
}

const updateUserValidationMiddleware = async function(req, res, next) {
    try {
        const userPayload = req.body;
        await updateUserValidator.validateAsync(userPayload);
        next()
    } catch(err) {
        logger.error(err);
        return res.status(400).json({success: false, message: err.details[0].message})
    }
}

//Define validation schema
const userValidator = joi.object({
    first_name: joi.string()
                    .required(),
    last_name: joi.string()
                    .required(),
    username: joi.string()
                 .required(),
    email: joi.string()
                .pattern(new RegExp(/^.+@(?:[\w-]+\.)+\w+$/))
                .required(),
    password: joi.string()
                    .required()
});

const updateUserValidator = joi.object({
    first_name: joi.string()
                    .optional(),
    last_name: joi.string()
                    .optional(),
    username: joi.string()
                 .optional()
});

module.exports = {
    userValidationMiddleware,
    updateUserValidationMiddleware
}