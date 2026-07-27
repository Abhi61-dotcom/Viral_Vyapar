import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  cacheDir: '../node_modules/.vite_admin',
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
