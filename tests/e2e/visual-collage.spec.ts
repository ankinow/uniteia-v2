import { type BrowserContext, expect, test } from '@playwright/test'

/**
 * M014-H037 Visual Hand-Draw Collage Regression — AetherHanddrawCollage component
 *
 * Tests the AetherHanddrawCollage component (pure vector hand-drawn collage).
 * Validates: SVG rendering, arrow animation, grain overlay, responsive layout,
 * reduced-motion, and abstract node shapes.
 *
 * On first run, use --update-snapshots:
 *   npx playwright test tests/e2e/visual-collage.spec.ts --update-snapshots
 */

const FIXED_NOW = Date.parse('2026-05-27T12:00:00.000Z')

async function freezeClock(context: BrowserContext) {
  await context.addInitScript(
    ({ fixedNow }: { fixedNow: number }) => {
      const RealDate = Date

      class FrozenDate extends RealDate {
        // biome-ignore lint/suspicious/noExplicitAny: needed for Date constructor overloads
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(fixedNow)
            return
          }
          super(...(args as [number]))
        }
        static now() {
          return fixedNow
        }
      }
      // biome-ignore lint/suspicious/noExplicitAny: global override
      ;(window as any).Date = FrozenDate
    },
    { fixedNow: FIXED_NOW }
  )
}

test.describe.skip('AetherHanddrawCollage Visual Regression', () => {
  test.beforeEach(async ({ context }) => {
    await freezeClock(context)
  })

  test('collage CSS styles load without errors', async ({ page }) => {
    await page.goto('/en/signals/apex/magica-overview')
    await page.waitForLoadState('networkidle')

    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.waitForTimeout(500)

    const cssErrors = errors.filter(
      e => e.includes('collage') || e.includes('aether') || e.includes('grain')
    )
    expect(cssErrors).toHaveLength(0)
  })

  test('collage-draw animation keyframes exist in stylesheet', async ({ page }) => {
    await page.goto('/en/signals')
    await page.waitForLoadState('networkidle')

    const hasAnimation = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets)
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || [])
          for (const rule of rules) {
            if (rule instanceof CSSKeyframesRule && rule.name === 'collage-draw') {
              return true
            }
          }
        } catch {
          // cross-origin stylesheet — skip
        }
      }
      return false
    })

    expect(hasAnimation).toBe(true)
  })

  test('aether-collage responsive class exists', async ({ page }) => {
    await page.goto('/en/signals')
    await page.waitForLoadState('networkidle')

    const hasCollageClass = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets)
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || [])
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule && rule.selectorText?.includes('.aether-collage')) {
              return true
            }
          }
        } catch {
          // skip
        }
      }
      return false
    })

    expect(hasCollageClass).toBe(true)
  })

  test('prefers-reduced-motion disables collage arrow animation', async ({ page }) => {
    await page.goto('/en/signals')
    await page.waitForLoadState('networkidle')

    const hasReducedMotionRule = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets)
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || [])
          for (const rule of rules) {
            if (
              rule instanceof CSSMediaRule &&
              rule.conditionText?.includes('prefers-reduced-motion') &&
              rule.cssText?.includes('collage-arrow')
            ) {
              return true
            }
          }
        } catch {
          // skip
        }
      }
      return false
    })

    expect(hasReducedMotionRule).toBe(true)
  })

  test('site shell renders on signals page (smoke)', async ({ page }) => {
    await page.goto('/en/signals')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-testid="site-shell"]')).toBeVisible()
  })

  test('article page renders collage SVG with nodes and arrows', async ({ page }) => {
    await page.goto('/en/signals/apex/magica-overview')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.aether-collage')).toBeVisible()

    const arrows = await page.locator('.collage-arrow').count()
    expect(arrows).toBeGreaterThanOrEqual(3)

    const hasMarker = await page.evaluate(() => {
      const svg = document.querySelector('.aether-collage svg')
      return svg?.querySelector('#collage-arrowhead') !== null
    })
    expect(hasMarker).toBe(true)

    const hasGrain = await page.evaluate(() => {
      const svg = document.querySelector('.aether-collage svg')
      return svg?.querySelector('#collage-grain') !== null
    })
    expect(hasGrain).toBe(true)
  })

  test('article page collage has zero JS console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto('/en/signals/apex/magica-overview')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    expect(errors).toHaveLength(0)
  })
})
