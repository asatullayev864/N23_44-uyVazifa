export const globalErrorHandle = (err, req, res, next) => {
    console.log(err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    console.log(err);
    return res.status(statusCode).json({
        statusCode,
        message
    });
}