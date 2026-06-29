import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path differs per environment because each GitHub Pages repo serves from
// its own sub-path. Production: /customer-journey-mapper/. Staging:
// /customer-journey-mapper-staging/. Driven by VITE_BASE (set in CI); falls
// back to the production path for local builds.
const base = process.env.VITE_BASE || '/customer-journey-mapper/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          dagre: ['dagre'],
          supabase: ['@supabase/supabase-js'],
        }
      }
    }
  }
})
