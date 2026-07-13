/**
 * controllers/chatController.js
 * AI Chat controller — validates input then delegates to chatService.
 *
 * The controller is intentionally thin:
 *  - Validate the HTTP request
 *  - Call the service
 *  - Shape the HTTP response
 * All AI logic and error mapping lives in chatService.js.
 */

import { AppError } from '../middleware/errorHandler.js'
import { getAIResponse } from '../services/chatService.js'

/**
 * POST /api/chat
 *
 * Request body:
 *   { "message": "Explain React Hooks" }
 *
 * Success response (200):
 *   { "success": true, "reply": "<AI generated text>" }
 *
 * Error responses (400 / 422 / 429 / 502 / 503 / 504):
 *   { "success": false, "message": "<user-friendly error>" }
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body

    // ── Input validation ──────────────────────────────────────────────────────
    if (!message || typeof message !== 'string') {
      return next(new AppError('A "message" string is required in the request body.', 400))
    }

    const trimmed = message.trim()

    if (trimmed.length === 0) {
      return next(new AppError('Message cannot be empty.', 400))
    }

    if (trimmed.length > 4000) {
      return next(new AppError('Message exceeds the 4000 character limit.', 400))
    }

    // ── Call Gemini via the service layer ─────────────────────────────────────
    const reply = await getAIResponse(trimmed)

    // ── Respond ───────────────────────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      reply,
    })

  } catch (error) {
    // Pass AppErrors and unexpected errors to the global error handler
    next(error)
  }
}
