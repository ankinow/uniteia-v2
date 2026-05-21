import { type BrowserContext, expect, test } from '@playwright/test'

/**
 * M014 Visual Regression — Visual tests for M014 Cleanup + Evolution surfaces
 *
 * Tests only components that are actually wired into routes:
 * 1. MasterOpenCanvas textures (sticky-note + cardboard) on homepage
 * 2. ArticleFrame on article pages
 * 3. Article cards on niche landing
 *
 * Components created in M014 (SignalGrid, QualityRing, KindlePlayground) are not
 * yet wired into routes — they are tested once wiring happens.
 *
 * On first run, use --update-snapshots to generate baselines:
 *   npx playwright test tests/e2e/m014-visual-regression.spec.ts --update-snapshots
 */

const FIXED_NOW = Date.parse('2026-05-21T12:00:00.000Z')

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

const SCREENSHOT_TIMEOUT = 30000

test.use({
  timezoneId: 'UTC',
  viewport: { width: 1440, height: 1200 },
})

test.describe('M014: Visual Regression', () => {
  test.beforeEach(async ({ context }) => {
    await freezeClock(context)
  })

  test('homepage with MasterOpenCanvas textures', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (
        msg.type() === 'error' &&
        !msg.text().startsWith('Detected Layout Shift during page load')
      ) {
        errors.push(msg.text())
      }
    })

    await page.goto('/en/')
    await page.waitForLoadState('networkidle')
    await page.evaluate(async () => {
      await document.fonts.ready
    })
    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('m014-homepage.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
      timeout: SCREENSHOT_TIMEOUT,
    })

    expect(errors, `Console errors: ${errors.join('; ')}`).toHaveLength(0)
  })

  test('article page with ArticleFrame', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (
        msg.type() === 'error' &&
        !msg.text().startsWith('Detected Layout Shift during page load')
      ) {
        errors.push(msg.text())
      }
    })

    await page.goto('/en/signals/apex/tencent-cloud-deal-stack-builders')
    await page.waitForLoadState('networkidle')
    await page.evaluate(async () => {
      await document.fonts.ready
    })
    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('m014-article-page.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
      timeout: SCREENSHOT_TIMEOUT,
    })

    expect(errors, `Console errors: ${errors.join('; ')}`).toHaveLength(0)
  })

  test('niche landing with article cards', async ({ page }) => {
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
    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('m014-niche-landing.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
      timeout: SCREENSHOT_TIMEOUT,
    })

    expect(errors, `Console errors: ${errors.join('; ')}`).toHaveLength(0)
  })
})
