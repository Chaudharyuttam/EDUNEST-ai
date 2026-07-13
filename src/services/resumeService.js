/**
 * src/services/resumeService.js
 * Calls POST /api/resume/analyse with extracted text.
 */
import api from './api.js'

export const analyseResume = async ({ resumeText, targetRole }) => {
  try {
    const { data } = await api.post('/resume/analyse', { resumeText, targetRole })
    return data.analysis
  } catch (error) {
    const msg = error.response?.data?.message
    throw new Error(msg || 'Failed to analyse resume. Please try again.')
  }
}
