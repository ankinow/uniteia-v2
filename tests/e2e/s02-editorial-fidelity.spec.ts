import { expect, test } from '@playwright/test'

test.describe('S02 Editorial Fidelity', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a route that uses the article frame to ensure tokens are visible
    await page.goto('/en/test-article')
    await page.waitForLoadState('networkidle')
  })

  test('Geist Sans is applied to headings', async ({ page }) => {
    // Select the primary heading in the adaptive header
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    const fontFamily = await h1.evaluate(el => window.getComputedStyle(el).fontFamily)
    // Strip quotes for comparison
    const normalizedFontFamily = fontFamily.replace(/['"]/g, '')
    expect(normalizedFontFamily).toContain('Geist Sans')
  })

  test('Inter is applied to body text', async ({ page }) => {
    // Specifically target the article body to avoid metadata/subtitle text
    const p = page.locator('.prose p').first()
    await expect(p).toBeVisible()
    const fontFamily = await p.evaluate(el => window.getComputedStyle(el).fontFamily)
    const normalizedFontFamily = fontFamily.replace(/['"]/g, '')
    expect(normalizedFontFamily).toContain('Inter Variable')
  })

  test('Contrast ratio meets 15.2:1 requirement (Bone on Void)', async ({ page }) => {
    // Specifically target the article body to ensure we measure the primary text color
    const p = page.locator('.prose p').first()
    
    const colors = await p.evaluate(el => {
      const style = window.getComputedStyle(el)
      
      // Helper to find actual background color by traversing up the DOM
      const getActualBgColor = (element: HTMLElement) => {
        let current: HTMLElement | null = element
        while (current) {
          const bg = window.getComputedStyle(current).backgroundColor
          if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg
          current = current.parentElement
        }
        return 'rgb(13, 17, 23)' // Fallback to void (#0D1117)
      }

      return {
        color: style.color,
        backgroundColor: getActualBgColor(el)
      }
    })

    // Helper to calculate relative luminance
    const getLuminance = (rgb: string) => {
      const parts = rgb.match(/\d+/g)
      if (!parts) return 0
      const [r, g, b] = parts.slice(0, 3).map(Number).map(v => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
    }

    const l1 = getLuminance(colors.color)
    const l2 = getLuminance(colors.backgroundColor)

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    
    // Bone (#F0E8D8) on Void (#0D1117)
    // Bone: L ≈ 0.79
    // Void: L ≈ 0.005
    // Ratio ≈ (0.79 + 0.05) / (0.005 + 0.05) ≈ 0.84 / 0.055 ≈ 15.27
    console.log(`Measured contrast ratio: ${ratio.toFixed(2)}:1`)
    expect(ratio).toBeGreaterThanOrEqual(15.2)
  })

  test('SVG filters are present in the DOM', async ({ page }) => {
    // These should be injected by SiteShell via SvgFilters
    // Use .first() to handle cases where multiple instances might be injected (e.g. during transitions)
    const scratchFilter = page.locator('filter#scratch').first()
    await expect(scratchFilter).toBeAttached()

    const noiseFilter = page.locator('filter#noise').first()
    await expect(noiseFilter).toBeAttached()
  })

  test('Scratch dividers use the scratch filter', async ({ page }) => {
    // Find a scratch divider
    const divider = page.locator('.scratch-divider').first()
    if (await divider.count() > 0) {
      const filter = await divider.evaluate(el => window.getComputedStyle(el).filter)
      expect(filter).toContain('url("#scratch")')
    } else {
      console.warn('No .scratch-divider found on page, skipping filter application check')
    }
  })
})
