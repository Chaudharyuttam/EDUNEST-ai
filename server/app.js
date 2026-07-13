/**
 * app.js
 * Express application factory.
 *
 * Responsibilities:
 *  - Configure global middleware (security, CORS, JSON parsing, logging)
 *  - Mount all API routes
 *  - Attach error handling middleware (must be LAST)
 *
 * This file does NOT start the server (that is server.js's job).
 */

import express from 'express'
import cors    from 'cors'
import helmet  from 'helmet'

import env from './config/env.js'
import requestLogger from './middleware/requestLogger.js'
import errorHandler, { NotFoundError } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimiter.js'

// ── Route imports ─────────────────────────────────────────────────────────────
import healthRoutes from './routes/healthRoutes.js'
import chatRoutes   from './routes/chatRoutes.js'
import roadmapRoutes from './routes/roadmapRoutes.js'
import resumeRoutes from './routes/resumeRoutes.js'

const app = express()

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet())

// ── CORS ──────────────────────────────────────────────────────────────────────
// Build allowed origins list from env variables.
// In development: allow localhost:5173
// In production:  allow Vercel URL(s) listed in ALLOWED_ORIGINS
const buildAllowedOrigins = () => {
  const origins = new Set()

  // Always add CLIENT_URL
  if (env.CLIENT_URL) {
    env.CLIENT_URL.split(',').forEach(o => origins.add(o.trim()))
  }

  // Also add comma-separated ALLOWED_ORIGINS
  if (env.ALLOWED_ORIGINS) {
    env.ALLOWED_ORIGINS.split(',').forEach(o => origins.add(o.trim()))
  }

  return [...origins].filter(Boolean)
}

const allowedOrigins = buildAllowedOrigins()

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (origin is undefined) and curl/Postman
      if (!origin) return callback(null, true)
      // Allow all in development
      if (env.NODE_ENV === 'development') return callback(null, true)
      // In production, check against whitelist
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`CORS: origin ${origin} is not allowed`))
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))        // 1MB allows large resume text
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// ── HTTP request logging ──────────────────────────────────────────────────────
app.use(requestLogger)

// ── Global rate limiter ───────────────────────────────────────────────────────
app.use('/api', apiLimiter)

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/health',  healthRoutes)
app.use('/api/chat',    chatRoutes)
app.use('/api/roadmap', roadmapRoutes)
app.use('/api/resume',  resumeRoutes)

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, _res, next) => {
  next(new NotFoundError('API route not found. Check the URL and HTTP method.'))
})

// ── Global error handler (must be after all routes & middleware) ───────────────
app.use(errorHandler)

export default app
