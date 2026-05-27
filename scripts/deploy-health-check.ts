#!/usr/bin/env bun
/**
 * Deploy Health Check — verify the live site is healthy after deploy.
 *
 * Checks: HTTP 200, collage presence, locale routes, no 404 pages.
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

interface Result {
  page: string
  status: number
  hasCollage: boolean
  errors: string[]
}

async function check(url: string): Promise<Result> {
  const e: string[] = []
  let hasCollage = false
  let status = 0
  try {
    const res = await fetch(TARGET + url)
    status = res.status
    const html = await res.text()
    hasCollage = html.includes('aether-collage') || html.includes('collage-arrow')
    if (status !== 200) e.push(`Status ${status}`)
    // Only flag as 404 if the page's main heading says "Page Not Found"
    const is404 = html.includes('<title>404') || html.includes('>Page Not Found<')
    if (is404) e.push('404 page')
  } catch (err: unknown) {
    e.push(`Fetch: ${err instanceof Error ? err.message : 'unknown'}`)
  }
  return { page: url, status, hasCollage, errors: e }
}

async function main() {
  const r: Result[] = []
  for (const locale of LOCALES) {
    r.push(await check(`/${locale}`))
  }
  for (const page of ARTICLE_PAGES) {
    r.push(await check(`/en${page}`))
  }

  const passed = r.filter(x => x.errors.length === 0).length
  const collage = r.filter(x => x.hasCollage).length
  console.log(`Total: ${r.length} | Passed: ${passed}/${r.length} | Collage: ${collage}`)
  for (const x of r) {
    const ok = x.errors.length === 0 ? 'OK' : 'FAIL'
    console.log(`  ${ok} ${x.status} ${x.page}${x.hasCollage ? ' [collage]' : ''}`)
    for (const e of x.errors) console.log(`    ! ${e}`)
  }
  if (passed < r.length) process.exit(1)
  console.log('HEALTHY')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
