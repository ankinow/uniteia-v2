import { expect, test } from '@playwright/test'

const ARTICLE_PATH = '/en/test-article'
const ARTICLE_TITLE = 'Test Article for Integration Verification'
const ARTICLE_DESCRIPTION = 'testing, integration, verification'
const EXPECTED_ALTERNATES = {
  en: '/en/test-article',
  es: '/es/test-article',
  ja: '/ja/test-article',
  pt: '/pt/test-article',
  zh: '/zh/test-article',
  'x-default': '/en/test-article',
} as const

function trackConsoleAndNetworkFailures(page: Parameters<typeof test>[0]['page']) {
  const consoleErrors: string[] = []
  const failedRequests: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      const text = message.text()
      if (text.startsWith('Detected Layout Shift during page load')) {
        return
      }
      consoleErrors.push(text)
    }
  })

  page.on('requestfailed', (request) => {
    failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText ?? 'failed'}`)
  })

  return { consoleErrors, failedRequests }
}

async function readHeadAttribute(
  page: Parameters<typeof test>[0]['page'],
  selector: string,
  attribute: string
) {
  return page.evaluate(
    ({ selector: querySelector, attribute: attributeName }) =>
      document.head.querySelector(querySelector)?.getAttribute(attributeName),
    { selector, attribute }
  )
}

test.describe('S03 SEO integration', () => {
  test('article route renders canonical SEO metadata and translated hreflang links', async ({ page }) => {
    const { consoleErrors, failedRequests } = trackConsoleAndNetworkFailures(page)

    const response = await page.goto(ARTICLE_PATH)
    expect(response, `Navigation response missing for ${ARTICLE_PATH}`).not.toBeNull()

    await page.waitForLoadState('networkidle')

    const description = await readHeadAttribute(page, 'meta[name="description"]', 'content')
    const robots = await readHeadAttribute(page, 'meta[name="robots"]', 'content')
    const canonicalHref = await readHeadAttribute(page, 'link[rel="canonical"]', 'href')
    const ogTitle = await readHeadAttribute(page, 'meta[property="og:title"]', 'content')
    const ogDescription = await readHeadAttribute(page, 'meta[property="og:description"]', 'content')
    const ogType = await readHeadAttribute(page, 'meta[property="og:type"]', 'content')
    const ogSiteName = await readHeadAttribute(page, 'meta[property="og:site_name"]', 'content')
    const ogLocale = await readHeadAttribute(page, 'meta[property="og:locale"]', 'content')
    const twitterCard = await readHeadAttribute(page, 'meta[name="twitter:card"]', 'content')
    const twitterTitle = await readHeadAttribute(page, 'meta[name="twitter:title"]', 'content')
    const twitterDescription = await readHeadAttribute(page, 'meta[name="twitter:description"]', 'content')

    expect(description).toBe(ARTICLE_DESCRIPTION)
    expect(robots).toBe('index, follow')
    expect(canonicalHref).toMatch(/\/en\/test-article$/)

    expect(ogTitle).toBe(ARTICLE_TITLE)
    expect(ogDescription).toBe(ARTICLE_DESCRIPTION)
    expect(ogType).toBe('article')
    expect(ogSiteName).toBe('UniTeia')
    expect(ogLocale).toBe('en')
    expect(twitterCard).toBe('summary_large_image')
    expect(twitterTitle).toBe(ARTICLE_TITLE)
    expect(twitterDescription).toBe(ARTICLE_DESCRIPTION)

    const alternates = await page.locator('link[rel="alternate"]').evaluateAll((links) =>
      links
        .map((link) => ({
          hreflang: link.getAttribute('hreflang'),
          href: (link as HTMLLinkElement).href,
        }))
        .filter((entry): entry is { hreflang: string; href: string } => Boolean(entry.hreflang))
    )

    expect(alternates).toHaveLength(Object.keys(EXPECTED_ALTERNATES).length)

    const alternatesByLang = Object.fromEntries(
      alternates.map((entry) => [entry.hreflang, new URL(entry.href).pathname])
    )

    expect(alternatesByLang).toMatchObject(EXPECTED_ALTERNATES)

    const bodyFont = await page.locator('body').evaluate((element) =>
      window.getComputedStyle(element).fontFamily.replace(/['"]/g, '')
    )
    const headingFont = await page.locator('h1').first().evaluate((element) =>
      window.getComputedStyle(element).fontFamily.replace(/['"]/g, '')
    )

    expect(bodyFont).toContain('Inter Variable')
    expect(headingFont).toContain('Geist Sans')

    const fontStatus = await page.evaluate(async () => {
      await document.fonts.ready
      return document.fonts.status
    })

    expect(fontStatus).toBe('loaded')
    expect(consoleErrors, `Console errors on ${ARTICLE_PATH}: ${consoleErrors.join('; ')}`).toHaveLength(0)
    expect(failedRequests, `Failed requests on ${ARTICLE_PATH}: ${failedRequests.join('; ')}`).toHaveLength(0)
  })

  test('sitemap.xml lists translated article URLs and responds as XML', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    expect(response, 'Navigation response missing for /sitemap.xml').not.toBeNull()

    const headers = response?.headers() ?? {}
    expect(headers['content-type']).toContain('text/xml')
    expect(headers['cache-control']).toContain('s-maxage=3600')

    const body = await response!.text()
    const origin = new URL(page.url()).origin

    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(body).toContain(`<loc>${origin}/</loc>`)
    expect(body).toContain(`<loc>${origin}/en/test-article</loc>`)
    expect(body).toContain(`<loc>${origin}/es/test-article</loc>`)
    expect(body).toContain(`<loc>${origin}/ja/test-article</loc>`)
    expect(body).toContain(`<loc>${origin}/pt/test-article</loc>`)
    expect(body).toContain(`<loc>${origin}/zh/test-article</loc>`)
    expect(body).not.toContain(`<loc>${origin}/en/test-admin</loc>`)
    expect(body).toContain(`<loc>${origin}/en/test-invalid-schema</loc>`)
    expect(body).not.toMatch(/<loc>[^<]*\?[^<]*<\/loc>/)
  })
})
