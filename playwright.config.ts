import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for UniTeia v2 E2E tests.
 *
 * Runs against the Cloudflare Pages preview runtime on port 8788.
 * Uses a single Chromium browser for speed; add Firefox/WebKit as needed.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8788',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'DOMAIN=http://localhost:8788 bun run build && bun run preview:cf',
    url: 'http://localhost:8788',
    reuseExistingServer: true,
    timeout: 180_000,
  },
})
