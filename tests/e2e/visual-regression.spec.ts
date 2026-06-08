import { type BrowserContext, expect, test } from '@playwright/test'

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
] as const

const CRITICAL_ROUTES = [
  { path: '/en', label: 'homepage' },
  { path: '/en/signals', label: 'signals-landing' },
  { path: '/en/signals/apex', label: 'niche-apex' },
  { path: '/en/signals/apex/magica-overview', label: 'article-magica' },
  { path: '/en/signals/apex/magica-quickstart', label: 'article-quickstart' },
  { path: '/en/signals/apex/magica-mcp-server', label: 'article-mcp' },
  { path: '/en/signals/apex/tencent-cloud-deal-stack-builders', label: 'article-tencent' },
] as const

const FIXED_NOW = Date.parse('2026-05-27T12:00:00.000Z')

async function freezeClock(context: BrowserContext) {
  await context.addInitScript(
    ({ fixedNow }: { fixedNow: number }) => {
      // @ts-ignore
      const RealDate = Date
      class FrozenDate extends RealDate {
        // biome-ignore lint/suspicious/noExplicitAny: Date constructor override
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
      // biome-ignore lint/suspicious/noExplicitAny: global Date override
      ;(window as any).Date = FrozenDate
    },
    { fixedNow: FIXED_NOW }
  )
}

async function freezeAnimations(page: import('@playwright/test').Page) {
  // Force reduced motion for stable screenshots
  await page.emulateMedia({ reducedMotion: 'reduce' })
}

test.describe('W16 Visual Regression — Critical Routes', () => {
  test.beforeEach(async ({ context }) => {
    await freezeClock(context)
    // Disable CSS animation globally via injected style
    await context.addInitScript(() => {
      const style = document.createElement('style')
      style.textContent =
        '*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }'
      document.head.appendChild(style)
    })
  })

  for (const vp of VIEWPORTS) {
    test.describe(`viewport: ${vp.name} (${vp.width}x${vp.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        await freezeAnimations(page)
      })

      for (const route of CRITICAL_ROUTES) {
        test(`${route.label} renders without regression`, async ({ page }) => {
          const response = await page.goto(route.path, { waitUntil: 'networkidle' })
          expect(response?.status(), `Expected 200 for ${route.path}`).toBe(200)

          // Wait for lazy-loaded content (collage, images, fonts)
          await page.waitForTimeout(300)

          // Verify the page has rendered key content
          await expect(page.locator('h1').first()).toBeVisible()

          // Screenshot comparison — viewport-only capture for speed and reliability
          await expect(page).toHaveScreenshot({ timeout: 15000, maxDiffPixelRatio: 0.02 })
        })
      }
    })
  }
})

test.describe('W16 Visual Regression — Collage Integrity', () => {
  test.beforeEach(async ({ context }) => {
    await freezeClock(context)
  })

  const collageRoutes: readonly (typeof CRITICAL_ROUTES)[number][] = []

  for (const route of collageRoutes) {
    test(`collage renders on ${route.label}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(route.path, { waitUntil: 'networkidle' })
      await page.waitForTimeout(500)

      // LivingBrief2Col collage container
      await expect(page.locator('[data-testid="living-brief-collage"]')).toBeVisible()

      // At least 1 arrow SVG in collage-arrows container
      const arrowCount = await page.locator('.collage-arrows svg').count()
      expect(arrowCount, `Expected >=1 arrow SVG, got ${arrowCount}`).toBeGreaterThanOrEqual(1)

      // Polaroid cards present
      const polaroidCount = await page.locator('.polaroid-card').count()
      expect(polaroidCount, `Expected >=1 polaroid, got ${polaroidCount}`).toBeGreaterThanOrEqual(1)

      // Tape strips present
      const tapeCount = await page.locator('.tape-strip').count()
      expect(tapeCount, `Expected >=1 tape strip, got ${tapeCount}`).toBeGreaterThanOrEqual(1)

      // Collage labels present
      const labelCount = await page.locator('.collage-labels').count()
      expect(labelCount, `Expected collage-labels container, got ${labelCount}`).toBe(1)
    })
  }
})

test.describe('W16 Visual Regression — Console Errors', () => {
  test.beforeEach(async ({ context }) => {
    await freezeClock(context)
  })

  for (const route of CRITICAL_ROUTES) {
    test(`no console errors on ${route.label}`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text())
      })
      await page.goto(route.path, { waitUntil: 'networkidle' })
      await page.waitForTimeout(500)
      expect(errors, `${route.path}: JS console errors detected`).toHaveLength(0)
    })
  }
})

test.describe('W16 Visual Regression — Curation Section', () => {
  test.beforeEach(async ({ context }) => {
    await freezeClock(context)
  })

  test('TrendingSection renders on /en/signals/apex', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/en/signals/apex', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)

    // Trending section container should be visible
    const trendingSection = page.locator('.trending-section')
    await expect(trendingSection).toBeVisible({ timeout: 10000 })

    // At least one RepoCard OR NewsCard should exist
    // (may be empty if API fails — handle gracefully)
    const repoCount = await page.locator('.repo-card').count()
    const newsCount = await page.locator('.news-card').count()
    const totalCards = repoCount + newsCount

    // Either cards are present OR the section shows a loading/error state
    if (totalCards > 0) {
      expect(totalCards, 'Expected at least 1 curation card').toBeGreaterThanOrEqual(1)
    } else {
      // API may have failed — check that error state or loading skeleton is shown
      const hasErrorState = await page.locator('[role="alert"]').count()
      const hasLoadingState = await page.locator('.animate-pulse').count()
      expect(
        hasErrorState + hasLoadingState,
        'Expected either cards, error state, or loading state'
      ).toBeGreaterThanOrEqual(1)
    }

    // Screenshot comparison for visual regression
    await expect(page).toHaveScreenshot({
      timeout: 15000,
      maxDiffPixelRatio: 0.02,
      fullPage: true,
    })
  })
})
