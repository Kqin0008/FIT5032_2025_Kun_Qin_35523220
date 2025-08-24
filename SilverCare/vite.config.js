import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // Proxy for local server API
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    },
    // Enable HMR explicitly
    hmr: {
      enabled: true,
      // Show overlay on error
      overlay: true,
    },
    // Auto-open browser when server starts
    open: true
  },
  // Ensure Firebase modules are properly bundled
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: (id) => {
          // Separate Firebase modules into their own chunk
          if (id.includes('node_modules/firebase')) {
            return 'firebase';
          }
        }
      }
    }
  }
})
