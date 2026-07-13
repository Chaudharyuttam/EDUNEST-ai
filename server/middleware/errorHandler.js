/**
 * middleware/errorHandler.js
 * Global error-handling middleware for Express.
 * Must be registered LAST in app.js (after all routes).
 */

import env from '../config/env.js'

/**
 * Operational error class — thrown intentionally (e.g. 404, bad input).
 * Non-operational errors (e.g. bugs) are handled separately.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * 404 handler — call next(err) from any route that needs a not-found response.
 * @example next(new NotFoundError('Route not found'))
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404)
  }
}

/**
 * Global error handler middleware.
 * Sends a structured JSON error response.
 */
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500
  const isProduction = env.NODE_ENV === 'production'

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only expose stack trace in development
    ...(isProduction ? {} : { stack: err.stack }),
  })
}

export default errorHandler
