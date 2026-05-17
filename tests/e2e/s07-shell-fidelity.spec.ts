import { type BrowserContext, expect, test } from '@playwright/test'

const FIXED_NOW = Date.parse('2026-04-24T12:00:00.000Z')
const SNAPSHOT_NAME = 'shell-en-n.png'

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

test.describe('S07 shell fidelity', () => {
  test.beforeEach(async ({ context }) => {
    await freezeClock(context)
  })

  test('keeps the /en/n shell chrome visually stable and stamped with HUD grammar', async ({
    page,
  }) => {
    await page.goto('/en/signals', { waitUntil: 'networkidle' })
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    const shell = page.locator('.site-shell')
    const footer = page.locator('[data-testid="footer"]')
    const footerLabel = page.locator('[data-testid="hud-label"][data-surface="footer"]')
    const footerScratch = page.locator('[data-testid="scratch-divider"][data-surface="footer"]')

    await expect(shell).toBeVisible()
    await expect(page.locator('[data-testid="site-main"]')).toBeVisible()
    await expect(footer).toBeVisible()
    await expect(footerLabel).toHaveCount(1)
    await expect(footerLabel).toHaveText('Language')
    await expect(footerScratch).toBeVisible()

    await expect(shell).toHaveScreenshot(SNAPSHOT_NAME, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    })
  })

  test('stamps article metadata and frontmatter surfaces with the shared grammar', async ({
    page,
  }) => {
    await page.goto('/en/signals/apex/tencent-cloud-deal-stack-builders', {
      waitUntil: 'networkidle',
    })
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    const frontmatter = page.locator('[data-testid="frontmatter-slots"]')
    const frontmatterLabel = page.locator('[data-testid="hud-label"][data-surface="frontmatter"]')
    const frontmatterScratch = page.locator(
      '[data-testid="scratch-divider"][data-surface="frontmatter"]'
    )

    await expect(frontmatter).toBeVisible()
    await expect(frontmatterLabel.first()).toBeVisible()
    await expect(frontmatterScratch).toBeVisible()
  })
})
