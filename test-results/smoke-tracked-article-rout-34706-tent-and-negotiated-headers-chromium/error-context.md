# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> tracked article route renders fixture content and negotiated headers
- Location: tests/e2e/smoke.spec.ts:27:1

# Error details

```
Error: Console errors on /en/test-article: Detected Layout Shift during page load 0.09866823289129469

expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  ["Detected Layout Shift during page load 0.09866823289129469"]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
      - article [ref=e27]:
        - generic [ref=e28]:
          - heading "Test Article for Integration Verification" [level=1] [ref=e29]
          - paragraph [ref=e30]: testing, integration, verification
        - generic [ref=e31]:
          - 'status "Verdict: Trusted" [ref=e32]':
            - generic [ref=e34]:
              - generic [ref=e35]: Verdict
              - generic [ref=e36]: Trusted
          - 'img "Quality Score: 92/100 — Editorial Quality" [ref=e37]':
            - generic [ref=e38]:
              - img [ref=e39]
              - generic [ref=e42]: "92"
        - generic [ref=e43]:
          - generic "Subjects" [ref=e44]:
            - generic [ref=e45]: Subjects
            - generic [ref=e46]: testing
            - generic [ref=e47]: integration
            - generic [ref=e48]: verification
          - generic [ref=e50]:
            - generic [ref=e51]:
              - generic [ref=e52]: Published
              - time [ref=e53]: 2025-01-15T10:00:00Z
            - generic [ref=e54]:
              - generic [ref=e55]: Updated
              - time [ref=e56]: 2025-01-20T14:30:00Z
            - generic [ref=e58]: by UniTeia System
            - generic [ref=e60]: v1
          - generic [ref=e61]:
            - generic [ref=e62]: Read in EN
            - generic [ref=e63]: EN
        - generic [ref=e64]:
          - paragraph [ref=e65]: This is a test article created to verify the content rendering pipeline of UniTeia v2. It serves as a fixture for integration testing of the routeLoader$, schema validation, and component rendering.
          - heading "Purpose" [level=2] [ref=e66]
          - paragraph [ref=e67]: "The primary purpose of this article is to exercise the full content pipeline:"
          - list [ref=e68]:
            - listitem [ref=e69]:
              - strong [ref=e70]: Markdown parsing
              - text: — frontmatter extraction via gray-matter
            - listitem [ref=e71]:
              - strong [ref=e72]: Schema validation
              - text: — AJV Draft 2020-12 compliance check
            - listitem [ref=e73]:
              - strong [ref=e74]: Slug validation
              - text: — URL safety via
              - code [ref=e75]: "`validateSlug()`"
            - listitem [ref=e76]:
              - strong [ref=e77]: Component rendering
              - text: — ArticleFrame, AdaptiveHeader, FrontmatterSlots, and SourceLedger
          - heading "Content Requirements" [level=2] [ref=e78]
          - paragraph [ref=e79]: The schema requires a minimum of 100 characters of content. This paragraph and the surrounding text ensure we comfortably exceed that threshold while providing meaningful test coverage for the rendering pipeline.
          - heading "Technical Details" [level=2] [ref=e80]
          - paragraph [ref=e81]:
            - text: The routeLoader$ reads this file from the
            - code [ref=e82]: "`/llm-wiki/en/`"
            - text: directory, parses the YAML frontmatter, validates the resulting object against the JSON schema, and injects typed content into the Qwik-City route. Any validation failure is logged to the server console with the slug and error details.
          - text: CLS 0.099
        - navigation "Sources" [ref=e83]:
          - heading "Sources" [level=2] [ref=e84]
          - list [ref=e85]:
            - listitem [ref=e86]:
              - link "Example Reference A sample external reference link example.com" [ref=e87] [cursor=pointer]:
                - /url: https://example.com/reference
                - generic [ref=e88]:
                  - generic [ref=e89]: Example Reference
                  - generic [ref=e90]: A sample external reference link
                - generic [ref=e91]: example.com
            - listitem [ref=e92]:
              - link "Example Documentation example.com" [ref=e93] [cursor=pointer]:
                - /url: https://example.com/docs
                - generic [ref=e95]: Example Documentation
                - generic [ref=e96]: example.com
        - text: CLS 0.099
    - contentinfo [ref=e97]:
      - generic [ref=e101]:
        - paragraph [ref=e103]: © 2026 UniTeia. All rights reserved.
        - paragraph [ref=e105]: Made with ♥ for decentralized AI
        - navigation [ref=e106]:
          - link "Privacy Policy" [ref=e107] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e108] [cursor=pointer]:
            - /url: /terms
          - link "Source Code" [ref=e109] [cursor=pointer]:
            - /url: https://github.com/uniteia/uniteia-v2
        - generic [ref=e110]:
          - generic [ref=e111]: Language
          - generic [ref=e112]: English
  - generic [ref=e113]: "Click-to-Source: Alt"
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
  8   |     if (msg.type() === 'error') {
  9   |       const text = msg.text()
  10  |       errors.push(text)
  11  |     }
  12  |   })
  13  |   return errors
  14  | }
  15  | 
  16  | async function gotoAndAssertNegotiation(page: Page, route: string, expectedLang = 'en') {
  17  |   const response = await page.goto(route)
  18  |   expect(response, `Navigation response missing for ${route}`).not.toBeNull()
  19  | 
  20  |   const headers = response?.headers() ?? {}
  21  |   expect(headers['x-negotiated-lang'], `x-negotiated-lang on ${route}`).toBe(expectedLang)
  22  |   expect(headers['x-negotiated-niche'], `x-negotiated-niche on ${route}`).toBe('apex')
  23  | 
  24  |   return response
  25  | }
  26  | 
  27  | test('tracked article route renders fixture content and negotiated headers', async ({ page }) => {
  28  |   const errors = collectConsoleErrors(page)
  29  |   await gotoAndAssertNegotiation(page, '/en/test-article')
  30  | 
  31  |   await expect(page.locator('[data-testid="article-frame"]')).toBeVisible()
  32  |   await expect(
  33  |     page.getByRole('heading', { name: 'Test Article for Integration Verification' })
  34  |   ).toBeVisible()
  35  | 
  36  |   // Verify only one H1 exists (AdaptiveHeader)
  37  |   const h1Count = await page.locator('h1').count()
  38  |   expect(h1Count, 'Should have exactly one H1').toBe(1)
  39  | 
  40  |   await page.waitForLoadState('networkidle')
> 41  |   expect(errors, `Console errors on /en/test-article: ${errors.join('; ')}`).toHaveLength(0)
      |                                                                              ^ Error: Console errors on /en/test-article: Detected Layout Shift during page load 0.09866823289129469
  42  | })
  43  | 
  44  | test('tracked niche landing renders negotiated headers', async ({ page }) => {
  45  |   const errors = collectConsoleErrors(page)
  46  |   await gotoAndAssertNegotiation(page, '/en/n/ai-agents')
  47  | 
  48  |   await expect(page.getByRole('heading', { name: 'AI Agents' })).toBeVisible()
  49  |   await expect(page.locator('[data-testid="niche-landing-ai-agents"]')).toBeVisible()
  50  | 
  51  |   await page.waitForLoadState('networkidle')
  52  |   expect(errors, `Console errors on /en/n/ai-agents: ${errors.join('; ')}`).toHaveLength(0)
  53  | })
  54  | 
  55  | test('tracked niche index renders negotiated headers', async ({ page }) => {
  56  |   const errors = collectConsoleErrors(page)
  57  |   await gotoAndAssertNegotiation(page, '/en/n')
  58  | 
  59  |   await expect(page.locator('[data-testid="niche-index"]')).toBeVisible()
  60  |   await page.waitForLoadState('networkidle')
  61  |   expect(errors, `Console errors on /en/n: ${errors.join('; ')}`).toHaveLength(0)
  62  | })
  63  | 
  64  | test('404 page renders for invalid route', async ({ page }) => {
  65  |   await page.goto('/en/this-route-does-not-exist-at-all')
  66  | 
  67  |   await expect(page.locator('[data-testid="error-code"]')).toBeVisible()
  68  |   await expect(page.locator('[data-testid="error-title"]')).toBeVisible()
  69  | })
  70  | 
  71  | test('language switcher persists cookie and navigates to the selected language pathname', async ({
  72  |   page,
  73  | }) => {
  74  |   const errors = collectConsoleErrors(page)
  75  |   await gotoAndAssertNegotiation(page, '/en/test-article')
  76  | 
  77  |   const trigger = page.locator('[data-testid="lang-switcher-trigger"]')
  78  |   await expect(trigger).toBeVisible()
  79  |   await trigger.click()
  80  | 
  81  |   const dropdown = page.locator('[data-testid="lang-switcher-dropdown"]')
  82  |   await expect(dropdown).toBeVisible()
  83  | 
  84  |   const ptOption = page.locator('[data-testid="lang-option-pt"]')
  85  |   await expect(ptOption).toBeVisible()
  86  | 
  87  |   await ptOption.click()
  88  | 
  89  |   await page.waitForURL(/\/pt\/test-article\/?(?:\?.*)?$/, {
  90  |     timeout: 15000,
  91  |     waitUntil: 'domcontentloaded',
  92  |   })
  93  |   await expect(page).toHaveURL(/\/pt\/test-article\/?(?:\?.*)?$/)
  94  |   const cookies = await page.context().cookies()
  95  |   expect(cookies.find(cookie => cookie.name === 'uniteia_lang')?.value).toBe('pt')
  96  | 
  97  |   await page.waitForLoadState('networkidle')
  98  |   expect(errors, `Console errors on language switch: ${errors.join('; ')}`).toHaveLength(0)
  99  | })
  100 | 
  101 | for (const route of TRACKED_ROUTES) {
  102 |   test(`no console errors on ${route}`, async ({ page }) => {
  103 |     const errors = collectConsoleErrors(page)
  104 |     await gotoAndAssertNegotiation(page, route)
  105 |     await page.waitForLoadState('networkidle')
  106 |     expect(errors, `Console errors on ${route}: ${errors.join('; ')}`).toHaveLength(0)
  107 |   })
  108 | }
  109 | 
```