/**
 * controllers/roadmapController.js
 * Validates new input schema and delegates to roadmapService.
 *
 * Input: { careerGoal, skillLevel, dailyHours, targetDays }
 */

import { AppError } from '../middleware/errorHandler.js'
import { generateRoadmap } from '../services/roadmapService.js'

const VALID_SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const VALID_TARGET_DAYS  = [30, 60, 90]

/**
 * POST /api/roadmap/generate
 *
 * Body:
 *   {
 *     "careerGoal" : "MERN Stack Developer",
 *     "skillLevel" : "Beginner",
 *     "dailyHours" : 2,
 *     "targetDays" : 60
 *   }
 */
export const generateRoadmapHandler = async (req, res, next) => {
  try {
    const { careerGoal, skillLevel, dailyHours, targetDays } = req.body

    // ── Validate careerGoal ───────────────────────────────────────────────────
    if (!careerGoal || typeof careerGoal !== 'string' || careerGoal.trim().length < 3) {
      return next(new AppError('"careerGoal" must be a non-empty string (min 3 chars).', 400))
    }
    if (careerGoal.trim().length > 200) {
      return next(new AppError('"careerGoal" must not exceed 200 characters.', 400))
    }

    // ── Validate skillLevel ───────────────────────────────────────────────────
    if (!skillLevel || !VALID_SKILL_LEVELS.includes(skillLevel)) {
      return next(new AppError(`"skillLevel" must be one of: ${VALID_SKILL_LEVELS.join(', ')}.`, 400))
    }

    // ── Validate dailyHours ───────────────────────────────────────────────────
    const hours = Number(dailyHours)
    if (!dailyHours || isNaN(hours) || hours < 1 || hours > 12) {
      return next(new AppError('"dailyHours" must be a number between 1 and 12.', 400))
    }

    // ── Validate targetDays ───────────────────────────────────────────────────
    const days = Number(targetDays)
    if (!targetDays || !VALID_TARGET_DAYS.includes(days)) {
      return next(new AppError(`"targetDays" must be one of: ${VALID_TARGET_DAYS.join(', ')}.`, 400))
    }

    // ── Generate ──────────────────────────────────────────────────────────────
    const roadmap = await generateRoadmap({
      careerGoal : careerGoal.trim(),
      skillLevel,
      dailyHours : hours,
      targetDays : days,
    })

    return res.status(200).json({ success: true, roadmap })

  } catch (error) {
    next(error)
  }
}
