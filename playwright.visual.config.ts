import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Visual Regression — Baseline Config
 * PLANO-080-R7: Single project, viewports set per test
 *
 * Usage:
 *   npx playwright test --config=playwright.visual.config.ts --update-snapshots
 *   npx playwright test --config=playwright.visual.config.ts
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['line'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8788',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'visual-baseline',
      use: { viewport: { width: 1280, height: 720 } },
    },
  ],
})
