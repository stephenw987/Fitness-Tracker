import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,  // Set frontend port (5000)
    open: true,  // Automatically open in browser
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000',  // Backend on port 4000
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/graphql/, ''),  // Strip /graphql prefix
        secure: false,  // Set to true if using HTTPS
      },
    },
  },
});
