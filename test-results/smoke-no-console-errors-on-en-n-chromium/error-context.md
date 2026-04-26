# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> no console errors on /en/n
- Location: tests/e2e/smoke.spec.ts:106:3

# Error details

```
Error: Channel closed
```

```
Error: page.waitForLoadState: Test ended.
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
  9   |       const text = msg.text()
  10  |       // Filter out layout shift warnings which are performance logs, not errors
  11  |       if (text.startsWith('Detected Layout Shift during page load')) {
  12  |         return
  13  |       }
  14  |       errors.push(text)
  15  |     }
  16  |   })
  17  |   return errors
  18  | }
  19  | 
  20  | async function gotoAndAssertNegotiation(page: Page, route: string, expectedLang = 'en') {
  21  |   const response = await page.goto(route)
  22  |   expect(response, `Navigation response missing for ${route}`).not.toBeNull()
  23  | 
  24  |   const headers = response?.headers() ?? {}
  25  |   expect(headers['x-negotiated-lang'], `x-negotiated-lang on ${route}`).toBe(expectedLang)
  26  |   expect(headers['x-negotiated-niche'], `x-negotiated-niche on ${route}`).toBe('apex')
  27  | 
  28  |   return response
  29  | }
  30  | 
  31  | test('tracked article route renders fixture content and negotiated headers', async ({ page }) => {
  32  |   const errors = collectConsoleErrors(page)
  33  |   await gotoAndAssertNegotiation(page, '/en/test-article')
  34  | 
  35  |   await expect(page.locator('[data-testid="article-frame"]')).toBeVisible()
  36  |   await expect(
  37  |     page.getByRole('heading', { name: 'Test Article for Integration Verification' })
  38  |   ).toBeVisible()
  39  | 
  40  |   // Verify only one H1 exists (AdaptiveHeader)
  41  |   const h1Count = await page.locator('h1').count()
  42  |   expect(h1Count, 'Should have exactly one H1').toBe(1)
  43  | 
  44  |   await page.waitForLoadState('networkidle')
  45  |   expect(errors, `Console errors on /en/test-article: ${errors.join('; ')}`).toHaveLength(0)
  46  | })
  47  | 
  48  | test('tracked niche landing renders negotiated headers', async ({ page }) => {
  49  |   const errors = collectConsoleErrors(page)
  50  |   await gotoAndAssertNegotiation(page, '/en/n/ai-agents')
  51  | 
  52  |   await expect(page.getByRole('heading', { name: 'AI Agents' })).toBeVisible()
  53  |   await expect(page.locator('[data-testid="niche-landing-ai-agents"]')).toBeVisible()
  54  | 
  55  |   await page.waitForLoadState('networkidle')
  56  |   expect(errors, `Console errors on /en/n/ai-agents: ${errors.join('; ')}`).toHaveLength(0)
  57  | })
  58  | 
  59  | test('tracked niche index renders negotiated headers', async ({ page }) => {
  60  |   const errors = collectConsoleErrors(page)
  61  |   await gotoAndAssertNegotiation(page, '/en/n')
  62  | 
  63  |   await expect(page.locator('[data-testid="niche-index"]')).toBeVisible()
  64  |   await page.waitForLoadState('networkidle')
  65  |   expect(errors, `Console errors on /en/n: ${errors.join('; ')}`).toHaveLength(0)
  66  | })
  67  | 
  68  | test('404 page renders for invalid route', async ({ page }) => {
  69  |   await page.goto('/en/this-route-does-not-exist-at-all')
  70  | 
  71  |   await expect(page.locator('[data-testid="error-code"]')).toBeVisible()
  72  |   await expect(page.locator('[data-testid="error-title"]')).toBeVisible()
  73  | })
  74  | 
  75  | test('language switcher persists cookie and navigates to the selected language pathname', async ({
  76  |   page,
  77  | }) => {
  78  |   const errors = collectConsoleErrors(page)
  79  |   await gotoAndAssertNegotiation(page, '/en/test-article')
  80  | 
  81  |   const trigger = page.locator('[data-testid="lang-switcher-trigger"]')
  82  |   await expect(trigger).toBeVisible()
  83  |   await trigger.click()
  84  | 
  85  |   const dropdown = page.locator('[data-testid="lang-switcher-dropdown"]')
  86  |   await expect(dropdown).toBeVisible()
  87  | 
  88  |   const ptOption = page.locator('[data-testid="lang-option-pt"]')
  89  |   await expect(ptOption).toBeVisible()
  90  | 
  91  |   await ptOption.click()
  92  | 
  93  |   await page.waitForURL(/\/pt\/test-article\/?(?:\?.*)?$/, {
  94  |     timeout: 15000,
  95  |     waitUntil: 'domcontentloaded',
  96  |   })
  97  |   await expect(page).toHaveURL(/\/pt\/test-article\/?(?:\?.*)?$/)
  98  |   const cookies = await page.context().cookies()
  99  |   expect(cookies.find(cookie => cookie.name === 'uniteia_lang')?.value).toBe('pt')
  100 | 
  101 |   await page.waitForLoadState('networkidle')
  102 |   expect(errors, `Console errors on language switch: ${errors.join('; ')}`).toHaveLength(0)
  103 | })
  104 | 
  105 | for (const route of TRACKED_ROUTES) {
  106 |   test(`no console errors on ${route}`, async ({ page }) => {
  107 |     const errors = collectConsoleErrors(page)
  108 |     await gotoAndAssertNegotiation(page, route)
> 109 |     await page.waitForLoadState('networkidle')
      |                ^ Error: page.waitForLoadState: Test ended.
  110 |     expect(errors, `Console errors on ${route}: ${errors.join('; ')}`).toHaveLength(0)
  111 |   })
  112 | }
  113 | 
```