# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> tracked article route renders fixture content and negotiated headers
- Location: tests/e2e/smoke.spec.ts:24:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('[data-testid="article-frame"]')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="article-frame"]')
    8 × locator resolved to <article q:id="q" q:key="GG_1" data-testid="article-frame" data-qwik-inspector="/src/components/article-frame/index.tsx:13:5" class="article-frame mx-auto w-full max-w-prose px-4 py-8 sm:px-6 md:px-8 md:py-10 lg:px-10 lg:py-12 surface-void">…</article>
      - unexpected value "hidden"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Skip to main content" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e4]:
    - banner [ref=e5]:
      - navigation [ref=e6]:
        - link "Uni Teia" [ref=e7] [cursor=pointer]:
          - /url: /en
          - generic [ref=e8]: Uni
          - generic [ref=e9]: Teia
        - generic [ref=e10]:
          - link "Home" [ref=e11] [cursor=pointer]:
            - /url: /en
          - link "About" [ref=e12] [cursor=pointer]:
            - /url: /en/about
          - button "Topics Toggle topics menu" [ref=e14]:
            - text: Topics
            - img "Toggle topics menu" [ref=e15]
          - link "Projects" [ref=e17] [cursor=pointer]:
            - /url: /en/projects
          - link "Blog" [ref=e18] [cursor=pointer]:
            - /url: /en/blog
        - button "Language" [ref=e20]:
          - img [ref=e21]
          - generic [ref=e23]: English
          - img [ref=e24]
  - main [ref=e26]
  - contentinfo [ref=e27]:
    - contentinfo [ref=e28]:
      - generic [ref=e29]:
        - paragraph [ref=e31]: © 2026 UniTeia. All rights reserved.
        - paragraph [ref=e33]: Made with ♥ for decentralized AI
        - navigation [ref=e34]:
          - link "Privacy Policy" [ref=e35] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e36] [cursor=pointer]:
            - /url: /terms
          - link "Source Code" [ref=e37] [cursor=pointer]:
            - /url: https://github.com/uniteia/uniteia-v2
        - generic [ref=e38]: "Language: English"
```

# Test source

```ts
  1   | import { type Page, expect, test } from '@playwright/test'
  2   | 
  3   | const TRACKED_ROUTES = ['/en/test-article', '/en/n', '/en/n/ai-agents'] as const
  4   | 
  5   | function collectConsoleErrors(page: Page): string[] {
  6   |   const errors: string[] = []
  7   |   page.on('console', msg => {
  8   |     if (msg.type() === 'error') errors.push(msg.text())
  9   |   })
  10  |   return errors
  11  | }
  12  | 
  13  | async function gotoAndAssertNegotiation(page: Page, route: string, expectedLang = 'en') {
  14  |   const response = await page.goto(route)
  15  |   expect(response, `Navigation response missing for ${route}`).not.toBeNull()
  16  | 
  17  |   const headers = response?.headers() ?? {}
  18  |   expect(headers['x-negotiated-lang'], `x-negotiated-lang on ${route}`).toBe(expectedLang)
  19  |   expect(headers['x-negotiated-niche'], `x-negotiated-niche on ${route}`).toBe('apex')
  20  | 
  21  |   return response
  22  | }
  23  | 
  24  | test('tracked article route renders fixture content and negotiated headers', async ({ page }) => {
  25  |   const errors = collectConsoleErrors(page)
  26  |   await gotoAndAssertNegotiation(page, '/en/test-article')
  27  | 
> 28  |   await expect(page.locator('[data-testid="article-frame"]')).toBeVisible()
      |                                                               ^ Error: expect(locator).toBeVisible() failed
  29  |   await expect(
  30  |     page.getByRole('heading', { name: 'Test Article for Integration Verification' })
  31  |   ).toBeVisible()
  32  | 
  33  |   await page.waitForLoadState('networkidle')
  34  |   expect(errors, `Console errors on /en/test-article: ${errors.join('; ')}`).toHaveLength(0)
  35  | })
  36  | 
  37  | test('tracked niche landing renders negotiated headers', async ({ page }) => {
  38  |   const errors = collectConsoleErrors(page)
  39  |   await gotoAndAssertNegotiation(page, '/en/n/ai-agents')
  40  | 
  41  |   await expect(page.getByRole('heading', { name: 'AI Agents' })).toBeVisible()
  42  |   await expect(page.locator('[data-testid="niche-landing-ai-agents"]')).toBeVisible()
  43  | 
  44  |   await page.waitForLoadState('networkidle')
  45  |   expect(errors, `Console errors on /en/n/ai-agents: ${errors.join('; ')}`).toHaveLength(0)
  46  | })
  47  | 
  48  | test('tracked niche index renders negotiated headers', async ({ page }) => {
  49  |   const errors = collectConsoleErrors(page)
  50  |   await gotoAndAssertNegotiation(page, '/en/n')
  51  | 
  52  |   await expect(page.locator('[data-testid="niche-index"]')).toBeVisible()
  53  |   await page.waitForLoadState('networkidle')
  54  |   expect(errors, `Console errors on /en/n: ${errors.join('; ')}`).toHaveLength(0)
  55  | })
  56  | 
  57  | test('404 page renders for invalid route', async ({ page }) => {
  58  |   await page.goto('/en/this-route-does-not-exist-at-all')
  59  | 
  60  |   await expect(page.locator('[data-testid="error-code"]')).toBeVisible()
  61  |   await expect(page.locator('[data-testid="error-title"]')).toBeVisible()
  62  | })
  63  | 
  64  | test('language switcher persists cookie and reloads the same pathname', async ({ page }) => {
  65  |   const errors = collectConsoleErrors(page)
  66  |   await gotoAndAssertNegotiation(page, '/en/test-article')
  67  | 
  68  |   const trigger = page.locator('[data-testid="lang-switcher-trigger"]')
  69  |   await expect(trigger).toBeVisible()
  70  |   await trigger.click()
  71  | 
  72  |   const dropdown = page.locator('[data-testid="lang-switcher-dropdown"]')
  73  |   await expect(dropdown).toBeVisible()
  74  | 
  75  |   const ptOption = page.locator('[data-testid="lang-option-pt"]')
  76  |   await expect(ptOption).toBeVisible()
  77  | 
  78  |   const navigationPromise = page.waitForNavigation({ waitUntil: 'load' })
  79  |   await ptOption.click()
  80  |   const reloadResponse = await navigationPromise
  81  | 
  82  |   await expect(page).toHaveURL(/\/en\/test-article(?:\?.*)?$/)
  83  |   const cookies = await page.context().cookies()
  84  |   expect(cookies.find(cookie => cookie.name === 'uniteia_lang')?.value).toBe('pt')
  85  | 
  86  |   const headers = reloadResponse?.headers() ?? {}
  87  |   expect(headers['x-negotiated-lang'], 'x-negotiated-lang after language switch').toBe('pt')
  88  |   expect(headers['x-negotiated-niche'], 'x-negotiated-niche after language switch').toBe('apex')
  89  | 
  90  |   await page.waitForLoadState('networkidle')
  91  |   expect(errors, `Console errors on language switch: ${errors.join('; ')}`).toHaveLength(0)
  92  | })
  93  | 
  94  | for (const route of TRACKED_ROUTES) {
  95  |   test(`no console errors on ${route}`, async ({ page }) => {
  96  |     const errors = collectConsoleErrors(page)
  97  |     await gotoAndAssertNegotiation(page, route)
  98  |     await page.waitForLoadState('networkidle')
  99  |     expect(errors, `Console errors on ${route}: ${errors.join('; ')}`).toHaveLength(0)
  100 |   })
  101 | }
  102 | 
```