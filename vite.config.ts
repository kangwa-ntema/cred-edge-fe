// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: mode === 'mobile' ? '0.0.0.0' : 'localhost', // Only expose for mobile
      proxy: mode === 'development' ? {
        '/api': {
          target: env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000',
          changeOrigin: true,
        },
      } : undefined, // No proxy in production/mobile
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    // Clear define to avoid conflicts
  }
})