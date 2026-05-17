import { expect, test } from '@playwright/test'

/**
 * Visual QA — screenshot comparison tests
 *
 * Captures full-page screenshots of tracked routes and compares them
 * against stored baselines using pixel-diff thresholds (1% max diff).
 *
 * On first run, use --update-snapshots to generate baselines:
 *   npx playwright test tests/e2e/s06-visual-qa.spec.ts --update-snapshots
 *
 * On subsequent runs, compares against baselines:
 *   npx playwright test tests/e2e/s06-visual-qa.spec.ts
 */

const TRACKED_PAGES = [
  { name: 'niche-index', route: '/en/signals', selector: '[data-testid="niche-index"]' },
  {
    name: 'article-page',
    route: '/en/signals/apex/tencent-cloud-deal-stack-builders',
    selector: '[data-testid="article-frame"]',
  },
  {
    name: 'niche-landing',
    route: '/en/signals/ai-agents',
    selector: '[data-testid="niche-landing-ai-agents"]',
  },
] as const

test.describe('S06: Visual QA', () => {
  for (const pageDef of TRACKED_PAGES) {
    test(`screenshot: ${pageDef.name}`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', msg => {
        if (
          msg.type() === 'error' &&
          !msg.text().startsWith('Detected Layout Shift during page load')
        ) {
          errors.push(msg.text())
        }
      })

      await page.goto(pageDef.route)
      await expect(page.locator(pageDef.selector)).toBeVisible()
      await page.waitForLoadState('networkidle')

      // Full-page screenshot with 1% pixel-diff tolerance
      await expect(page).toHaveScreenshot(`${pageDef.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      })

      expect(errors, `Console errors on ${pageDef.route}: ${errors.join('; ')}`).toHaveLength(0)
    })
  }
})
