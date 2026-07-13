/**
 * src/services/api.js
 * Centralised Axios instance for all backend communication.
 *
 * In DEVELOPMENT:  requests go to /api which Vite proxies to localhost:5000
 * In PRODUCTION:   requests go directly to VITE_API_URL (your Render backend URL)
 */

import axios from 'axios'

// Resolve base URL:
// - Production: VITE_API_URL env variable (set in Vercel dashboard)
// - Development: /api  (Vite proxy forwards to localhost:5000)
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,  // 30s — AI/OCR requests can be slow
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor: auto-attach JWT ─────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: global error handling ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
