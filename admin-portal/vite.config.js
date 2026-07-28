import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/admin/',
  cacheDir: '../node_modules/.vite_admin',
  build: {
    outDir: '../dist/admin',
    emptyOutDir: false
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5175,
    host: '0.0.0.0',
    strictPort: true,
    cors: true,
    watch: {
      ignored: ['**/server/**', '**/server/data/**']
    }
  }
})
