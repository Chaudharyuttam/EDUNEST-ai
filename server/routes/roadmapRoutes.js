/**
 * routes/roadmapRoutes.js
 * Roadmap route definitions — all prefixed with /api/roadmap in app.js
 */

import { Router } from 'express'
import { generateRoadmapHandler } from '../controllers/roadmapController.js'
import { apiLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// POST /api/roadmap/generate
// Standard rate limit — Gemini calls are expensive, so limit per IP
router.post('/generate', apiLimiter, generateRoadmapHandler)

export default router
