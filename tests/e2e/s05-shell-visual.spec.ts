import { type BrowserContext, expect, test } from '@playwright/test'

const FIXED_NOW = Date.parse('2026-04-24T12:00:00.000Z')
const SNAPSHOT_NAME = 'shell-en-n.png'

async function freezeClock(context: BrowserContext) {
  await context.addInitScript(({ fixedNow }: { fixedNow: number }) => {
    const RealDate = Date

    class FrozenDate extends RealDate {
      constructor(...args: ConstructorParameters<typeof Date>) {
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

    const frozenGlobal = globalThis as typeof globalThis & { Date: DateConstructor }
    frozenGlobal.Date = FrozenDate
  }, { fixedNow: FIXED_NOW })
}

test.use({
  timezoneId: 'UTC',
  viewport: { width: 1440, height: 1200 },
})

test.describe('S05 shell visual baseline', () => {
  test.beforeEach(async ({ context }) => {
    await freezeClock(context)
  })

  test('captures a deterministic /en/n shell baseline', async ({ page }) => {
    await page.goto('/en/n', { waitUntil: 'networkidle' })
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    const shell = page.locator('.site-shell')
    const nicheIndex = page.locator('[data-testid="niche-index"]')
    const firstCard = page.locator('[data-testid^="niche-card-"]').first()
    const footer = page.locator('[data-testid="footer"]')

    await expect(shell).toBeVisible()
    await expect(nicheIndex).toBeVisible()
    await expect(firstCard).toBeVisible()
    await expect(footer).toBeVisible()

    await expect(page).toHaveScreenshot(SNAPSHOT_NAME, {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    })
  })
})
