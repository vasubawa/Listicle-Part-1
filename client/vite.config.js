import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/data': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})