# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s03-seo-integration.spec.ts >> S03 SEO integration >> article route renders canonical SEO metadata and translated hreflang links
- Location: tests/e2e/s03-seo-integration.spec.ts:45:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "testing, integration, verification"
Received: undefined
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
          - heading "Test Article for Integration Verification" [level=1] [ref=e65]
          - paragraph [ref=e66]: This is a test article created to verify the content rendering pipeline of UniTeia v2. It serves as a fixture for integration testing of the routeLoader$, schema validation, and component rendering.
          - heading "Purpose" [level=2] [ref=e67]
          - paragraph [ref=e68]: "The primary purpose of this article is to exercise the full content pipeline:"
          - list [ref=e69]:
            - listitem [ref=e70]:
              - strong [ref=e71]: Markdown parsing
              - text: — frontmatter extraction via gray-matter
            - listitem [ref=e72]:
              - strong [ref=e73]: Schema validation
              - text: — AJV Draft 2020-12 compliance check
            - listitem [ref=e74]:
              - strong [ref=e75]: Slug validation
              - text: — URL safety via
              - code [ref=e76]: "`validateSlug()`"
            - listitem [ref=e77]:
              - strong [ref=e78]: Component rendering
              - text: — ArticleFrame, AdaptiveHeader, FrontmatterSlots, and SourceLedger
          - heading "Content Requirements" [level=2] [ref=e79]
          - paragraph [ref=e80]: The schema requires a minimum of 100 characters of content. This paragraph and the surrounding text ensure we comfortably exceed that threshold while providing meaningful test coverage for the rendering pipeline.
          - heading "Technical Details" [level=2] [ref=e81]
          - paragraph [ref=e82]:
            - text: The routeLoader$ reads this file from the
            - code [ref=e83]: "`/llm-wiki/en/`"
            - text: directory, parses the YAML frontmatter, validates the resulting object against the JSON schema, and injects typed content into the Qwik-City route. Any validation failure is logged to the server console with the slug and error details.
        - navigation "Sources" [ref=e84]:
          - heading "Sources" [level=2] [ref=e85]
          - list [ref=e86]:
            - listitem [ref=e87]:
              - link "Example Reference A sample external reference link example.com" [ref=e88] [cursor=pointer]:
                - /url: https://example.com/reference
                - generic [ref=e89]:
                  - generic [ref=e90]: Example Reference
                  - generic [ref=e91]: A sample external reference link
                - generic [ref=e92]: example.com
            - listitem [ref=e93]:
              - link "Example Documentation example.com" [ref=e94] [cursor=pointer]:
                - /url: https://example.com/docs
                - generic [ref=e96]: Example Documentation
                - generic [ref=e97]: example.com
        - text: CLS 0.099
    - contentinfo [ref=e98]:
      - generic [ref=e102]:
        - paragraph [ref=e104]: © 2026 UniTeia. All rights reserved.
        - paragraph [ref=e106]: Made with ♥ for decentralized AI
        - navigation [ref=e107]:
          - link "Privacy Policy" [ref=e108] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e109] [cursor=pointer]:
            - /url: /terms
          - link "Source Code" [ref=e110] [cursor=pointer]:
            - /url: https://github.com/uniteia/uniteia-v2
        - generic [ref=e111]:
          - generic [ref=e112]: Language
          - generic [ref=e113]: English
  - generic [ref=e114]: "Click-to-Source: Alt"
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test'
  2   | 
  3   | const ARTICLE_PATH = '/en/test-article'
  4   | const ARTICLE_TITLE = 'Test Article for Integration Verification'
  5   | const ARTICLE_DESCRIPTION = 'testing, integration, verification'
  6   | const EXPECTED_ALTERNATES = {
  7   |   en: '/en/test-article',
  8   |   es: '/es/test-article',
  9   |   ja: '/ja/test-article',
  10  |   pt: '/pt/test-article',
  11  |   zh: '/zh/test-article',
  12  |   'x-default': '/en/test-article',
  13  | } as const
  14  | 
  15  | function trackConsoleAndNetworkFailures(page: Parameters<typeof test>[0]['page']) {
  16  |   const consoleErrors: string[] = []
  17  |   const failedRequests: string[] = []
  18  | 
  19  |   page.on('console', (message) => {
  20  |     if (message.type() === 'error') {
  21  |       consoleErrors.push(message.text())
  22  |     }
  23  |   })
  24  | 
  25  |   page.on('requestfailed', (request) => {
  26  |     failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText ?? 'failed'}`)
  27  |   })
  28  | 
  29  |   return { consoleErrors, failedRequests }
  30  | }
  31  | 
  32  | async function readHeadAttribute(
  33  |   page: Parameters<typeof test>[0]['page'],
  34  |   selector: string,
  35  |   attribute: string
  36  | ) {
  37  |   return page.evaluate(
  38  |     ({ selector: querySelector, attribute: attributeName }) =>
  39  |       document.head.querySelector(querySelector)?.getAttribute(attributeName),
  40  |     { selector, attribute }
  41  |   )
  42  | }
  43  | 
  44  | test.describe('S03 SEO integration', () => {
  45  |   test('article route renders canonical SEO metadata and translated hreflang links', async ({ page }) => {
  46  |     const { consoleErrors, failedRequests } = trackConsoleAndNetworkFailures(page)
  47  | 
  48  |     const response = await page.goto(ARTICLE_PATH)
  49  |     expect(response, `Navigation response missing for ${ARTICLE_PATH}`).not.toBeNull()
  50  | 
  51  |     await page.waitForLoadState('networkidle')
  52  | 
  53  |     const description = await readHeadAttribute(page, 'meta[name="description"]', 'content')
  54  |     const robots = await readHeadAttribute(page, 'meta[name="robots"]', 'content')
  55  |     const canonicalHref = await readHeadAttribute(page, 'link[rel="canonical"]', 'href')
  56  |     const ogTitle = await readHeadAttribute(page, 'meta[property="og:title"]', 'content')
  57  |     const ogDescription = await readHeadAttribute(page, 'meta[property="og:description"]', 'content')
  58  |     const ogType = await readHeadAttribute(page, 'meta[property="og:type"]', 'content')
  59  |     const ogSiteName = await readHeadAttribute(page, 'meta[property="og:site_name"]', 'content')
  60  |     const ogLocale = await readHeadAttribute(page, 'meta[property="og:locale"]', 'content')
  61  |     const twitterCard = await readHeadAttribute(page, 'meta[name="twitter:card"]', 'content')
  62  |     const twitterTitle = await readHeadAttribute(page, 'meta[name="twitter:title"]', 'content')
  63  |     const twitterDescription = await readHeadAttribute(page, 'meta[name="twitter:description"]', 'content')
  64  | 
> 65  |     expect(description).toBe(ARTICLE_DESCRIPTION)
      |                         ^ Error: expect(received).toBe(expected) // Object.is equality
  66  |     expect(robots).toBe('index, follow')
  67  |     expect(canonicalHref).toMatch(/\/en\/test-article$/)
  68  | 
  69  |     expect(ogTitle).toBe(ARTICLE_TITLE)
  70  |     expect(ogDescription).toBe(ARTICLE_DESCRIPTION)
  71  |     expect(ogType).toBe('article')
  72  |     expect(ogSiteName).toBe('UniTeia')
  73  |     expect(ogLocale).toBe('en')
  74  |     expect(twitterCard).toBe('summary_large_image')
  75  |     expect(twitterTitle).toBe(ARTICLE_TITLE)
  76  |     expect(twitterDescription).toBe(ARTICLE_DESCRIPTION)
  77  | 
  78  |     const alternates = await page.locator('link[rel="alternate"]').evaluateAll((links) =>
  79  |       links
  80  |         .map((link) => ({
  81  |           hreflang: link.getAttribute('hreflang'),
  82  |           href: (link as HTMLLinkElement).href,
  83  |         }))
  84  |         .filter((entry): entry is { hreflang: string; href: string } => Boolean(entry.hreflang))
  85  |     )
  86  | 
  87  |     expect(alternates).toHaveLength(Object.keys(EXPECTED_ALTERNATES).length)
  88  | 
  89  |     const alternatesByLang = Object.fromEntries(
  90  |       alternates.map((entry) => [entry.hreflang, new URL(entry.href).pathname])
  91  |     )
  92  | 
  93  |     expect(alternatesByLang).toMatchObject(EXPECTED_ALTERNATES)
  94  | 
  95  |     const bodyFont = await page.locator('body').evaluate((element) =>
  96  |       window.getComputedStyle(element).fontFamily.replace(/['"]/g, '')
  97  |     )
  98  |     const headingFont = await page.locator('h1').first().evaluate((element) =>
  99  |       window.getComputedStyle(element).fontFamily.replace(/['"]/g, '')
  100 |     )
  101 | 
  102 |     expect(bodyFont).toContain('Inter Variable')
  103 |     expect(headingFont).toContain('Geist Sans')
  104 | 
  105 |     const fontStatus = await page.evaluate(async () => {
  106 |       await document.fonts.ready
  107 |       return document.fonts.status
  108 |     })
  109 | 
  110 |     expect(fontStatus).toBe('loaded')
  111 |     expect(consoleErrors, `Console errors on ${ARTICLE_PATH}: ${consoleErrors.join('; ')}`).toHaveLength(0)
  112 |     expect(failedRequests, `Failed requests on ${ARTICLE_PATH}: ${failedRequests.join('; ')}`).toHaveLength(0)
  113 |   })
  114 | 
  115 |   test('sitemap.xml lists translated article URLs and responds as XML', async ({ page }) => {
  116 |     const response = await page.goto('/sitemap.xml')
  117 |     expect(response, 'Navigation response missing for /sitemap.xml').not.toBeNull()
  118 | 
  119 |     const headers = response?.headers() ?? {}
  120 |     expect(headers['content-type']).toContain('text/xml')
  121 |     expect(headers['cache-control']).toContain('s-maxage=3600')
  122 | 
  123 |     const body = await response!.text()
  124 |     const origin = new URL(page.url()).origin
  125 | 
  126 |     expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>')
  127 |     expect(body).toContain(`<loc>${origin}/</loc>`)
  128 |     expect(body).toContain(`<loc>${origin}/en/test-article</loc>`)
  129 |     expect(body).toContain(`<loc>${origin}/es/test-article</loc>`)
  130 |     expect(body).toContain(`<loc>${origin}/ja/test-article</loc>`)
  131 |     expect(body).toContain(`<loc>${origin}/pt/test-article</loc>`)
  132 |     expect(body).toContain(`<loc>${origin}/zh/test-article</loc>`)
  133 |     expect(body).not.toContain(`<loc>${origin}/en/test-admin</loc>`)
  134 |     expect(body).toContain(`<loc>${origin}/en/test-invalid-schema</loc>`)
  135 |     expect(body).not.toMatch(/<loc>[^<]*\?[^<]*<\/loc>/)
  136 |   })
  137 | })
  138 | 
```