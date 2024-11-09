import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 2000,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:2001',
        secure: false,
        changeOrigin: true,
      }
    }
  }
})
