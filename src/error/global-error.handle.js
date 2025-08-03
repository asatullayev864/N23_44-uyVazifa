import logger from "../helpers/log/logger.js";

export const globalErrorHandle = (err, req, res, next) => {
    console.log(err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    const stack = err.stack || '';

    if (statusCode.toString().startWith('5')) {
        logger.error(`${statusCode} ${message} ${stack}`);
    }
    
    return res.status(statusCode).json({
        statusCode,
        message
    });
}