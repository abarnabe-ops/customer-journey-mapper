import { defineConfig, devices } from '@playwright/test'

// E2E config. Tests run against the locally-built app served by `vite preview`.
// The base path MUST match what the app was built with (VITE_BASE), otherwise
// vite preview serves assets under a different path and they 404. Defaults to
// the production base for local runs.
const PORT = 4173
const VITE_BASE = process.env.VITE_BASE || '/customer-journey-mapper/'
const BASE = `http://localhost:${PORT}${VITE_BASE}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,     // fail CI if a test.only was left in
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['json', { outputFile: 'e2e-results.json' }], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  use: {
    baseURL: BASE,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  // Build first, then serve the production build, then run tests against it.
  webServer: {
    command: 'npm run preview -- --port ' + PORT + ' --strictPort',
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
