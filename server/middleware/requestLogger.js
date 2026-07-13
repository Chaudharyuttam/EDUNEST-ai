/**
 * middleware/requestLogger.js
 * HTTP request logger using Morgan.
 * Uses 'dev' format in development, 'combined' (Apache-style) in production.
 */

import morgan from 'morgan'
import env from '../config/env.js'

const requestLogger = morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev')

export default requestLogger
