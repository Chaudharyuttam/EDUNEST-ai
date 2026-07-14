/**
 * routes/roadmapRoutes.js
 * Roadmap route definitions — all prefixed with /api/roadmap in app.js
 *
 * NOTE: Global apiLimiter is already applied to all /api/* in app.js.
 *       No need to apply it again here.
 */

import { Router } from 'express'
import { generateRoadmapHandler } from '../controllers/roadmapController.js'

const router = Router()

// POST /api/roadmap/generate
router.post('/generate', generateRoadmapHandler)

export default router
