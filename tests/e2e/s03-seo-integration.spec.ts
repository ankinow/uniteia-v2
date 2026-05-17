import { type Page, expect, test } from '@playwright/test'

const ARTICLE_PATH = '/en/signals/apex/tencent-cloud-deal-stack-builders'
const ARTICLE_TITLE = 'Tencent Cloud Deal Stack for Builders'
const ARTICLE_DESCRIPTION = 'cloud, builders, infrastructure, tencent-cloud'
const EXPECTED_ALTERNATES = {
  en: '/en/signals/apex/tencent-cloud-deal-stack-builders',
  es: '/es/signals/apex/tencent-cloud-deal-stack-builders',
  ja: '/ja/signals/apex/tencent-cloud-deal-stack-builders',
  pt: '/pt/signals/apex/tencent-cloud-deal-stack-builders',
  zh: '/zh/signals/apex/tencent-cloud-deal-stack-builders',
  de: '/de/signals/apex/tencent-cloud-deal-stack-builders',
  fr: '/fr/signals/apex/tencent-cloud-deal-stack-builders',
  it: '/it/signals/apex/tencent-cloud-deal-stack-builders',
  'x-default': '/en/signals/apex/tencent-cloud-deal-stack-builders',
} as const

function trackConsoleAndNetworkFailures(page: Page) {
  const consoleErrors: string[] = []
  const failedRequests: string[] = []

  page.on('console', (message: import('@playwright/test').ConsoleMessage) => {
    if (message.type() === 'error') {
      const text = message.text()
      if (text.startsWith('Detected Layout Shift during page load')) {
        return
      }
      consoleErrors.push(text)
    }
  })

  page.on('requestfailed', (request: import('@playwright/test').Request) => {
    failedRequests.push(
      `${request.method()} ${request.url()} :: ${request.failure()?.errorText ?? 'failed'}`
    )
  })

  return { consoleErrors, failedRequests }
}

async function readHeadAttribute(page: Page, selector: string, attribute: string) {
  return page.evaluate(
    ({ selector: querySelector, attribute: attributeName }) =>
      document.head.querySelector(querySelector)?.getAttribute(attributeName),
    { selector, attribute }
  )
}

test.describe('S03 SEO integration', () => {
  test('article route renders canonical SEO metadata and translated hreflang links', async ({
    page,
  }) => {
    const { consoleErrors, failedRequests } = trackConsoleAndNetworkFailures(page)

    const response = await page.goto(ARTICLE_PATH)
    expect(response, `Navigation response missing for ${ARTICLE_PATH}`).not.toBeNull()

    await page.waitForLoadState('networkidle')

    const description = await readHeadAttribute(page, 'meta[name="description"]', 'content')
    const robots = await readHeadAttribute(page, 'meta[name="robots"]', 'content')
    const canonicalHref = await readHeadAttribute(page, 'link[rel="canonical"]', 'href')
    const ogTitle = await readHeadAttribute(page, 'meta[property="og:title"]', 'content')
    const ogDescription = await readHeadAttribute(
      page,
      'meta[property="og:description"]',
      'content'
    )
    const ogType = await readHeadAttribute(page, 'meta[property="og:type"]', 'content')
    const ogSiteName = await readHeadAttribute(page, 'meta[property="og:site_name"]', 'content')
    const ogLocale = await readHeadAttribute(page, 'meta[property="og:locale"]', 'content')
    const twitterCard = await readHeadAttribute(page, 'meta[name="twitter:card"]', 'content')
    const twitterTitle = await readHeadAttribute(page, 'meta[name="twitter:title"]', 'content')
    const twitterDescription = await readHeadAttribute(
      page,
      'meta[name="twitter:description"]',
      'content'
    )

    expect(description).toBe(ARTICLE_DESCRIPTION)
    expect(robots).toBe('index, follow')
    expect(canonicalHref).toMatch(/\/en\/signals\/apex\/tencent-cloud-deal-stack-builders$/)

    expect(ogTitle).toBe(ARTICLE_TITLE)
    expect(ogDescription).toBe(ARTICLE_DESCRIPTION)
    expect(ogType).toBe('article')
    expect(ogSiteName).toBe('UniTeia')
    expect(ogLocale).toBe('en')
    expect(twitterCard).toBe('summary_large_image')
    expect(twitterTitle).toBe(ARTICLE_TITLE)
    expect(twitterDescription).toBe(ARTICLE_DESCRIPTION)

    const alternates = await page.locator('link[rel="alternate"]').evaluateAll(links =>
      links
        .map(link => ({
          hreflang: link.getAttribute('hreflang'),
          href: (link as HTMLLinkElement).href,
        }))
        .filter((entry): entry is { hreflang: string; href: string } => Boolean(entry.hreflang))
    )

    expect(alternates).toHaveLength(Object.keys(EXPECTED_ALTERNATES).length)

    const alternatesByLang = Object.fromEntries(
      alternates.map(entry => [entry.hreflang, new URL(entry.href).pathname])
    )

    expect(alternatesByLang).toMatchObject(EXPECTED_ALTERNATES)

    const bodyFont = await page
      .locator('body')
      .evaluate(element => window.getComputedStyle(element).fontFamily.replace(/['"]/g, ''))
    const headingFont = await page
      .locator('h1')
      .first()
      .evaluate(element => window.getComputedStyle(element).fontFamily.replace(/['"]/g, ''))

    expect(bodyFont).toContain('Inter Variable')
    expect(headingFont).toContain('Geist Sans')

    const fontStatus = await page.evaluate(async () => {
      await document.fonts.ready
      return document.fonts.status
    })

    expect(fontStatus).toBe('loaded')
    expect(
      consoleErrors,
      `Console errors on ${ARTICLE_PATH}: ${consoleErrors.join('; ')}`
    ).toHaveLength(0)
    expect(
      failedRequests,
      `Failed requests on ${ARTICLE_PATH}: ${failedRequests.join('; ')}`
    ).toHaveLength(0)
  })

  test('sitemap.xml lists translated article URLs and responds as XML', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    expect(response, 'Navigation response missing for /sitemap.xml').not.toBeNull()
    if (!response) {
      throw new Error('Navigation response missing for /sitemap.xml')
    }

    const headers = response.headers()
    expect(headers['content-type']).toContain('application/xml')
    expect(headers['cache-control']).toContain('s-maxage=3600')

    const body = await response.text()

    const sitemapOrigin = 'https://uniteia.com'
    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(body).toContain(`<loc>${sitemapOrigin}/</loc>`)
    expect(body).toContain(
      `<loc>${sitemapOrigin}/en/signals/apex/tencent-cloud-deal-stack-builders</loc>`
    )
    expect(body).toContain(
      `<loc>${sitemapOrigin}/es/signals/apex/tencent-cloud-deal-stack-builders</loc>`
    )
    expect(body).toContain(
      `<loc>${sitemapOrigin}/ja/signals/apex/tencent-cloud-deal-stack-builders</loc>`
    )
    expect(body).toContain(
      `<loc>${sitemapOrigin}/pt/signals/apex/tencent-cloud-deal-stack-builders</loc>`
    )
    expect(body).toContain(
      `<loc>${sitemapOrigin}/zh/signals/apex/tencent-cloud-deal-stack-builders</loc>`
    )
    expect(body).not.toMatch(/<loc>[^<]*\?[^<]*<\/loc>/)
  })
})
