/**
 * src/services/roadmapService.js
 * Frontend — calls POST /api/roadmap/generate with new input schema.
 */
import api from './api.js'

/**
 * @param {{ careerGoal: string, skillLevel: string, dailyHours: number, targetDays: number }} params
 * @returns {Promise<object>} Roadmap object
 */
export const generateRoadmap = async ({ careerGoal, skillLevel, dailyHours, targetDays }) => {
  try {
    const { data } = await api.post('/roadmap/generate', {
      careerGoal,
      skillLevel,
      dailyHours: Number(dailyHours),
      targetDays: Number(targetDays),
    })
    return data.roadmap
  } catch (error) {
    const msg = error.response?.data?.message
    throw new Error(msg || 'Failed to generate roadmap. Please try again.')
  }
}
