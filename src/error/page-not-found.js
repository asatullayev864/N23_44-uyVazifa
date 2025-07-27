import { AppError } from "./AppError.js"

export const pageError = (req, res, next) => {
    throw next(new AppError('Page not found', 404));
}