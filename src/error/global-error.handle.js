export const globalErrorHandle = (err, req, res, next) => {
    const statusCode = err.statusCode;
    const message = err.message;
    console.log(err);
    return res.status(statusCode).json({
        statusCode: err.statusCode,
        message: err.message
    });
}