/**
 * server/controllers/resumeController.js
 * POST /api/resume/analyse
 * Accepts { resumeText, targetRole } → calls resumeService → returns analysis.
 */

import { AppError } from '../middleware/errorHandler.js'
import { analyseResume } from '../services/resumeService.js'

const MIN_RESUME_LENGTH = 100   // chars — reject obviously empty extractions
const MAX_RESUME_LENGTH = 15000 // chars — prevent oversized payloads

export const analyseResumeHandler = async (req, res, next) => {
  try {
    const { resumeText, targetRole } = req.body

    if (!resumeText || typeof resumeText !== 'string') {
      return next(new AppError('"resumeText" is required.', 400))
    }
    if (resumeText.trim().length < MIN_RESUME_LENGTH) {
      return next(new AppError('Resume text is too short. Please ensure the PDF was parsed correctly.', 400))
    }
    if (resumeText.length > MAX_RESUME_LENGTH) {
      return next(new AppError('Resume text exceeds the maximum allowed length.', 413))
    }

    const analysis = await analyseResume({
      resumeText: resumeText.trim(),
      targetRole: typeof targetRole === 'string' ? targetRole.trim().slice(0, 100) : '',
    })

    return res.status(200).json({ success: true, analysis })
  } catch (error) {
    next(error)
  }
}
