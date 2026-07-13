import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],

    // Build optimizations
    build: {
      target: 'esnext',
      sourcemap: false,
      rollupOptions: {
        output: {
          // Split large dependencies into separate chunks
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui:     ['framer-motion', 'lucide-react'],
            ai:     ['axios'],
          },
        },
      },
    },

    server: {
      port: 5173,
      // Dev proxy — forwards /api requests to Express backend so CORS isn't an issue
      // In production, the frontend calls VITE_API_URL directly
      proxy: {
        '/api': {
          target: env.VITE_API_URL
            ? env.VITE_API_URL.replace('/api', '')
            : 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
