import { type Page, expect, test } from '@playwright/test'

/** All 5 supported languages */
const LANGS = ['en', 'pt', 'es', 'ja', 'zh'] as const

/**
 * Helper: collect console errors during a page load.
 * Returns an array of error strings. Callers must read
 * the array *after* the page has loaded and settled.
 */
function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  return errors
}

/* ───────────────────────────────────────────────
 * 1. Home page loads in each language
 * ─────────────────────────────────────────────── */
for (const lang of LANGS) {
  test(`home page loads for /${lang}`, async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await page.goto(`/${lang}`)

    // Verify the page rendered with the UniTeia brand
    await expect(page.locator('[data-testid="nav-logo"]')).toBeVisible()

    // No JS console errors on this route
    await page.waitForLoadState('networkidle')
    expect(errors.length, `Console errors on /${lang}: ${errors.join('; ')}`).toBe(0)
  })
}

/* ───────────────────────────────────────────────
 * 2. Article page renders
 * ─────────────────────────────────────────────── */
test('article page renders at /en/article/test-article', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/en/article/test-article')

  // The article-frame or editorial-verdict should be present
  await expect(
    page.locator('[data-testid="article-frame"], [data-testid="editorial-verdict"]').first()
  ).toBeVisible({ timeout: 10_000 })
  await page.waitForLoadState('networkidle')
  expect(errors.length, `Console errors on article: ${errors.join('; ')}`).toBe(0)
})

/* ───────────────────────────────────────────────
 * 3. Niche landing renders
 * ─────────────────────────────────────────────── */
test('niche landing renders at /en/n/ai-agents', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/en/n/ai-agents')

  // The niche-landing component should render (it contains niche title)
  await expect(page.locator('h1, h2').first()).toBeVisible()
  await page.waitForLoadState('networkidle')
  expect(errors.length, `Console errors on niche landing: ${errors.join('; ')}`).toBe(0)
})

/* ───────────────────────────────────────────────
 * 4. Niche index renders
 * ─────────────────────────────────────────────── */
test('niche index renders at /en/n/', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/en/n/')

  // The niche-index container should be visible
  await expect(page.locator('[data-testid="niche-index"]')).toBeVisible()
  await page.waitForLoadState('networkidle')
  expect(errors.length, `Console errors on niche index: ${errors.join('; ')}`).toBe(0)
})

/* ───────────────────────────────────────────────
 * 5. 404 page for invalid routes
 * ─────────────────────────────────────────────── */
test('404 page renders for invalid route', async ({ page }) => {
  await page.goto('/en/this-route-does-not-exist-at-all')

  // The 404 error code should be visible
  await expect(page.locator('[data-testid="error-code"]')).toBeVisible()

  // The 404 title text should be present
  await expect(page.locator('[data-testid="error-title"]')).toBeVisible()
})

/* ───────────────────────────────────────────────
 * 6. Language switcher changes language
 *
 * The LangSwitcher sets a cookie and redirects.
 * We verify the dropdown opens and a language option is selectable.
 * ─────────────────────────────────────────────── */
test('language switcher changes language', async ({ page }) => {
  await page.goto('/en')

  // Open the language switcher dropdown
  const trigger = page.locator('[data-testid="lang-switcher-trigger"]')
  await expect(trigger).toBeVisible()
  await trigger.click()

  // The dropdown should appear
  const dropdown = page.locator('[data-testid="lang-switcher-dropdown"]')
  await expect(dropdown).toBeVisible()

  // Click the Portuguese option
  const ptOption = page.locator('[data-testid="lang-option-pt"]')
  await expect(ptOption).toBeVisible()
  await ptOption.click()

  // Wait for the redirect — the page should now be on /pt
  await page.waitForURL(/\/pt/, { timeout: 10_000 })
  await expect(page).toHaveURL(/\/pt/)
})

/* ───────────────────────────────────────────────
 * 7. No console errors on core routes
 *
 * Consolidated check across key routes. Individual
 * tests above already check per-route; this is a
 * broader smoke check.
 * ─────────────────────────────────────────────── */
const CORE_ROUTES = ['/en', '/pt', '/es', '/ja', '/zh', '/en/n/ai-agents', '/en/n/']

for (const route of CORE_ROUTES) {
  test(`no console errors on ${route}`, async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await page.goto(route)
    await page.waitForLoadState('networkidle')
    expect(errors.length, `Console errors on ${route}: ${errors.join('; ')}`).toBe(0)
  })
}
