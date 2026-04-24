# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s05-shell-visual.spec.ts >> S05 shell visual baseline >> captures a deterministic /en/n shell baseline
- Location: tests/e2e/s05-shell-visual.spec.ts:54:3

# Error details

```
Error: expect(locator).toHaveScreenshot(expected) failed

Locator: locator('.site-shell')
  26972 pixels (ratio 0.02 of all image pixels) are different.

  Snapshot: shell-en-n.png

Call log:
  - Expect "toHaveScreenshot(shell-en-n.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - waiting for locator('.site-shell')
    - locator resolved to <div q:id="5" q:key="nJ_3" data-testid="site-shell" data-dopamine-shell-apex="true" data-dopamine-shell-path="/en/n/" data-dopamine-shell-route-remaining="2" data-dopamine-shell-session-remaining="1" data-dopamine-shell-whisper-state="ready" class="site-shell min-h-screen flex flex-col bg-void text-bone" data-qwik-inspector="/src/components/site-shell/index.tsx:46:5" on-document:qinit="/src/components/site-shell/index.tsx_SiteShell_component_useOnDocument_PuNrOD4muH0.js#SiteShell_component_useOnDoc…>…</div>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - 26972 pixels (ratio 0.02 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - waiting for locator('.site-shell')
    - locator resolved to <div q:id="5" q:key="nJ_3" data-testid="site-shell" data-dopamine-shell-apex="true" data-dopamine-shell-path="/en/n/" data-dopamine-shell-route-remaining="2" data-dopamine-shell-session-remaining="1" data-dopamine-shell-whisper-state="ready" class="site-shell min-h-screen flex flex-col bg-void text-bone" data-qwik-inspector="/src/components/site-shell/index.tsx:46:5" on-document:qinit="/src/components/site-shell/index.tsx_SiteShell_component_useOnDocument_PuNrOD4muH0.js#SiteShell_component_useOnDoc…>…</div>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - captured a stable screenshot
  - 26972 pixels (ratio 0.02 of all image pixels) are different.

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
  - main [ref=e26]:
    - generic [ref=e27]:
      - heading "All Topics" [level=1] [ref=e29]
      - generic [ref=e30]:
        - link "AI Agents Autonomous AI systems that perceive, reason, and act to accomplish goals." [ref=e31] [cursor=pointer]:
          - /url: /en/n/ai-agents
          - generic [ref=e33]:
            - heading "AI Agents" [level=2] [ref=e34]
            - paragraph [ref=e35]: Autonomous AI systems that perceive, reason, and act to accomplish goals.
        - link "Language Models Large-scale models that understand and generate human language." [ref=e36] [cursor=pointer]:
          - /url: /en/n/language-models
          - generic [ref=e38]:
            - heading "Language Models" [level=2] [ref=e39]
            - paragraph [ref=e40]: Large-scale models that understand and generate human language.
        - link "Prompt Engineering Techniques for crafting effective inputs to steer AI model outputs." [ref=e41] [cursor=pointer]:
          - /url: /en/n/prompt-engineering
          - generic [ref=e43]:
            - heading "Prompt Engineering" [level=2] [ref=e44]
            - paragraph [ref=e45]: Techniques for crafting effective inputs to steer AI model outputs.
  - contentinfo [ref=e46]:
    - generic [ref=e50]:
      - paragraph [ref=e52]: © 2026 UniTeia. All rights reserved.
      - paragraph [ref=e54]: Made with ♥ for decentralized AI
      - navigation [ref=e55]:
        - link "Privacy Policy" [ref=e56] [cursor=pointer]:
          - /url: /privacy
        - link "Terms of Service" [ref=e57] [cursor=pointer]:
          - /url: /terms
        - link "Source Code" [ref=e58] [cursor=pointer]:
          - /url: https://github.com/uniteia/uniteia-v2
      - generic [ref=e59]:
        - generic [ref=e60]: Language
        - generic [ref=e61]: English
```

# Test source

```ts
  1  | import { type BrowserContext, expect, test } from '@playwright/test'
  2  | 
  3  | const FIXED_NOW = Date.parse('2026-04-24T12:00:00.000Z')
  4  | const SNAPSHOT_NAME = 'shell-en-n.png'
  5  | 
  6  | async function freezeClock(context: BrowserContext) {
  7  |   await context.addInitScript(
  8  |     ({ fixedNow }: { fixedNow: number }) => {
  9  |       const RealDate = Date
  10 | 
  11 |       class FrozenDate extends RealDate {
  12 |         // biome-ignore lint/suspicious/noExplicitAny: needed for Date constructor overloads
  13 |         constructor(...args: any[]) {
  14 |           if (args.length === 0) {
  15 |             super(fixedNow)
  16 |             return
  17 |           }
  18 | 
  19 |           // @ts-ignore
  20 |           super(...args)
  21 |         }
  22 | 
  23 |         static now() {
  24 |           return fixedNow
  25 |         }
  26 | 
  27 |         static parse(value: string) {
  28 |           return RealDate.parse(value)
  29 |         }
  30 | 
  31 |         static UTC(...args: Parameters<typeof Date.UTC>) {
  32 |           return RealDate.UTC(...args)
  33 |         }
  34 |       }
  35 | 
  36 |       // biome-ignore lint/suspicious/noExplicitAny: needed for browser-side Date constructor injection
  37 |       const frozenGlobal = globalThis as any
  38 |       frozenGlobal.Date = FrozenDate
  39 |     },
  40 |     { fixedNow: FIXED_NOW }
  41 |   )
  42 | }
  43 | 
  44 | test.use({
  45 |   timezoneId: 'UTC',
  46 |   viewport: { width: 1440, height: 1200 },
  47 | })
  48 | 
  49 | test.describe('S05 shell visual baseline', () => {
  50 |   test.beforeEach(async ({ context }) => {
  51 |     await freezeClock(context)
  52 |   })
  53 | 
  54 |   test('captures a deterministic /en/n shell baseline', async ({ page }) => {
  55 |     await page.goto('/en/n', { waitUntil: 'networkidle' })
  56 |     await page.evaluate(async () => {
  57 |       await document.fonts.ready
  58 |     })
  59 | 
  60 |     const shell = page.locator('.site-shell')
  61 |     const main = page.locator('[data-testid="site-main"]')
  62 |     const footer = page.locator('[data-testid="footer"]')
  63 | 
  64 |     await expect(shell).toBeVisible()
  65 |     await expect(main).toBeVisible()
  66 |     await expect(footer).toBeVisible()
  67 | 
> 68 |     await expect(shell).toHaveScreenshot(SNAPSHOT_NAME, {
     |                         ^ Error: expect(locator).toHaveScreenshot(expected) failed
  69 |       animations: 'disabled',
  70 |       maxDiffPixelRatio: 0.01,
  71 |     })
  72 |   })
  73 | })
  74 | 
```