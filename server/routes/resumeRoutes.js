/**
 * server/routes/resumeRoutes.js
 */
import { Router } from 'express'
import { analyseResumeHandler } from '../controllers/resumeController.js'

const router = Router()

// POST /api/resume/analyse
router.post('/analyse', analyseResumeHandler)

export default router
