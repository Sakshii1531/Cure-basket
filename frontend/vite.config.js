import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:5001';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
        // Live-chat WebSocket — proxy the Socket.IO endpoint to the backend.
        '/socket.io': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('recharts')) {
                return 'vendor-charts';
              }
            }
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/tests/setup.js',
      exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'e2e'],
      css: false,
      exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
    },
  };
})

