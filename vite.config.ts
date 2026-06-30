import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const appVersion = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')).version

// Base path differs per environment because each GitHub Pages repo serves from
// its own sub-path. Production: /customer-journey-mapper/. Staging:
// /customer-journey-mapper-staging/. Driven by VITE_BASE (set in CI); falls
// back to the production path for local builds.
const base = process.env.VITE_BASE || '/customer-journey-mapper/'

// GITHUB_SHA is set automatically in every Actions job; fall back to a local
// git lookup for dev/manual builds.
function commitShortHash() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

// Stamps a hidden comment (app version + commit short-hash) into the served
// index.html for build provenance. HTML comments render nothing, so this adds
// no visible UI change.
function buildStamp() {
  const stamp = `<!-- build: v${appVersion} (${commitShortHash()}) -->`
  return {
    name: 'build-stamp',
    transformIndexHtml(html: string) {
      return html.replace('</head>', `  ${stamp}\n  </head>`)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), buildStamp()],
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
