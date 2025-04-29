import { RateLimiterMemory } from 'rate-limiter-flexible';
import rateLimit from 'express-rate-limit';

/**
 * In-memory rate limiter (shared across all routes)
 * Useful for global rate limiting based on IP address.
 */
const memoryRateLimiter = new RateLimiterMemory({
    points: 100, // Number of points (requests)
    duration: 60, // Per 60 seconds
});

/**
 * Middleware to enforce global rate limiting using in-memory strategy.
 */
const rateLimiterMiddleware = async (req, res, next) => {
    try {
        await memoryRateLimiter.consume(req.ip);
        next();
    } catch {
        res.status(429).json({
            error: 'Too many requests',
            message: 'Please try again later',
        });
    }
};

/**
 * API-specific rate limiting using express-rate-limit.
 * Typically used for endpoints like `/api/*`.
 */
const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests',
        retryAfter: '15 minutes',
    },
});

export default {
    rateLimiterMiddleware,
    apiRateLimiter,
};