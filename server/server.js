/**
 * server.js
 * Application entry point.
 *
 * Responsibilities:
 *  - Import the configured Express app
 *  - Bind to the port defined in .env
 *  - Handle uncaught exceptions and unhandled rejections gracefully
 *
 * Keep this file minimal — all configuration lives in app.js.
 */

import app from './app.js'
import env from './config/env.js'
import logger from './utils/logger.js'

// ── Start server ──────────────────────────────────────────────────────────────
const server = app.listen(env.PORT, () => {
  logger.success(`EduNest AI server started`)
  logger.info(`Environment : ${env.NODE_ENV}`)
  logger.info(`Port        : ${env.PORT}`)
  logger.info(`Health      : http://localhost:${env.PORT}/api/health`)
  logger.info(`CORS origin : ${env.CLIENT_URL}`)
})

// ── Graceful shutdown helpers ─────────────────────────────────────────────────

/**
 * Closes the HTTP server and exits the process cleanly.
 * Called on SIGTERM (Docker stop) or SIGINT (Ctrl+C).
 */
const shutdown = (signal) => {
  logger.warn(`${signal} received — shutting down gracefully…`)
  server.close(() => {
    logger.info('HTTP server closed.')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

// ── Safety nets ───────────────────────────────────────────────────────────────

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION — shutting down…', err.message)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  logger.error('UNHANDLED REJECTION — shutting down…', reason)
  server.close(() => process.exit(1))
})
