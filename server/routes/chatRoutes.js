/**
 * routes/chatRoutes.js
 * Chat / AI route definitions.
 * All routes here are prefixed with /api/chat in app.js.
 */

import { Router } from 'express'
import { sendMessage } from '../controllers/chatController.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// POST /api/chat
// Rate-limited to prevent abuse.
// TODO (auth phase): add authMiddleware to protect this route.
router.post('/', authLimiter, sendMessage)

export default router
