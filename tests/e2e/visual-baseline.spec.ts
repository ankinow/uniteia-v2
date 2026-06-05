/**
 * Visual Baseline Capture — Canva Magica (quick version)
 * PLANO-080-R7: 1 lang × 3 viewports = 3 baselines
 * Run: npx playwright test tests/e2e/visual-baseline.spec.ts --config=playwright.visual.config.ts --update-snapshots
 */
import { expect, test } from '@playwright/test'

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet', width: 834, height: 1194 },
  { name: 'mobile', width: 430, height: 932 },
]

for (const vp of VIEWPORTS) {
  test(`screenshot-magica-overview-en-${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto('/en/signals/apex/magica-overview')
    await page.waitForSelector('.canva-container, .storyboard-grid, .living-brief-2col', {
      timeout: 15000,
    })
    await page.waitForTimeout(800)
    await expect(page).toHaveScreenshot(`magica-overview-en-${vp.name}.png`, {
      fullPage: true,
      maxDiffPixels: 100,
      timeout: 15000,
      animations: 'disabled',
    })
  })
}
