import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 4000,
  },
  resolve: {
    alias: {
      '@': '/src'
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
