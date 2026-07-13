/**
 * middleware/rateLimiter.js
 * Rate limiting middleware using express-rate-limit.
 * Protects all API routes from brute-force and DoS attacks.
 */

import rateLimit from 'express-rate-limit'

/**
 * General API rate limiter — 100 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,   // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,     // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
})

/**
 * Strict limiter for auth endpoints — 10 requests per 15 minutes per IP.
 * Used on /api/auth/* routes to prevent credential stuffing.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
})
