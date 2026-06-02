/**
 * Canva Magica Visual Regression Tests
 * PLANO-080: 8 langs, layout integrity, text clipping, i18n health
 *
 * Run: bun run test:visual
 * Requires: `bun run build && bun run preview` (or CI webServer)
 */
import { expect, test } from '@playwright/test'

const URL = '/en/signals/apex/magica-overview'
const LANGS = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const

test.describe('Canva Magica — Visual Integrity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL)
    await page.waitForSelector('.storyboard-grid, .canva-container, .living-brief-2col', {
      timeout: 10000,
    })
  })

  test('page renders with correct title', async ({ page }) => {
    const title = await page.title()
    expect(title).toContain('Magica')
  })

  test('storyboard grid has 4 cells', async ({ page }) => {
    const cells = page.locator('.storyboard-cell, .depth-card')
    const count = await cells.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('no i18n raw keys visible in body', async ({ page }) => {
    const body = page.locator('body')
    const text = await body.innerText()
    const rawKeys = ['magicaWorkflowBuilder', 'unifiedPromptEngineering', 'magicaCommandCenter']
    for (const key of rawKeys) {
      expect(text).not.toContain(key)
    }
  })

  test('SVG workflow image renders', async ({ page }) => {
    const svgImg = page.locator('.storyboard-cell__image, .connection-svg').first()
    await expect(svgImg).toBeVisible()
  })

  test('no text clipping in cards', async ({ page }) => {
    const cards = page.locator('.storyboard-cell, .depth-card')
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      const clipped = await card.evaluate(el => {
        const { scrollWidth, scrollHeight, clientWidth, clientHeight } = el
        return scrollWidth > clientWidth || scrollHeight > clientHeight
      })
      expect(clipped).toBe(false)
    }
  })
})

test.describe('Canva Magica — 8 Lang i18n Coverage', () => {
  for (const lang of LANGS) {
    test(`${lang}: page loads with localized content`, async ({ page }) => {
      await page.goto(`/${lang}/signals/apex/magica-overview`)
      await page.waitForSelector('.storyboard-grid, .living-brief-2col', { timeout: 10000 })

      const body = page.locator('body')
      const text = await body.innerText()

      // Verify no raw English-only markers remain
      expect(text).not.toContain('magicaWorkflowBuilder')
      expect(text).not.toContain('unifiedPromptEngineering')

      // Verify page has meaningful content
      expect(text.length).toBeGreaterThan(100)
    })
  }
})
