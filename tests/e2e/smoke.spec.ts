import { type Page, expect, test } from '@playwright/test'

const TRACKED_ROUTES = ['/en/test-article', '/en/n', '/en/n/ai-agents'] as const

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text()
      errors.push(text)
    }
  })
  return errors
}

async function gotoAndAssertNegotiation(page: Page, route: string, expectedLang = 'en') {
  const response = await page.goto(route)
  expect(response, `Navigation response missing for ${route}`).not.toBeNull()

  const headers = response?.headers() ?? {}
  expect(headers['x-negotiated-lang'], `x-negotiated-lang on ${route}`).toBe(expectedLang)
  expect(headers['x-negotiated-niche'], `x-negotiated-niche on ${route}`).toBe('apex')

  return response
}

test('tracked article route renders fixture content and negotiated headers', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await gotoAndAssertNegotiation(page, '/en/test-article')

  await expect(page.locator('[data-testid="article-frame"]')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Test Article for Integration Verification' })
  ).toBeVisible()

  // Verify only one H1 exists (AdaptiveHeader)
  const h1Count = await page.locator('h1').count()
  expect(h1Count, 'Should have exactly one H1').toBe(1)

  await page.waitForLoadState('networkidle')
  expect(errors, `Console errors on /en/test-article: ${errors.join('; ')}`).toHaveLength(0)
})

test('tracked niche landing renders negotiated headers', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await gotoAndAssertNegotiation(page, '/en/n/ai-agents')

  await expect(page.getByRole('heading', { name: 'AI Agents' })).toBeVisible()
  await expect(page.locator('[data-testid="niche-landing-ai-agents"]')).toBeVisible()

  await page.waitForLoadState('networkidle')
  expect(errors, `Console errors on /en/n/ai-agents: ${errors.join('; ')}`).toHaveLength(0)
})

test('tracked niche index renders negotiated headers', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await gotoAndAssertNegotiation(page, '/en/n')

  await expect(page.locator('[data-testid="niche-index"]')).toBeVisible()
  await page.waitForLoadState('networkidle')
  expect(errors, `Console errors on /en/n: ${errors.join('; ')}`).toHaveLength(0)
})

test('404 page renders for invalid route', async ({ page }) => {
  await page.goto('/en/this-route-does-not-exist-at-all')

  await expect(page.locator('[data-testid="error-code"]')).toBeVisible()
  await expect(page.locator('[data-testid="error-title"]')).toBeVisible()
})

test('language switcher persists cookie and navigates to the selected language pathname', async ({
  page,
}) => {
  const errors = collectConsoleErrors(page)
  await gotoAndAssertNegotiation(page, '/en/test-article')

  const trigger = page.locator('[data-testid="lang-switcher-trigger"]')
  await expect(trigger).toBeVisible()
  await trigger.click()

  const dropdown = page.locator('[data-testid="lang-switcher-dropdown"]')
  await expect(dropdown).toBeVisible()

  const ptOption = page.locator('[data-testid="lang-option-pt"]')
  await expect(ptOption).toBeVisible()

  await ptOption.click()

  await page.waitForURL(/\/pt\/test-article\/?(?:\?.*)?$/, {
    timeout: 15000,
    waitUntil: 'domcontentloaded',
  })
  await expect(page).toHaveURL(/\/pt\/test-article\/?(?:\?.*)?$/)
  const cookies = await page.context().cookies()
  expect(cookies.find(cookie => cookie.name === 'uniteia_lang')?.value).toBe('pt')

  await page.waitForLoadState('networkidle')
  expect(errors, `Console errors on language switch: ${errors.join('; ')}`).toHaveLength(0)
})

for (const route of TRACKED_ROUTES) {
  test(`no console errors on ${route}`, async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await gotoAndAssertNegotiation(page, route)
    await page.waitForLoadState('networkidle')
    expect(errors, `Console errors on ${route}: ${errors.join('; ')}`).toHaveLength(0)
  })
}
