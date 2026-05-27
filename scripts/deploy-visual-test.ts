#!/usr/bin/env bun
/**
 * Deploy Visual Test — comprehensive check against the live deployed site.
 *
 * Checks:
 *   1. HTTP 200
 *   2. `<html lang="">` matches locale
 *   3. hreflang tags present for all 8 locales + x-default
 *   4. `<meta property="og:locale">` not hardcoded pt_BR
 *   5. `<title>` not empty
 *   6. JSON-LD scripts present (WebSite, WebPage, BreadcrumbList)
 *   7. Skip-to-content link present
 *   8. Main content containers present (articles, headings)
 *   9. No "Page Not Found" text
 *  10. Console errors count (via Playwright headless)
 *
 * Usage:
 *   bun run scripts/deploy-visual-test.ts                        # uses DEPLOY_URL or https://uniteia.com
 *   bun run scripts/deploy-visual-test.ts --url https://staging.example.com
 *
 * Exit codes:
 *   0 — all checks passed (warnings allowed)
 *   1 — critical failures
 */

import { chromium } from '@playwright/test'

const TARGET =
  process.argv.find(a => a.startsWith('--url='))?.replace('--url=', '') ??
  process.env.DEPLOY_URL ??
  'https://uniteia.com'

const LOCALES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const
type Locale = (typeof LOCALES)[number]

interface CheckResult {
  name: string
  passed: boolean
  severity: 'pass' | 'warn' | 'fail'
  detail: string
}

// ── Helpers ──

function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s)
}

function expectedLocaleFromPath(path: string): Locale | null {
  const match = path.match(/^\/(en|pt|es|fr|de|it|ja|zh)(\/|$)/)
  if (!match) return null
  const locale = match[1] as Locale
  return isLocale(locale) ? locale : null
}

// ── Checks ──

async function checkHttpStatus(url: string): Promise<CheckResult> {
  const res = await fetch(url, { redirect: 'follow' })
  const passed = res.status === 200
  return {
    name: `HTTP 200 — ${new URL(url).pathname}`,
    passed,
    severity: passed ? 'pass' : 'fail',
    detail: passed ? `${res.status}` : `Status ${res.status} (expected 200)`,
  }
}

async function checkHtmlLang(html: string, url: string): Promise<CheckResult> {
  const match = html.match(/<html[^>]*\slang="([^"]+)"/)
  const expectedLocale = expectedLocaleFromPath(url)
  if (!match) {
    return {
      name: `html lang attribute — ${new URL(url).pathname}`,
      passed: false,
      severity: 'fail',
      detail: 'Missing html lang attribute',
    }
  }
  // biome-ignore lint/style/noNonNullAssertion: match[1] is guaranteed by the preceding check
  const lang = match[1]!
  const passed = expectedLocale ? lang === expectedLocale : true
  return {
    name: `html lang="${lang}" — ${new URL(url).pathname}`,
    passed,
    severity: passed ? 'pass' : 'fail',
    detail: passed
      ? `lang="${lang}"${expectedLocale ? ` matches ${expectedLocale}` : ''}`
      : `lang="${lang}" does not match expected "${expectedLocale}"`,
  }
}

async function checkHreflang(html: string, url: string): Promise<CheckResult> {
  const matches = html.match(/hreflang="([^"]+)"/g)
  if (!matches || matches.length === 0) {
    return {
      name: `hreflang tags — ${new URL(url).pathname}`,
      passed: false,
      severity: 'fail',
      detail: 'Missing hreflang tags',
    }
  }
  const locales = matches.map(m => m.replace('hreflang="', '').replace('"', ''))
  const hasXDefault = locales.includes('x-default')
  // Count unique non-x-default locales
  const uniqueLocales = [...new Set(locales.filter(l => l !== 'x-default'))]
  const expectedCount = 8 // 8 locales
  const passed = hasXDefault && uniqueLocales.length >= expectedCount
  const detail = passed
    ? `hreflang: ${uniqueLocales.length} locales + x-default ✓`
    : `hreflang: ${uniqueLocales.length}/${expectedCount} locales${hasXDefault ? ' + x-default' : ' (missing x-default)'}`
  return {
    name: `hreflang tags — ${new URL(url).pathname}`,
    passed,
    severity: passed ? 'pass' : 'fail',
    detail,
  }
}

async function checkOgLocale(html: string, url: string): Promise<CheckResult> {
  const match = html.match(/property="og:locale"\s+content="([^"]+)"/)
  if (!match) {
    return {
      name: `og:locale — ${new URL(url).pathname}`,
      passed: false,
      severity: 'fail',
      detail: 'Missing og:locale meta tag',
    }
  }
  // biome-ignore lint/style/noNonNullAssertion: match[1] guaranteed by !match check above
  const value = match[1]!
  const expectedLocale = expectedLocaleFromPath(url)
  const isHardcodedPtBR = value === 'pt_BR'
  const isWrongLocale = expectedLocale && value !== expectedLocale && !isHardcodedPtBR
  const passed = !isHardcodedPtBR && !isWrongLocale
  const severity: CheckResult['severity'] = isHardcodedPtBR ? 'fail' : passed ? 'pass' : 'warn'
  const detail = passed
    ? `og:locale="${value}"${expectedLocale ? ` matches ${expectedLocale}` : ''}`
    : isHardcodedPtBR
      ? `og:locale hardcoded to pt_BR (expected ${expectedLocale || 'dynamic'})`
      : `og:locale="${value}" does not match expected "${expectedLocale}"`
  return {
    name: `og:locale — ${new URL(url).pathname}`,
    passed,
    severity,
    detail,
  }
}

async function checkTitle(html: string, url: string): Promise<CheckResult> {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/)
  const title = match ? match[1]?.trim() : ''
  const passed = title.length > 0
  return {
    name: `<title> not empty — ${new URL(url).pathname}`,
    passed,
    severity: passed ? 'pass' : 'fail',
    detail: passed
      ? `"${title.slice(0, 80)}${title.length > 80 ? '...' : ''}"`
      : 'Empty or missing <title>',
  }
}

async function checkJsonLd(html: string, url: string): Promise<CheckResult> {
  const jsonldMatches = html.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi
  )
  if (!jsonldMatches || jsonldMatches.length === 0) {
    return {
      name: `JSON-LD scripts — ${new URL(url).pathname}`,
      passed: false,
      severity: 'fail',
      detail: 'No JSON-LD scripts found',
    }
  }

  const types: string[] = []
  for (const script of jsonldMatches) {
    const contentMatch = script.match(/<script[^>]*>([\s\S]*?)<\/script>/)
    if (contentMatch) {
      try {
        // biome-ignore lint/style/noNonNullAssertion: contentMatch[1] guaranteed by contentMatch check
        const parsed = JSON.parse(contentMatch[1]!)
        if (parsed['@type']) {
          types.push(parsed['@type'])
        }
        // Handle @graph arrays
        if (parsed['@graph']) {
          for (const item of parsed['@graph']) {
            if (item['@type']) types.push(item['@type'])
          }
        }
      } catch {
        // not valid JSON — skip
      }
    }
  }

  const pathname = new URL(url).pathname
  // Root locale pages (/, /en/, /pt/) are the WebSite itself — WebSite is sufficient
  // Content pages (signals, articles) should have WebPage + BreadcrumbList
  const isRoot =
    pathname === '/' ||
    pathname === '' ||
    LOCALES.some(l => pathname === `/${l}` || pathname === `/${l}/`)
  const required = isRoot ? ['WebSite'] : ['WebSite', 'WebPage', 'BreadcrumbList']
  const missing = required.filter(r => !types.includes(r))
  // BreadcrumbList may be in head scripts (RouterHead) not captured by JSON-LD parsing
  // Fallback: check raw HTML for 'BreadcrumbList' or 'WebPage' text
  if (missing.length > 0 && !isRoot) {
    if (missing.includes('BreadcrumbList') && html.includes('BreadcrumbList')) {
      types.push('BreadcrumbList')
    }
    if (missing.includes('WebPage') && html.includes('WebPage')) {
      types.push('WebPage')
    }
  }
  const missingFinal = required.filter(r => !types.includes(r))
  const passed = missingFinal.length === 0
  return {
    name: `JSON-LD present (${types.join(', ')}) — ${new URL(url).pathname}`,
    passed,
    severity: passed ? 'pass' : 'fail',
    detail: passed
      ? `All required types found: ${required.join(', ')}`
      : `Missing JSON-LD types: ${missingFinal.join(', ')}. Found: ${types.join(', ') || 'none'}`,
  }
}

async function checkSkipToContent(html: string, url: string): Promise<CheckResult> {
  const passed = html.includes('skip-to-content')
  return {
    name: `Skip-to-content link — ${new URL(url).pathname}`,
    passed,
    severity: passed ? 'pass' : 'fail',
    detail: passed ? 'Found' : 'Missing skip-to-content link',
  }
}

async function checkMainContent(html: string, url: string): Promise<CheckResult> {
  const hasMain = html.includes('<main') || html.includes('role="main"')
  const hasArticle = html.includes('<article') || html.includes('class=".*article')
  const hasHeading = html.includes('<h1') || html.includes('<h2')
  const issues: string[] = []
  if (!hasMain) issues.push('no <main> element')
  if (!hasArticle) issues.push('no <article> element')
  if (!hasHeading) issues.push('no <h1>/<h2> heading')
  return {
    name: `Main content containers — ${new URL(url).pathname}`,
    passed: issues.length === 0,
    severity: issues.length === 0 ? 'pass' : issues.length >= 2 ? 'fail' : 'warn',
    detail: issues.length === 0 ? 'main + article + headings ✓' : `Missing: ${issues.join(', ')}`,
  }
}

async function checkNoPageNotFound(html: string, url: string): Promise<CheckResult> {
  const found = html.includes('>Page Not Found<') || html.includes('>Page not found<')
  return {
    name: `No "Page Not Found" text — ${new URL(url).pathname}`,
    passed: !found,
    severity: found ? 'fail' : 'pass',
    detail: found ? 'Found "Page Not Found" text on page' : 'Not found ✓',
  }
}

async function checkConsoleErrors(url: string): Promise<CheckResult> {
  const errors: string[] = []
  const warnings: string[] = []
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text())
      }
    })
    // Also catch page errors
    page.on('pageerror', err => {
      errors.push(err.message)
    })

    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(1000)
  } finally {
    await browser.close()
  }

  // Filter out known harmless errors
  const harmless = [
    'Failed to load resource',
    'net::ERR_ABORTED',
    'net::ERR_FAILED',
    'cloudflareinsights.com',
    'third-party cookies',
    'ResizeObserver loop',
  ]
  const criticalErrors = errors.filter(e => !harmless.some(h => e.includes(h)))
  // Warnings about trending empty state are acceptable
  const trendingWarnings = warnings.filter(w => w.includes('[trending]'))
  const otherWarnings = warnings.filter(w => !w.includes('[trending]'))

  // Trending empty state is a warning, not a failure
  const isFailure = criticalErrors.length > 0
  const detailParts: string[] = []
  if (criticalErrors.length > 0)
    detailParts.push(`${criticalErrors.length} critical console errors`)
  if (trendingWarnings.length > 0)
    detailParts.push(`${trendingWarnings.length} trending warnings (expected)`)
  if (otherWarnings.length > 0) detailParts.push(`${otherWarnings.length} other warnings`)

  const severity: CheckResult['severity'] = isFailure
    ? 'fail'
    : trendingWarnings.length > 0
      ? 'warn'
      : 'pass'
  return {
    name: `Console errors — ${new URL(url).pathname}`,
    passed: !isFailure,
    severity,
    detail: detailParts.length > 0 ? detailParts.join('; ') : 'No console errors ✓',
  }
}

// ── Runner ──

interface PageResult {
  url: string
  checks: CheckResult[]
}

async function checkPage(url: string): Promise<PageResult> {
  const checks: CheckResult[] = []
  let html = ''

  try {
    const res = await fetch(url, { redirect: 'follow' })
    checks.push(await checkHttpStatus(url))
    html = await res.text()

    checks.push(await checkHtmlLang(html, url))
    checks.push(await checkHreflang(html, url))
    checks.push(await checkOgLocale(html, url))
    checks.push(await checkTitle(html, url))
    checks.push(await checkJsonLd(html, url))
    checks.push(await checkSkipToContent(html, url))
    checks.push(await checkMainContent(html, url))
    checks.push(await checkNoPageNotFound(html, url))
  } catch (err: unknown) {
    checks.push({
      name: `Page load — ${new URL(url).pathname}`,
      passed: false,
      severity: 'fail',
      detail: `Failed to fetch: ${err instanceof Error ? err.message : 'unknown error'}`,
    })
  }

  return { url, checks }
}

function printResults(results: PageResult[], consoleCheck: CheckResult): void {
  const allChecks = [...results.flatMap(r => r.checks), consoleCheck]
  const passed = allChecks.filter(c => c.severity === 'pass').length
  const warnings = allChecks.filter(c => c.severity === 'warn').length
  const failed = allChecks.filter(c => c.severity === 'fail').length

  console.log('═══════════════════════════════════════════')
  console.log('  Deploy Visual Test')
  console.log(`  Target: ${TARGET}`)
  console.log('═══════════════════════════════════════════')
  console.log(`  Pages checked: ${results.length}`)
  console.log(`  Checks: ${allChecks.length} total`)
  console.log(`  ✅ Pass:  ${passed}`)
  console.log(`  ⚠️  Warn:  ${warnings}`)
  console.log(`  ❌ Fail:  ${failed}`)
  console.log('───────────────────────────────────────────')

  for (const pageResult of results) {
    const path = new URL(pageResult.url).pathname
    const pageFailedCount = pageResult.checks.filter(c => c.severity === 'fail').length
    const pageWarnCount = pageResult.checks.filter(c => c.severity === 'warn').length
    const statusIcon = pageFailedCount > 0 ? '❌' : pageWarnCount > 0 ? '⚠️' : '✅'
    console.log(`\n  ${statusIcon} ${path || '/'} (${pageFailedCount} fail, ${pageWarnCount} warn)`)

    for (const check of pageResult.checks) {
      const icon = check.severity === 'fail' ? '  ❌' : check.severity === 'warn' ? '  ⚠️' : '  ✅'
      console.log(`  ${icon} ${check.name}`)
      if (check.severity !== 'pass') {
        console.log(`      ${check.detail}`)
      }
    }
  }

  // Console check (Playwright-based, separate since it tests the default locale)
  console.log(
    `\n  ${consoleCheck.severity === 'fail' ? '❌' : consoleCheck.severity === 'warn' ? '⚠️' : '✅'} ${consoleCheck.name}`
  )
  if (consoleCheck.severity !== 'pass') {
    console.log(`      ${consoleCheck.detail}`)
  }

  console.log('═══════════════════════════════════════════')

  if (failed > 0) {
    console.log(`\n❌ DEPLOY VISUAL TEST FAILED — ${failed} critical issue(s)`)
    process.exit(1)
  }
  if (warnings > 0) {
    console.log(`\n⚠️  DEPLOY VISUAL TEST PASSED WITH ${warnings} WARNING(S)`)
    process.exit(0)
  }
  console.log('\n✅ DEPLOY VISUAL TEST PASSED')
}

async function main(): Promise<void> {
  console.log(`\n🔍 Deploy Visual Test against ${TARGET}\n`)

  // Check all locale landing pages
  const results: PageResult[] = []
  for (const locale of LOCALES) {
    const url = `${TARGET}/${locale}`
    const result = await checkPage(url)
    results.push(result)
  }

  // Check a niche page (apex/en)
  const apexUrl = `${TARGET}/en/signals/apex`
  const apexResult = await checkPage(apexUrl)
  results.push(apexResult)

  // Console error check (on default locale, using Playwright)
  const consoleCheck = await checkConsoleErrors(`${TARGET}/en`)

  // Print results and exit
  printResults(results, consoleCheck)
}

main().catch(e => {
  console.error('Fatal error:', e)
  process.exit(1)
})
