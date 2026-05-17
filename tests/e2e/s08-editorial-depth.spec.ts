import { expect, test } from '@playwright/test'

test.describe('S08 editorial depth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/signals/ai-agents', { waitUntil: 'networkidle' })
    await page.evaluate(async () => {
      await document.fonts.ready
    })
  })

  test('niche landing exposes front, mid, and back planes', async ({ page }) => {
    const landing = page.locator('[data-testid="niche-landing-ai-agents"]')
    await expect(landing).toBeVisible()

    await expect(page.locator('[data-surface="depth-section"][data-depth="front"]')).toBeVisible()
    await expect(page.locator('[data-surface="depth-section"][data-depth="mid"]')).toBeVisible()
    await expect(page.locator('[data-surface="depth-section"][data-depth="back"]')).toBeVisible()
  })

  test('niche landing keeps the editorial composition stable', async ({ page }) => {
    await expect(page.locator('[data-testid="niche-landing-ai-agents"]')).toHaveScreenshot(
      's08-editorial-depth.png',
      {
        animations: 'disabled',
        maxDiffPixelRatio: 0.01,
      }
    )
  })
})
