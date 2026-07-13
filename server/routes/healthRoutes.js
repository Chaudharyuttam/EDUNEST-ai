/**
 * routes/healthRoutes.js
 * Health check route definitions.
 */

import { Router } from 'express'
import { getHealth } from '../controllers/healthController.js'

const router = Router()

// GET /api/health
router.get('/', getHealth)

export default router
