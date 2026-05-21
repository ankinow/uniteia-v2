import { type BrowserContext, expect, test } from '@playwright/test'

/**
 * M013 Onboarding Flow — Visual regression for the 3-step narrative component
 *
 * Captures the OnboardingFlow component on the homepage across 3 locales
 * to verify localized microcopy renders correctly in all supported languages.
 *
 * On first run, use --update-snapshots to generate baselines:
 *   npx playwright test tests/e2e/m013-onboarding-visual.spec.ts --update-snapshots
 *
 * On subsequent runs, compares against baselines:
 *   npx playwright test tests/e2e/m013-onboarding-visual.spec.ts
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

test.describe('M013: Onboarding Flow Visual', () => {
  test.beforeEach(async ({ context }) => {
    await freezeClock(context)
  })

  test('onboarding flow — English', async ({ page }) => {
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

    const onboarding = page.locator('[data-testid="onboarding-flow"]')
    await expect(onboarding).toBeVisible()

    await expect(onboarding).toHaveScreenshot('m013-onboarding-en.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    })

    expect(errors, `Console errors: ${errors.join('; ')}`).toHaveLength(0)
  })

  test('onboarding flow — Portuguese', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (
        msg.type() === 'error' &&
        !msg.text().startsWith('Detected Layout Shift during page load')
      ) {
        errors.push(msg.text())
      }
    })

    await page.goto('/pt/')
    await page.waitForLoadState('networkidle')
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    const onboarding = page.locator('[data-testid="onboarding-flow"]')
    await expect(onboarding).toBeVisible()

    await expect(onboarding).toHaveScreenshot('m013-onboarding-pt.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    })

    expect(errors, `Console errors: ${errors.join('; ')}`).toHaveLength(0)
  })

  test('onboarding flow — Japanese', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (
        msg.type() === 'error' &&
        !msg.text().startsWith('Detected Layout Shift during page load')
      ) {
        errors.push(msg.text())
      }
    })

    await page.goto('/ja/')
    await page.waitForLoadState('networkidle')
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    const onboarding = page.locator('[data-testid="onboarding-flow"]')
    await expect(onboarding).toBeVisible()

    await expect(onboarding).toHaveScreenshot('m013-onboarding-ja.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    })

    expect(errors, `Console errors: ${errors.join('; ')}`).toHaveLength(0)
  })
})
