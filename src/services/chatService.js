/**
 * src/services/chatService.js
 * Frontend service for the /api/chat endpoint.
 */

import api from './api.js'

/**
 * Sends a user message to the AI backend.
 * @param {string} message - The user's prompt.
 * @returns {Promise<string>} - The AI reply text.
 * @throws Will throw an error with a user-friendly message on failure.
 */
export const sendChatMessage = async (message) => {
  try {
    const { data } = await api.post('/chat', { message })
    return data.reply
  } catch (error) {
    const serverMsg = error.response?.data?.message
    throw new Error(serverMsg || 'Failed to get a response. Please try again.')
  }
}

/**
 * Checks that the backend is reachable.
 * @returns {Promise<object>} - The health check response object.
 */
export const checkHealth = async () => {
  const { data } = await api.get('/health')
  return data
}
