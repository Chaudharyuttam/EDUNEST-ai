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
    if (!error.response) {
      throw new Error('Resume analysis service is unavailable. Please start the backend server and try again.')
    }
    const msg = error.response?.data?.message
    throw new Error(msg || 'Failed to analyse resume. Please try again.')
  }
}
