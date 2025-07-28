import { ipKeyGenerator, rateLimit } from 'express-rate-limit';

export const requestLimiter = (seconds, limit) => {
    const limiter = rateLimit({
        windowMs: seconds * 1000,
        limit,
        keyGenerator: (req, res) => {
            return ipKeyGenerator(req.ip);
        },
        legacyHeaders: true,
        standardHeaders: 'draft-6' || 'draft-7' || 'draft-8',
        message: {
            status: 429,
            message: 'Too many requests'
        }
    });
    return limiter;
}