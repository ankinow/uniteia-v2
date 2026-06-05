import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for UniTeia v2 E2E tests.
 *
 * Runs against the Cloudflare Pages preview runtime.
 * The PLAYWRIGHT_BASE_URL env var overrides the default port (set by ship:check
 * when it starts a dynamic wrangler preview server on a free port).
 * Uses a single Chromium browser for speed; add Firefox/WebKit as needed.
 */
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8788'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: 'html',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command:
      'npx wrangler pages dev dist --compatibility-date=2026-04-01 --compatibility-flags nodejs_compat --port=8788',
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 180_000,
  },
})
