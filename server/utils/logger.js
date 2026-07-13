/**
 * utils/logger.js
 * Lightweight console logger utility.
 * Prefixes messages with timestamps and log levels.
 * Swap for Winston or Pino in production for structured JSON logging.
 */

const pad = (n) => String(n).padStart(2, '0')

const timestamp = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const logger = {
  info: (...args) => console.log(`\x1b[36m[${timestamp()}] INFO\x1b[0m`, ...args),
  success: (...args) => console.log(`\x1b[32m[${timestamp()}] OK  \x1b[0m`, ...args),
  warn: (...args) => console.warn(`\x1b[33m[${timestamp()}] WARN\x1b[0m`, ...args),
  error: (...args) => console.error(`\x1b[31m[${timestamp()}] ERR \x1b[0m`, ...args),
}

export default logger
