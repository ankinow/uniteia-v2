#!/usr/bin/env bun
/**
 * Deploy Health Check — verify the live site is healthy after deploy.
 *
 * Checks:
 *   - HTTP 200 on all locale routes + critical article pages
 *   - hreflang tags present
 *   - og:locale dynamic (NOT hardcoded pt_BR)
 *   - html lang attribute dynamic per-locale
 *   - skip-to-content accessibility link present
 *   - collage renders on article pages
 *   - No 404 pages
 *
 * Usage:
 *   bun run scripts/deploy-health-check.ts [--url https://uniteia.com]
 */

const TARGET =
  process.argv.find(a => a.startsWith('--url='))?.replace('--url=', '') ??
  process.env.DEPLOY_URL ??
  'https://uniteia.com'

const LOCALES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh']
const ARTICLE_PAGES = ['', '/signals/apex', '/signals/apex/magica-overview']

interface HreflangInfo {
  present: boolean
  count: number
  locales: string[]
}

interface OgLocaleInfo {
  present: boolean
  value: string
  isHardcodedPtBR: boolean
}

interface HtmlLangInfo {
  present: boolean
  value: string
  matchesUrl: boolean
}

interface Result {
  page: string
  status: number
  hasCollage: boolean
  hasSkipToContent: boolean
  hreflang: HreflangInfo
  ogLocale: OgLocaleInfo
  htmlLang: HtmlLangInfo
  errors: string[]
}

function extractHreflang(html: string): HreflangInfo {
  const matches = html.match(/hreflang="([^"]+)"/g)
  if (!matches || matches.length === 0) {
    return { present: false, count: 0, locales: [] }
  }
  const locales = matches.map(m => m.replace('hreflang="', '').replace('"', ''))
  return { present: true, count: locales.length, locales }
}

function extractOgLocale(html: string): OgLocaleInfo {
  const match = html.match(/property="og:locale"\s+content="([^"]+)"/)
  if (!match) {
    return { present: false, value: '', isHardcodedPtBR: false }
  }
  const value = match[1]
  return {
    present: true,
    value,
    isHardcodedPtBR: value === 'pt_BR',
  }
}

function extractHtmlLang(html: string): HtmlLangInfo {
  const match = html.match(/<html[^>]*\slang="([^"]+)"/)
  if (!match) {
    return { present: false, value: '', matchesUrl: false }
  }
  return {
    present: true,
    value: match[1],
    matchesUrl: false, // will be set per-check
  }
}

function expectedLocaleFromPath(path: string): string | null {
  // Extract locale from path like /en/signals/... → 'en'
  const match = path.match(/^\/(en|pt|es|fr|de|it|ja|zh)(\/|$)/)
  return match ? match[1] : null
}

async function check(url: string): Promise<Result> {
  const e: string[] = []
  let hasCollage = false
  let hasSkipToContent = false
  let status = 0
  let hreflang: HreflangInfo = { present: false, count: 0, locales: [] }
  let ogLocale: OgLocaleInfo = { present: false, value: '', isHardcodedPtBR: false }
  let htmlLang: HtmlLangInfo = { present: false, value: '', matchesUrl: false }

  try {
    const res = await fetch(TARGET + url)
    status = res.status
    const html = await res.text()

    // Collage check
    hasCollage = html.includes('aether-collage') || html.includes('collage-arrow')

    // Skip-to-content
    hasSkipToContent = html.includes('skip-to-content')

    // Status check
    if (status !== 200) e.push(`Status ${status}`)

    // 404 detection
    const is404 = html.includes('<title>404') || html.includes('>Page Not Found<')
    if (is404) e.push('404 page')

    // hreflang check
    hreflang = extractHreflang(html)
    if (!hreflang.present) {
      e.push('Missing hreflang tags')
    } else if (hreflang.count < 8) {
      e.push(`Only ${hreflang.count}/8 hreflang locales`)
    }

    // og:locale check
    ogLocale = extractOgLocale(html)
    if (!ogLocale.present) {
      e.push('Missing og:locale meta tag')
    } else if (ogLocale.isHardcodedPtBR) {
      // Only flag as error if the page is NOT Portuguese
      const expectedLocale = expectedLocaleFromPath(url)
      if (expectedLocale && expectedLocale !== 'pt') {
        e.push(`og:locale hardcoded to pt_BR on non-pt page (expected ${expectedLocale})`)
      }
    }

    // html lang check
    htmlLang = extractHtmlLang(html)
    if (!htmlLang.present) {
      e.push('Missing html lang attribute')
    } else {
      const expectedLocale = expectedLocaleFromPath(url)
      if (expectedLocale) {
        htmlLang.matchesUrl = htmlLang.value === expectedLocale
        if (!htmlLang.matchesUrl) {
          e.push(`html lang="${htmlLang.value}" does not match URL locale "${expectedLocale}"`)
        }
      }
    }

    // skip-to-content check
    if (!hasSkipToContent) {
      e.push('Missing skip-to-content accessibility link')
    }
  } catch (err: unknown) {
    e.push(`Fetch: ${err instanceof Error ? err.message : 'unknown'}`)
  }

  return {
    page: url,
    status,
    hasCollage,
    hasSkipToContent,
    hreflang,
    ogLocale,
    htmlLang,
    errors: e,
  }
}

async function main() {
  const r: Result[] = []

  // Check all locale homepages
  for (const locale of LOCALES) {
    r.push(await check(`/${locale}`))
  }

  // Check article pages (en locale as canonical)
  for (const page of ARTICLE_PAGES) {
    if (page === '') continue // already checked in locale loop
    r.push(await check(`/en${page}`))
  }

  const passed = r.filter(x => x.errors.length === 0).length
  const collage = r.filter(x => x.hasCollage).length
  const hreflangOk = r.filter(x => x.hreflang.present).length
  const ogLocaleOk = r.filter(x => x.ogLocale.present && !x.ogLocale.isHardcodedPtBR).length
  const htmlLangOk = r.filter(x => x.htmlLang.present && x.htmlLang.matchesUrl).length
  const skipToContentOk = r.filter(x => x.hasSkipToContent).length

  console.log('═══════════════════════════════════════════')
  console.log('  Deploy Health Check')
  console.log(`  Target: ${TARGET}`)
  console.log('═══════════════════════════════════════════')
  console.log(`  Total: ${r.length} | Passed: ${passed}/${r.length}`)
  console.log(`  Collage:     ${collage}/${r.length}`)
  console.log(`  Hreflang:    ${hreflangOk}/${r.length}`)
  console.log(`  og:locale:   ${ogLocaleOk}/${r.length}`)
  console.log(`  html lang:   ${htmlLangOk}/${r.length}`)
  console.log(`  Skip-to-content: ${skipToContentOk}/${r.length}`)
  console.log('───────────────────────────────────────────')

  for (const x of r) {
    const ok = x.errors.length === 0 ? 'OK' : 'FAIL'
    const flags: string[] = []
    if (x.hasCollage) flags.push('collage')
    if (x.hasSkipToContent) flags.push('skip-link')
    if (x.hreflang.present) flags.push(`hreflang(${x.hreflang.count})`)
    if (x.ogLocale.present) flags.push(`og:${x.ogLocale.value}`)
    if (x.htmlLang.present) flags.push(`lang=${x.htmlLang.value}`)

    console.log(`  ${ok} ${x.status} ${x.page}${flags.length > 0 ? ` [${flags.join(', ')}]` : ''}`)
    for (const err of x.errors) console.log(`    ! ${err}`)
  }

  console.log('═══════════════════════════════════════════')
  if (passed < r.length) {
    console.log('UNHEALTHY — some checks failed')
    process.exit(1)
  }
  console.log('HEALTHY — all checks passed')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
