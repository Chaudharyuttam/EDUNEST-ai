/**
 * controllers/healthController.js
 * Health check controller — used to verify the server is up.
 * Called by monitoring tools, DevOps pipelines, and the frontend during init.
 */

/**
 * GET /api/health
 * Returns server status, environment, and uptime.
 */
export const getHealth = (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduNest AI Backend Running',
    environment: process.env.NODE_ENV || 'development',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  })
}
