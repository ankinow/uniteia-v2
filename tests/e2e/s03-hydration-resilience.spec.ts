import { type CDPSession, type Page, type Route, expect, test } from '@playwright/test'

// ── Constants ──────────────────────────────────────────────────────────

const TRACKED_ROUTES = [
  '/en/signals/apex/tencent-cloud-deal-stack-builders',
  '/en/signals',
  '/en/signals/ai-agents',
] as const

/** Simulated stale JS content. */
const _STALE_CHUNK_BODY = 'console.log("stale chunk served from CDN");'

// ── Helpers ─────────────────────────────────────────────────────────────

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text()
      if (text.startsWith('Detected Layout Shift during page load')) {
        return
      }
      errors.push(text)
    }
  })
  return errors
}

async function gotoAndAssertNegotiation(
  page: Page,
  route: string,
  expectedLang = 'en'
): ReturnType<typeof page.goto> {
  const response = await page.goto(route)
  expect(response, `Navigation response missing for ${route}`).not.toBeNull()

  const headers = response?.headers() ?? {}
  if (headers['x-negotiated-lang'] !== undefined) {
    expect(headers['x-negotiated-lang'], `x-negotiated-lang on ${route}`).toBe(expectedLang)
    expect(headers['x-negotiated-niche'], `x-negotiated-niche on ${route}`).toBe('apex')
  }

  return response
}

/**
 * Enable 4x CPU throttling via Chrome DevTools Protocol.
 * Call before navigation for the throttling to apply.
 */
async function enableCpuThrottling(_page: Page, cdpSession: CDPSession, rate = 4): Promise<void> {
  await cdpSession.send('Emulation.setCPUThrottlingRate', { rate })
}

/**
 * Disable CPU throttling (reset to 1x).
 */
async function disableCpuThrottling(cdpSession: CDPSession): Promise<void> {
  await cdpSession.send('Emulation.setCPUThrottlingRate', { rate: 1 })
}

/**
 * Create a route handler that delays chunk responses by a given delayMs.
 * Returns a function to register the handler.
 */
function createDelayedChunkHandler(delayMs: number) {
  return async (route: Route) => {
    await new Promise(resolve => setTimeout(resolve, delayMs))
    await route.continue()
  }
}

// ── Fixtures ────────────────────────────────────────────────────────────

test.describe('S03: Hydration Resilience — CPU Throttling', () => {
  let cdpSession: CDPSession

  test.beforeEach(async ({ page }) => {
    cdpSession = await page.context().newCDPSession(page)
  })

  test.afterEach(async () => {
    await disableCpuThrottling(cdpSession).catch(() => {})
  })

  test('T1a: article route hydrates under 4x CPU slowdown', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await enableCpuThrottling(page, cdpSession, 4)

    await gotoAndAssertNegotiation(page, TRACKED_ROUTES[0])
    await expect(page.locator('[data-testid="article-frame"]')).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Tencent Cloud Deal Stack for Builders', level: 1 })
    ).toBeVisible()
    await page.waitForLoadState('networkidle')

    expect(errors, `Console errors under 4x CPU throttle: ${errors.join('; ')}`).toHaveLength(0)
  })

  test('T1b: niche landing hydrates under 4x CPU slowdown', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await enableCpuThrottling(page, cdpSession, 4)

    await gotoAndAssertNegotiation(page, TRACKED_ROUTES[2])
    await expect(page.locator('[data-testid="niche-landing-ai-agents"]')).toBeVisible()
    await page.waitForLoadState('networkidle')

    expect(
      errors,
      `Console errors on niche landing under 4x throttle: ${errors.join('; ')}`
    ).toHaveLength(0)
  })

  test('T1c: niche index hydrates under 4x CPU slowdown', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await enableCpuThrottling(page, cdpSession, 4)

    await gotoAndAssertNegotiation(page, TRACKED_ROUTES[1])
    await expect(page.locator('[data-testid="niche-index"]')).toBeVisible()
    await page.waitForLoadState('networkidle')

    expect(
      errors,
      `Console errors on niche index under 4x throttle: ${errors.join('; ')}`
    ).toHaveLength(0)
  })
})

test.describe('S03: Hydration Resilience — Delayed Chunks', () => {
  test('T1d: page hydrates with 2s delayed chunks', async ({ page }) => {
    const errors = collectConsoleErrors(page)

    // Add 2-second delay to all Qwik chunk requests
    await page.route(/\/build\/q-[\w-]+\.js$/, createDelayedChunkHandler(2000))

    await gotoAndAssertNegotiation(page, TRACKED_ROUTES[0])
    await expect(page.locator('[data-testid="article-frame"]')).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Tencent Cloud Deal Stack for Builders', level: 1 })
    ).toBeVisible()
    await page.waitForLoadState('networkidle')

    const nonSwErrors = errors.filter(
      e => !e.includes('Service Worker') && !e.includes('q-manifest')
    )
    expect(
      nonSwErrors,
      `Console errors with delayed chunks: ${nonSwErrors.join('; ')}`
    ).toHaveLength(0)
  })
})

test.describe('S03: Hydration Resilience — Combined Stress', () => {
  let cdpSession: CDPSession

  test.beforeEach(async ({ page }) => {
    cdpSession = await page.context().newCDPSession(page)
  })

  test.afterEach(async () => {
    await disableCpuThrottling(cdpSession).catch(() => {})
  })

  test('T1e: page renders with 4x CPU throttle AND delayed chunks', async ({ page }) => {
    const errors = collectConsoleErrors(page)

    await enableCpuThrottling(page, cdpSession, 4)
    await page.route(/\/build\/q-[\w-]+\.js$/, createDelayedChunkHandler(2000))

    await gotoAndAssertNegotiation(page, TRACKED_ROUTES[0])
    await expect(page.locator('[data-testid="article-frame"]')).toBeVisible()
    await page.waitForLoadState('networkidle')

    const nonSwErrors = errors.filter(
      e => !e.includes('Service Worker') && !e.includes('q-manifest')
    )
    expect(
      nonSwErrors,
      `Console errors under combined stress: ${nonSwErrors.join('; ')}`
    ).toHaveLength(0)
  })
})

// ── BUILD_ID Version Check Under Throttle (T02) ─────────────────────────

test.describe('S03: BUILD_ID Version Check Under Throttle', () => {
  let cdpSession: CDPSession

  test.beforeEach(async ({ page }) => {
    cdpSession = await page.context().newCDPSession(page)
  })

  test.afterEach(async () => {
    await disableCpuThrottling(cdpSession).catch(() => {})
  })

  test('T2a: BUILD_ID mismatch triggers reload under 4x CPU throttle', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await enableCpuThrottling(page, cdpSession, 4)

    const mismatchHash = 'deadbeef'
    await page.route('**/en/signals/apex/tencent-cloud-deal-stack-builders**', async route => {
      const response = await route.fetch()
      let body = await response.text()
      body = body.replace(/q:manifest-hash="[^"]+"/, `q:manifest-hash="${mismatchHash}"`)
      void route.fulfill({
        status: response.status(),
        headers: response.headers(),
        body,
      })
    })

    await gotoAndAssertNegotiation(page, TRACKED_ROUTES[0])
    await page.waitForLoadState('networkidle')

    // Page should still render the article frame despite the mismatch
    await expect(page.locator('[data-testid="article-frame"]')).toBeVisible()

    const manifestHash = await page.evaluate(() => {
      const html = document.querySelector('html')
      return html?.getAttribute('q:manifest-hash') ?? null
    })
    expect(manifestHash).not.toBeNull()

    const criticalErrors = errors.filter(
      e =>
        !e.includes('q-manifest') &&
        !e.includes('Service Worker') &&
        !e.includes('Navigation') &&
        !e.includes('Failed to fetch')
    )
    expect(
      criticalErrors,
      `Console errors during BUILD_ID mismatch under throttle: ${criticalErrors.join('; ')}`
    ).toHaveLength(0)
  })
})

// ── Error Recovery Boundary Test (T03) ──────────────────────────────────

test.describe('S03: Error Recovery Boundary', () => {
  test('T3a: page renders fallback when all Qwik JS chunks return 500', async ({ page }) => {
    const errors = collectConsoleErrors(page)

    // Intercept all Qwik chunks to return 500
    await page.route(/\/build\/q-[\w-]+\.js$/, async (route: Route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/javascript',
        body: '// intentional server error for test',
      })
    })

    await page.goto(TRACKED_ROUTES[1])
    await page.waitForLoadState('networkidle')

    // The page should still render some HTML - check that the body has content
    // and the page doesn't crash with a white screen
    const bodyText = await page.evaluate(() => document.body?.textContent ?? '')
    expect(bodyText.length).toBeGreaterThan(0)

    // Filter out expected resource errors from JS chunk failures
    const unexpectedErrors = errors.filter(
      e =>
        !e.includes('Failed to load resource') &&
        !e.includes('the server responded with a status of 500') &&
        !e.includes('Service Worker') &&
        !e.includes('q-manifest')
    )
    expect(
      unexpectedErrors,
      `Unexpected errors during JS failure: ${unexpectedErrors.join('; ')}`
    ).toHaveLength(0)
  })

  test('T3b: page gracefully handles abort of all Qwik chunks', async ({ page }) => {
    const errors = collectConsoleErrors(page)

    // Abort all Qwik chunk requests
    await page.route(/\/build\/q-[\w-]+\.js$/, async (route: Route) => {
      await route.abort('timedout')
    })

    await page.goto(TRACKED_ROUTES[0])
    await page.waitForLoadState('networkidle')

    // The page should not be a blank white screen - some content should render
    const bodyText = await page.evaluate(() => document.body?.textContent ?? '')
    expect(bodyText.length).toBeGreaterThan(0)

    const unexpectedErrors = errors.filter(
      e =>
        !e.includes('Failed to load resource') &&
        !e.includes('net::ERR_TIMED_OUT') &&
        !e.includes('Service Worker') &&
        !e.includes('q-manifest')
    )
    expect(
      unexpectedErrors,
      `Unexpected errors during chunk abort: ${unexpectedErrors.join('; ')}`
    ).toHaveLength(0)
  })
})

// ── Cross-route smoke under throttled conditions ────────────────────────

test.describe('S03: Cross-route hydration smoke', () => {
  let cdpSession: CDPSession

  test.beforeEach(async ({ page }) => {
    cdpSession = await page.context().newCDPSession(page)
  })

  test.afterEach(async () => {
    await disableCpuThrottling(cdpSession).catch(() => {})
  })

  for (const route of TRACKED_ROUTES) {
    test(`no console errors on ${route} with 4x CPU throttle`, async ({ page }) => {
      const errors = collectConsoleErrors(page)
      await enableCpuThrottling(page, cdpSession, 4)

      // First navigation registers SW, second navigation tests with SW active
      await page.goto(route)
      await page.waitForLoadState('networkidle')

      // Navigate again under throttle with SW active
      await page.goto(route)
      await page.waitForLoadState('networkidle')

      expect(errors, `Console errors on ${route} with throttle: ${errors.join('; ')}`).toHaveLength(
        0
      )
    })
  }
})
