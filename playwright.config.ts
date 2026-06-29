import { defineConfig, devices } from '@playwright/test'

// E2E config. Tests run against the locally-built app served by `vite preview`.
// CI starts the preview server automatically (see webServer below).
const PORT = 4173
const BASE = `http://localhost:${PORT}/customer-journey-mapper/`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,     // fail CI if a test.only was left in
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  use: {
    baseURL: BASE,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Build first, then serve the production build, then run tests against it.
  webServer: {
    command: 'npm run preview -- --port ' + PORT + ' --strictPort',
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
