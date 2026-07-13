/**
 * config/env.js
 * Centralised, validated environment variable configuration.
 * All env vars are resolved here — fail fast on startup if critical ones are missing.
 */

import 'dotenv/config'

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT:     parseInt(process.env.PORT || '5000', 10),

  // ── CORS ───────────────────────────────────────────────────────────────────
  // CLIENT_URL accepts a comma-separated list of allowed origins.
  // Example: "http://localhost:5173,https://edunest.vercel.app"
  CLIENT_URL:      process.env.CLIENT_URL || 'http://localhost:5173',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || '',

  // ── JWT ─────────────────────────────────────────────────────────────────────
  JWT_SECRET:     process.env.JWT_SECRET || 'edunest_dev_secret_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // ── MongoDB ─────────────────────────────────────────────────────────────────
  MONGO_URI: process.env.MONGO_URI || '',

  // ── Gemini AI ───────────────────────────────────────────────────────────────
  // Get a free key at: https://aistudio.google.com/app/apikey
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
}

export default env
