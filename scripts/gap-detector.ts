/** gap-detector.ts — content quality gap scanner. Pure fs. Node stdlib. <200 LOC.
 *  Run: cd uniteia-v2 && bun run scripts/gap-detector.ts  */

import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

export interface Gap {
  type: string
  niche: string
  slug: string
  locale?: string
  detail: string
}

const LOCALES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh']
const SEV: Record<string, number> = {
  MISSING_CANVAS: 0,
  MISSING_LOCALE: 1,
  MISSING_COLLAGE: 2,
  BROKEN_LINK: 3,
  MISSING_HREFLANG: 3,
  STALE_CONTENT: 4,
  LOW_QUALITY: 5,
}
const ROOT = existsSync(join(process.cwd(), 'content'))
  ? process.cwd()
  : join(process.cwd(), 'uniteia-v2')
const CD = join(ROOT, 'content'),
  DD = join(ROOT, 'dist')

function niches(): string[] {
  return readdirSync(CD, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name)
}
function slugs(niche: string): string[] {
  const d = join(CD, niche, 'en')
  if (!existsSync(d)) return []
  return readdirSync(d, { withFileTypes: true })
    .filter(e => e.isFile() && e.name.endsWith('.md') && e.name !== '_index.md')
    .map(e => e.name.replace(/\.md$/, ''))
}
function parseFM(fp: string): Record<string, unknown> | null {
  try {
    const raw = readFileSync(fp, 'utf-8'),
      m = raw.match(/^---\n([\s\S]*?)\n---/)
    if (!m) return null
    const out: Record<string, unknown> = {}
    let i = 0
    const lines = m[1].split('\n')
    while (i < lines.length) {
      const km = lines[i].match(/^(\w[\w_]*):\s*(.*)/)
      if (!km) {
        i++
        continue
      }
      const k = km[1],
        r = km[2].trim()
      if (r === '' || r === '[]') {
        out[k] = r === '[]' ? [] : {}
        i++
        continue
      }
      if (r.startsWith('- ')) {
        const a: string[] = []
        if (r !== '- ') a.push(r.slice(2).replace(/^["']|["']$/g, ''))
        i++
        while (i < lines.length && lines[i].match(/^\s+- /)) {
          const im = lines[i].match(/^\s+-\s+(.*)/)
          if (im) a.push(im[1].replace(/^["']|["']$/g, ''))
          i++
        }
        out[k] = a
        continue
      }
      out[k] = r.replace(/^["']|["']$/g, '')
      i++
    }
    return out
  } catch {
    return null
  }
}
function distHtml(locale: string): string[] {
  const ld = join(DD, locale)
  if (!existsSync(ld)) return []
  const r: string[] = []
  function walk(d: string) {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const f = join(d, e.name)
      e.isDirectory() ? walk(f) : e.name.endsWith('.html') && r.push(f)
    }
  }
  walk(ld)
  return r
}

function chkCanvas(): Gap[] {
  const a: Gap[] = []
  try {
    for (const n of niches())
      for (const l of LOCALES)
        for (const s of slugs(n)) {
          const fp = join(CD, n, l, `${s}.md`)
          if (!existsSync(fp)) continue
          const fm = parseFM(fp)
          if (!fm || !('canvas' in fm))
            a.push({
              type: 'MISSING_CANVAS',
              niche: n,
              slug: s,
              locale: l,
              detail: `No canvas: ${relative(ROOT, fp)}`,
            })
        }
  } catch (err) {
    console.warn(
      `[gap-detector] chkCanvas: error scanning content — error=${(err as Error)?.message ?? String(err)}`
    )
  }
  return a
}

function chkCollage(): Gap[] {
  const a: Gap[] = []
  try {
    for (const n of niches())
      for (const l of LOCALES)
        for (const s of slugs(n)) {
          const fp = join(CD, n, l, `${s}.md`)
          if (!existsSync(fp)) continue
          const fm = parseFM(fp)
          if (!fm || !('canvas' in fm)) continue
          const cp = join(CD, n, l, 'assets', 'collage', `${s}.json`)
          if (!existsSync(cp))
            a.push({
              type: 'MISSING_COLLAGE',
              niche: n,
              slug: s,
              locale: l,
              detail: `No collage: ${relative(ROOT, cp)}`,
            })
        }
  } catch (err) {
    console.warn(
      `[gap-detector] chkCollage: error scanning content — error=${(err as Error)?.message ?? String(err)}`
    )
  }
  return a
}

function chkLocale(): Gap[] {
  const a: Gap[] = []
  try {
    for (const n of niches())
      for (const s of slugs(n))
        for (const l of LOCALES) {
          if (l === 'en') continue
          const fp = join(CD, n, l, `${s}.md`)
          if (!existsSync(fp))
            a.push({
              type: 'MISSING_LOCALE',
              niche: n,
              slug: s,
              locale: l,
              detail: `Missing ${l}: ${n}/${l}/${s}.md`,
            })
        }
  } catch (err) {
    console.warn(
      `[gap-detector] chkLocale: error scanning content — error=${(err as Error)?.message ?? String(err)}`
    )
  }
  return a
}

function chkStale(): Gap[] {
  const a: Gap[] = []
  const cutoff = Date.now() - 7 * 86400000
  try {
    const all: string[] = []
    for (const n of niches())
      for (const l of LOCALES)
        for (const s of slugs(n)) {
          const fp = join(CD, n, l, `${s}.md`)
          existsSync(fp) && all.push(fp)
        }
    for (const fp of all) {
      try {
        const log = execSync(`git log -1 --format="%at" -- "${fp}"`, {
          cwd: ROOT,
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        }).trim()
        if (log && Number.parseInt(log) * 1000 < cutoff) {
          const rel = relative(ROOT, fp),
            p = rel.split('/')
          a.push({
            type: 'STALE_CONTENT',
            niche: p[1],
            slug: p[3].replace(/\.md$/, ''),
            locale: p[2],
            detail: `Git: ${new Date(Number.parseInt(log) * 1000).toISOString().slice(0, 10)} (${Math.floor((Date.now() - Number.parseInt(log) * 1000) / 86400000)}d): ${rel}`,
          })
        }
      } catch {
        /* skip */
      }
    }
  } catch (err) {
    console.warn(
      `[gap-detector] chkStale: error scanning stale content — error=${(err as Error)?.message ?? String(err)}`
    )
  }
  return a
}

function chkLowQ(): Gap[] {
  const a: Gap[] = []
  try {
    for (const n of niches())
      for (const l of LOCALES)
        for (const s of slugs(n)) {
          const fp = join(CD, n, l, `${s}.md`)
          if (!existsSync(fp)) continue
          const fm = parseFM(fp)
          const sc = fm ? Number(fm.quality_score) : Number.NaN
          if (!isNaN(sc) && sc < 70)
            a.push({
              type: 'LOW_QUALITY',
              niche: n,
              slug: s,
              locale: l,
              detail: `score=${sc}<70: ${relative(ROOT, fp)}`,
            })
        }
  } catch (err) {
    console.warn(
      `[gap-detector] chkLowQ: error scanning content — error=${(err as Error)?.message ?? String(err)}`
    )
  }
  return a
}

function chkHreflang(): Gap[] {
  const a: Gap[] = []
  try {
    for (const l of LOCALES)
      for (const h of distHtml(l))
        try {
          if (!readFileSync(h, 'utf-8').includes('hreflang'))
            a.push({
              type: 'MISSING_HREFLANG',
              niche: '',
              slug: relative(join(DD, l), h).replace(/\.html$/, ''),
              locale: l,
              detail: `No hreflang: ${relative(ROOT, h)}`,
            })
        } catch (err) {
          console.warn(
            `[gap-detector] chkHreflang: error reading dist HTML — locale=${l} path=${h} error=${(err as Error)?.message ?? String(err)}`
          )
        }
  } catch (err) {
    console.warn(
      `[gap-detector] chkHreflang: error scanning dist — error=${(err as Error)?.message ?? String(err)}`
    )
  }
  return a
}

export function detectGaps(rootDir?: string): Gap[] {
  if (rootDir) process.chdir(rootDir)
  const all = [
    ...chkCanvas(),
    ...chkLocale(),
    ...chkCollage(),
    ...chkLowQ(),
    ...chkStale(),
    ...chkHreflang(),
  ]
  all.sort((a, b) => (SEV[a.type] ?? 99) - (SEV[b.type] ?? 99))
  return all
}

export function gapSummary(gaps: Gap[]): string {
  if (!gaps.length) return '✅ No content quality gaps detected.\n'
  const grp: Record<string, Gap[]> = {}
  for (const g of gaps) (grp[g.type] ??= []).push(g)
  const o = [
    'MISSING_CANVAS',
    'MISSING_LOCALE',
    'MISSING_COLLAGE',
    'BROKEN_LINK',
    'MISSING_HREFLANG',
    'STALE_CONTENT',
    'LOW_QUALITY',
  ]
  const mx = Math.max(...o.map(t => t.length), 18)
  const l: string[] = []
  l.push(`📋 Gap Report — ${gaps.length} gap(s) detected\n`)
  l.push(`  ${'TYPE'.padEnd(mx)}  COUNT  EXAMPLE`)
  l.push(`  ${'─'.repeat(mx)}  ─────  ${'─'.repeat(60)}`)
  for (const t of o) {
    const it = grp[t]
    if (!it?.length) continue
    l.push(
      `  ${t.padEnd(mx)}  ${String(it.length).padStart(5)}  ${it[0].niche}/${it[0].slug}${it[0].locale ? ` (${it[0].locale})` : ''} — ${it[0].detail.slice(0, 60)}`
    )
  }
  l.push('')
  const bn: Record<string, number> = {}
  for (const g of gaps) bn[g.niche] = (bn[g.niche] ?? 0) + 1
  l.push('  By niche:')
  for (const [n, c] of Object.entries(bn)) l.push(`    ${n.padEnd(20)}  ${c} gap(s)`)
  return l.join('\n')
}

if (process.argv[1]?.endsWith('gap-detector.ts') || import.meta.main) {
  const g = detectGaps()
  console.log(gapSummary(g))
  const ad = join(ROOT, 'artifacts')
  existsSync(ad) || mkdirSync(ad, { recursive: true })
  const rp = join(ad, 'gap-report.json')
  writeFileSync(rp, JSON.stringify(g, null, 2), 'utf-8')
  console.log(`\n  Report written: ${rp}`)
  process.exit(0)
}
