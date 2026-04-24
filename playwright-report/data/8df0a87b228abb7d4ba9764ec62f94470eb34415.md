# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s05-shell-visual.spec.ts >> S05 shell visual baseline >> captures a deterministic /en/n shell baseline
- Location: tests/e2e/s05-shell-visual.spec.ts:48:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('[data-testid="niche-index"]')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="niche-index"]')
    9 × locator resolved to <div q:key="q8_1" data-testid="niche-index" class="max-w-4xl mx-auto px-4 py-8" data-qwik-inspector="/home/lermf/uniteia-v2/src/routes/[lang]/n/index.tsx:37:5">…</div>
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
  1  | import { type BrowserContext, expect, test } from '@playwright/test'
  2  | 
  3  | const FIXED_NOW = Date.parse('2026-04-24T12:00:00.000Z')
  4  | const SNAPSHOT_NAME = 'shell-en-n.png'
  5  | 
  6  | async function freezeClock(context: BrowserContext) {
  7  |   await context.addInitScript(({ fixedNow }: { fixedNow: number }) => {
  8  |     const RealDate = Date
  9  | 
  10 |     class FrozenDate extends RealDate {
  11 |       constructor(...args: ConstructorParameters<typeof Date>) {
  12 |         if (args.length === 0) {
  13 |           super(fixedNow)
  14 |           return
  15 |         }
  16 | 
  17 |         super(...args)
  18 |       }
  19 | 
  20 |       static now() {
  21 |         return fixedNow
  22 |       }
  23 | 
  24 |       static parse(value: string) {
  25 |         return RealDate.parse(value)
  26 |       }
  27 | 
  28 |       static UTC(...args: Parameters<typeof Date.UTC>) {
  29 |         return RealDate.UTC(...args)
  30 |       }
  31 |     }
  32 | 
  33 |     const frozenGlobal = globalThis as typeof globalThis & { Date: DateConstructor }
  34 |     frozenGlobal.Date = FrozenDate
  35 |   }, { fixedNow: FIXED_NOW })
  36 | }
  37 | 
  38 | test.use({
  39 |   timezoneId: 'UTC',
  40 |   viewport: { width: 1440, height: 1200 },
  41 | })
  42 | 
  43 | test.describe('S05 shell visual baseline', () => {
  44 |   test.beforeEach(async ({ context }) => {
  45 |     await freezeClock(context)
  46 |   })
  47 | 
  48 |   test('captures a deterministic /en/n shell baseline', async ({ page }) => {
  49 |     await page.goto('/en/n', { waitUntil: 'networkidle' })
  50 |     await page.evaluate(async () => {
  51 |       await document.fonts.ready
  52 |     })
  53 | 
  54 |     const shell = page.locator('.site-shell')
  55 |     const nicheIndex = page.locator('[data-testid="niche-index"]')
  56 |     const firstCard = page.locator('[data-testid^="niche-card-"]').first()
  57 |     const footer = page.locator('[data-testid="footer"]')
  58 | 
  59 |     await expect(shell).toBeVisible()
> 60 |     await expect(nicheIndex).toBeVisible()
     |                              ^ Error: expect(locator).toBeVisible() failed
  61 |     await expect(firstCard).toBeVisible()
  62 |     await expect(footer).toBeVisible()
  63 | 
  64 |     await expect(page).toHaveScreenshot(SNAPSHOT_NAME, {
  65 |       animations: 'disabled',
  66 |       fullPage: true,
  67 |       maxDiffPixelRatio: 0.01,
  68 |     })
  69 |   })
  70 | })
  71 | 
```