# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> no console errors on /en/n
- Location: tests/e2e/smoke.spec.ts:99:3

# Error details

```
Error: Console errors on /en/n: Detected Layout Shift during page load 0.00834434085422092

expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  ["Detected Layout Shift during page load 0.00834434085422092"]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - link "Skip to main content" [ref=e3] [cursor=pointer]:
      - /url: "#main-content"
    - banner [ref=e4]:
      - navigation [ref=e6]:
        - link "Uni Teia CLS 0.008" [ref=e7] [cursor=pointer]:
          - /url: /en
          - generic [ref=e8]: Uni
          - generic [ref=e9]: Teia
          - text: CLS 0.008
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
          - text: CLS 0.008
        - button "Language" [ref=e20] [cursor=pointer]:
          - img [ref=e21]
          - generic [ref=e23]: English
          - img [ref=e24]
    - main [ref=e26]:
      - generic [ref=e27]:
        - heading "All Topics" [level=1] [ref=e29]
        - generic [ref=e30]:
          - link "AI Agents Autonomous AI systems that perceive, reason, and act to accomplish goals." [ref=e31] [cursor=pointer]:
            - /url: /en/n/ai-agents
            - generic [ref=e34]:
              - heading "AI Agents" [level=2] [ref=e35]
              - paragraph [ref=e36]: Autonomous AI systems that perceive, reason, and act to accomplish goals.
          - link "Language Models Large-scale models that understand and generate human language." [ref=e37] [cursor=pointer]:
            - /url: /en/n/language-models
            - generic [ref=e40]:
              - heading "Language Models" [level=2] [ref=e41]
              - paragraph [ref=e42]: Large-scale models that understand and generate human language.
          - link "Prompt Engineering Techniques for crafting effective inputs to steer AI model outputs." [ref=e43] [cursor=pointer]:
            - /url: /en/n/prompt-engineering
            - generic [ref=e46]:
              - heading "Prompt Engineering" [level=2] [ref=e47]
              - paragraph [ref=e48]: Techniques for crafting effective inputs to steer AI model outputs.
    - contentinfo [ref=e49]:
      - generic [ref=e53]:
        - paragraph [ref=e55]: © 2026 UniTeia. All rights reserved.
        - paragraph [ref=e57]: Made with ♥ for decentralized AI
        - navigation [ref=e58]:
          - link "Privacy Policy" [ref=e59] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e60] [cursor=pointer]:
            - /url: /terms
          - link "Source Code" [ref=e61] [cursor=pointer]:
            - /url: https://github.com/uniteia/uniteia-v2
        - generic [ref=e62]:
          - generic [ref=e63]: Language
          - generic [ref=e64]: English
  - generic [ref=e65]: "Click-to-Source: Alt"
```

# Test source

```ts
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
  41  |   expect(errors, `Console errors on /en/test-article: ${errors.join('; ')}`).toHaveLength(0)
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
  89  |   await page.waitForURL(/\/pt\/test-article\/?(?:\?.*)?$/, { timeout: 15000, waitUntil: 'domcontentloaded' })
  90  |   await expect(page).toHaveURL(/\/pt\/test-article\/?(?:\?.*)?$/)
  91  |   const cookies = await page.context().cookies()
  92  |   expect(cookies.find(cookie => cookie.name === 'uniteia_lang')?.value).toBe('pt')
  93  | 
  94  |   await page.waitForLoadState('networkidle')
  95  |   expect(errors, `Console errors on language switch: ${errors.join('; ')}`).toHaveLength(0)
  96  | })
  97  | 
  98  | for (const route of TRACKED_ROUTES) {
  99  |   test(`no console errors on ${route}`, async ({ page }) => {
  100 |     const errors = collectConsoleErrors(page)
  101 |     await gotoAndAssertNegotiation(page, route)
  102 |     await page.waitForLoadState('networkidle')
> 103 |     expect(errors, `Console errors on ${route}: ${errors.join('; ')}`).toHaveLength(0)
      |                                                                        ^ Error: Console errors on /en/n: Detected Layout Shift during page load 0.00834434085422092
  104 |   })
  105 | }
  106 | 
```