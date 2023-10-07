const logger = require('../logging/logger')

const handleDuplicateKeyError = (err, res) => {
    const field = Object.keys(err.keyValue);
    const code = 409;
    const error = `${field} already exists`;
    res.status(code).json({
        success: false,
        fields: field.join(", "),
        message: error
    });
}

const handleValidationError = (err, res) => {
    let errors = Object.values(err.errors).map(el => el.message);
    let fields = Object.values(err.errors).map(el => el.path);
    let code = 400;

    const formattedErrors = errors.join(' ');

    res.status(code).json({success: false, message: formattedErrors, fields: fields.join(', ')});
}

async function errorHandler(err, req, res, next) {
    logger.error("An error has occured")
    logger.error(err.message)
    try {
        if(err.name === 'ValidationError') return handleValidationError(err, res);
        if(err.code && err.code == 11000) return handleDuplicateKeyError(err, res);
    } catch(err) {
        res.status(500).json({success: false, message: 'An unknown error occurred.'});
    }
}

module.exports = errorHandler;