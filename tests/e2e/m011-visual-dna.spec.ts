import { type BrowserContext, expect, test } from '@playwright/test'

/**
 * M011 Visual DNA — Visual regression tests for all new visual surfaces
 *
 * Covers 4 surfaces introduced in M011 S01–S04:
 * 1. Shell + Tactile Warmth (grain-4k + paper-fiber overlay)
 * 2. 2.5D Header (SiteHeader2D5 wrapper)
 * 3. Organic Anti-Grid (Niche Index)
 * 4. Depth Card System (via DepthCard on niche landing page)
 *
 * Note: CinematicDepthCard is defined but not yet wired into production pages
 * (MEM022). The depth-card test targets the live DepthCard component via
 * [data-surface="depth-card"] on niche landing pages.
 *
 * On first run, use --update-snapshots to generate baselines:
 *   npx playwright test tests/e2e/m011-visual-dna.spec.ts --update-snapshots
 *
 * On subsequent runs, compares against baselines:
 *   npx playwright test tests/e2e/m011-visual-dna.spec.ts
 */

const FIXED_NOW = Date.parse('2026-05-01T12:00:00.000Z')

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
          // @ts-ignore
          super(...args)
        }

        static now() {
          return fixedNow
        }

        static parse(value: string) {
          return RealDate.parse(value)
        }

        static UTC(...args: Parameters<typeof Date.UTC>) {
          return RealDate.UTC(...args)
        }
      }

      // biome-ignore lint/suspicious/noExplicitAny: needed for browser-side Date constructor injection
      const frozenGlobal = globalThis as any
      frozenGlobal.Date = FrozenDate
    },
    { fixedNow: FIXED_NOW }
  )
}

test.use({
  timezoneId: 'UTC',
  viewport: { width: 1440, height: 1200 },
})

test.describe('M011: Visual DNA', () => {
  test.beforeEach(async ({ context }) => {
    await freezeClock(context)
  })

  test('shell + tactile warmth (grain-4k / paper-fiber)', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (
        msg.type() === 'error' &&
        !msg.text().startsWith('Detected Layout Shift during page load')
      ) {
        errors.push(msg.text())
      }
    })

    await page.goto('/en/signals')
    await page.waitForLoadState('networkidle')

    const shell = page.locator('[data-testid="site-shell"]')
    await expect(shell).toBeVisible()

    // Full-page screenshot captures grain-4k + paper-fiber overlays globally
    // Use 30s timeout because fullPage on long pages needs more time
    await expect(page).toHaveScreenshot('m011-shell-grain.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
      timeout: 30000,
    })

    expect(errors, `Console errors: ${errors.join('; ')}`).toHaveLength(0)
  })

  test('2.5D header (SiteHeader2D5)', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (
        msg.type() === 'error' &&
        !msg.text().startsWith('Detected Layout Shift during page load')
      ) {
        errors.push(msg.text())
      }
    })

    await page.goto('/en/signals')
    await page.waitForLoadState('networkidle')
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    const header = page.locator('[data-testid="site-header"]')
    await expect(header).toBeVisible()

    // Element-level screenshot with animations disabled (WAAPI tilt in SiteHeader2D5)
    await expect(header).toHaveScreenshot('m011-header-2d5.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    })

    expect(errors, `Console errors: ${errors.join('; ')}`).toHaveLength(0)
  })

  test('organic anti-grid (niche index)', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (
        msg.type() === 'error' &&
        !msg.text().startsWith('Detected Layout Shift during page load')
      ) {
        errors.push(msg.text())
      }
    })

    await page.goto('/en/signals')
    await page.waitForLoadState('networkidle')

    const index = page.locator('[data-testid="niche-index"]')
    await expect(index).toBeVisible()

    // Full-page screenshot captures the varied 2/3/4 column anti-grid layout
    // Use 30s timeout because fullPage on long pages needs more time
    await expect(page).toHaveScreenshot('m011-anti-grid.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
      timeout: 30000,
    })

    expect(errors, `Console errors: ${errors.join('; ')}`).toHaveLength(0)
  })

  test('depth card system (DepthCard via niche landing)', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (
        msg.type() === 'error' &&
        !msg.text().startsWith('Detected Layout Shift during page load')
      ) {
        errors.push(msg.text())
      }
    })

    await page.goto('/en/signals/ai-agents')
    await page.waitForLoadState('networkidle')
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    // DepthCard renders with data-surface="depth-card" on niche landing pages
    const depthCard = page.locator('[data-surface="depth-card"]')
    await expect(depthCard.first()).toBeVisible()

    // Element-level screenshot captures the depth-card with glass + shadow layers
    await expect(depthCard.first()).toHaveScreenshot('m011-depth-card.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    })

    expect(errors, `Console errors: ${errors.join('; ')}`).toHaveLength(0)
  })
})
