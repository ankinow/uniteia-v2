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

Locator: locator('[data-testid="article-frame"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="article-frame"]')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Skip to main content" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e4]:
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
        - button "Topics Toggle topics menu" [ref=e14] [cursor=pointer]:
          - text: Topics
          - img "Toggle topics menu" [ref=e15]
        - link "Projects" [ref=e17] [cursor=pointer]:
          - /url: /en/projects
        - link "Blog" [ref=e18] [cursor=pointer]:
          - /url: /en/blog
      - button "Language" [ref=e20] [cursor=pointer]:
        - img [ref=e21]
        - generic [ref=e23]: English
        - img [ref=e24]
  - main [ref=e26]:
    - generic [ref=e27]:
      - link "Skip to main content" [ref=e28] [cursor=pointer]:
        - /url: "#main-content"
      - navigation [ref=e31]:
        - link "Uni Teia" [ref=e32] [cursor=pointer]:
          - /url: /
          - generic [ref=e33]: Uni
          - generic [ref=e34]: Teia
        - generic [ref=e35]:
          - link "Home" [ref=e36] [cursor=pointer]:
            - /url: /
          - link "About" [ref=e37] [cursor=pointer]:
            - /url: /about
          - link "Projects" [ref=e38] [cursor=pointer]:
            - /url: /projects
          - link "Blog" [ref=e39] [cursor=pointer]:
            - /url: /blog
        - button "Language" [ref=e41] [cursor=pointer]:
          - img [ref=e42]
          - generic [ref=e44]: English
          - img [ref=e45]
      - main [ref=e47]:
        - main [ref=e48]:
          - generic [ref=e49]:
            - generic [ref=e50]: "404"
            - heading "Page Not Found" [level=1] [ref=e51]
            - paragraph [ref=e52]: The page you're looking for doesn't exist or has been moved.
            - link "Back to Home" [ref=e53] [cursor=pointer]:
              - /url: /
              - img [ref=e54]
              - text: Back to Home
      - generic [ref=e64]:
        - paragraph [ref=e66]: © 2026 UniTeia. All rights reserved.
        - paragraph [ref=e68]: Made with ♥ for decentralized AI
        - navigation [ref=e69]:
          - link "Privacy Policy" [ref=e70] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e71] [cursor=pointer]:
            - /url: /terms
          - link "Source Code" [ref=e72] [cursor=pointer]:
            - /url: https://github.com/uniteia/uniteia-v2
        - generic [ref=e73]:
          - generic [ref=e74]: Language
          - generic [ref=e75]: English
  - contentinfo [ref=e76]:
    - generic [ref=e80]:
      - paragraph [ref=e82]: © 2026 UniTeia. All rights reserved.
      - paragraph [ref=e84]: Made with ♥ for decentralized AI
      - navigation [ref=e85]:
        - link "Privacy Policy" [ref=e86] [cursor=pointer]:
          - /url: /privacy
        - link "Terms of Service" [ref=e87] [cursor=pointer]:
          - /url: /terms
        - link "Source Code" [ref=e88] [cursor=pointer]:
          - /url: https://github.com/uniteia/uniteia-v2
      - generic [ref=e89]:
        - generic [ref=e90]: Language
        - generic [ref=e91]: English
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
  64  | test('language switcher persists cookie and navigates to the selected language pathname', async ({
  65  |   page,
  66  | }) => {
  67  |   const errors = collectConsoleErrors(page)
  68  |   await gotoAndAssertNegotiation(page, '/en/test-article')
  69  | 
  70  |   const trigger = page.locator('[data-testid="lang-switcher-trigger"]')
  71  |   await expect(trigger).toBeVisible()
  72  |   await trigger.click()
  73  | 
  74  |   const dropdown = page.locator('[data-testid="lang-switcher-dropdown"]')
  75  |   await expect(dropdown).toBeVisible()
  76  | 
  77  |   const ptOption = page.locator('[data-testid="lang-option-pt"]')
  78  |   await expect(ptOption).toBeVisible()
  79  | 
  80  |   const navigationPromise = page.waitForNavigation({ waitUntil: 'load' })
  81  |   await ptOption.click()
  82  |   const navigationResponse = await navigationPromise
  83  | 
  84  |   await expect(page).toHaveURL(/\/pt\/test-article\/?(?:\?.*)?$/)
  85  |   const cookies = await page.context().cookies()
  86  |   expect(cookies.find(cookie => cookie.name === 'uniteia_lang')?.value).toBe('pt')
  87  | 
  88  |   const headers = navigationResponse?.headers() ?? {}
  89  |   expect(headers['x-negotiated-lang'], 'x-negotiated-lang after language switch').toBe('pt')
  90  |   expect(headers['x-negotiated-niche'], 'x-negotiated-niche after language switch').toBe('apex')
  91  | 
  92  |   await page.waitForLoadState('networkidle')
  93  |   expect(errors, `Console errors on language switch: ${errors.join('; ')}`).toHaveLength(0)
  94  | })
  95  | 
  96  | for (const route of TRACKED_ROUTES) {
  97  |   test(`no console errors on ${route}`, async ({ page }) => {
  98  |     const errors = collectConsoleErrors(page)
  99  |     await gotoAndAssertNegotiation(page, route)
  100 |     await page.waitForLoadState('networkidle')
  101 |     expect(errors, `Console errors on ${route}: ${errors.join('; ')}`).toHaveLength(0)
  102 |   })
  103 | }
  104 | 
```