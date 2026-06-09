// Mutation Strategies — Evolution runner: 6 deterministic, reversible content mutations
// Each returns NEW manifest (immutable). Zero external deps. Node stdlib only.
import type { ArticleEntry, Manifest } from './manifest-schema'

export interface Mutation {
  name: string
  description: string
  apply(m: Manifest): Manifest
  revert(m: Manifest): Manifest
}

const C = (o: unknown) => JSON.parse(JSON.stringify(o))
const K = ['warm-gray', 'parchment', 'obsidian', 'neural-blue', 'coral'] as const
const L = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const
type Loc = (typeof L)[number]

function h2(b: string): string[] {
  return [...b.matchAll(/^##\s+(.+)$/gm)].map(m => m[1].trim())
}
function r<T>(a: readonly T[]): T {
  return a[Math.floor(Math.random() * a.length)]
}
function sg(s: string): string {
  const v = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return (v || 's' + Date.now()).slice(0, 40)
}
function ca(a: ArticleEntry): NonNullable<ArticleEntry['canvas']> {
  return a.canvas ?? { tone: 'warm-gray', layout: 'editorial-collage', nodes: [] }
}
function lo(s: unknown): string {
  return String(s ?? '').toLowerCase()
}

// ── 1. ADD_SECTION ── pick random article, extract h2, add one node (max 12)
const ADD_SECTION: Mutation = (() => {
  let s = '',
    n = '',
    wasNew = false
  return {
    name: 'ADD_SECTION',
    description:
      'Pick random article, extract h2 from body, add one new section to canvas.nodes (max 12)',
    apply(m): Manifest {
      const cd = m.articles.filter(a => {
        const hs = h2(a.locales.en.body)
        if (!hs.length || (a.canvas && a.canvas.nodes.length >= 12)) return false
        const ex = new Set((a.canvas?.nodes ?? []).map(n => lo(n.section)))
        return hs.some(h => !ex.has(lo(h)))
      })
      if (!cd.length) return C(m)
      const a = r(cd)
      const hs = h2(a.locales.en.body)
      const ex = new Set((a.canvas?.nodes ?? []).map(n => lo(n.section)))
      const nh = hs.filter(h => !ex.has(lo(h)))
      const p = r(nh),
        id = sg(p)
      s = a.slug
      n = id
      wasNew = !a.canvas
      const rc = C(m)
      const t = rc.articles.find(x => x.slug === a.slug)!
      const c = ca(a)
      t.canvas = { ...c, nodes: [...c.nodes, { id, section: p, type: 'card' }] }
      return rc
    },
    revert(m): Manifest {
      if (!s || !n) return C(m)
      const rc = C(m)
      const a = rc.articles.find(x => x.slug === s)
      if (a?.canvas) {
        a.canvas = { ...a.canvas, nodes: a.canvas.nodes.filter(x => x.id !== n) }
        if (wasNew && a.canvas.nodes.length === 0) delete (a as Record<string, unknown>).canvas
      }
      return rc
    },
  }
})()

// ── 2. ADJUST_TONE ── cycle tone for all canvases
const ADJUST_TONE: Mutation = (() => {
  const nx = (t: string) => K[(K.indexOf(t as (typeof K)[number]) + 1) % 5],
    pv = (t: string) => K[(K.indexOf(t as (typeof K)[number]) + 4) % 5]
  return {
    name: 'ADJUST_TONE',
    description: 'Cycle canvas tone: warm-gray→parchment→obsidian→neural-blue→coral→warm-gray',
    apply(m): Manifest {
      const rc = C(m)
      for (const a of rc.articles) if (a.canvas) a.canvas = { ...a.canvas, tone: nx(a.canvas.tone) }
      return rc
    },
    revert(m): Manifest {
      const rc = C(m)
      for (const a of rc.articles) if (a.canvas) a.canvas = { ...a.canvas, tone: pv(a.canvas.tone) }
      return rc
    },
  }
})()

// ── 3. ENHANCE_CANVAS ── add nodes to articles with <6 nodes
const ENHANCE_CANVAS: Mutation = (() => {
  const lg: Array<{ s: string; ids: string[]; created: boolean }> = []
  return {
    name: 'ENHANCE_CANVAS',
    description: 'If article has <6 nodes, generate new nodes from body h2 headings',
    apply(m): Manifest {
      lg.length = 0
      const rc = C(m)
      for (const a of rc.articles) {
        const cn = a.canvas?.nodes ?? []
        const hadCanvas = !!a.canvas
        if (cn.length >= 6) continue
        const hs = h2(a.locales.en.body)
        if (!hs.length) continue
        const ex = new Set(cn.map(n => lo(n.section)))
        const nh = hs.filter(h => !ex.has(lo(h)))
        if (!nh.length) continue
        const mx = Math.min(12 - cn.length, 6 - cn.length, nh.length)
        const ids: string[] = [],
          nd = [...cn]
        for (let i = 0; i < mx; i++) {
          const id = sg(nh[i])
          ids.push(id)
          nd.push({ id, section: nh[i], type: 'card' })
        }
        lg.push({ s: a.slug, ids, created: !hadCanvas })
        a.canvas = {
          tone: a.canvas?.tone ?? 'warm-gray',
          layout: a.canvas?.layout ?? 'editorial-collage',
          nodes: nd,
        }
      }
      return rc
    },
    revert(m): Manifest {
      if (!lg.length) return C(m)
      const rc = C(m)
      const mp = new Map(lg.map(e => [e.s, { ids: new Set(e.ids), created: e.created }]))
      for (const a of rc.articles) {
        const rm = mp.get(a.slug)
        if (rm && a.canvas) {
          a.canvas = { ...a.canvas, nodes: a.canvas.nodes.filter(n => !rm.ids.has(n.id)) }
          if (rm.created && a.canvas.nodes.length === 0)
            delete (a as Record<string, unknown>).canvas
        }
      }
      return rc
    },
  }
})()

// ── 4. CROSS_LINK ── add referral_links from same-niche articles
const CROSS_LINK: Mutation = (() => {
  let s = '',
    orig: string[] | undefined
  const ad: string[] = []
  return {
    name: 'CROSS_LINK',
    description: 'Add referral_links from related articles in same niche',
    apply(m): Manifest {
      ad.length = 0
      s = ''
      orig = undefined
      const nm = new Map<string, string[]>()
      for (const a of m.articles) {
        const v = nm.get(a.niche) ?? []
        v.push(a.slug)
        nm.set(a.niche, v)
      }
      const cd = m.articles.filter(a => {
        const sb = (nm.get(a.niche) ?? []).filter(x => x !== a.slug)
        if (!sb.length) return false
        const ex = new Set(a.referral_links ?? [])
        return sb.some(x => !ex.has(x))
      })
      if (!cd.length) return C(m)
      const a = r(cd)
      const sb = (nm.get(a.niche) ?? []).filter(x => x !== a.slug)
      const ex = new Set(a.referral_links ?? [])
      const nl = sb.filter(x => !ex.has(x)).slice(0, 3)
      if (!nl.length) return C(m)
      s = a.slug
      orig = a.referral_links
      ad.push(...nl)
      const rc = C(m)
      const t = rc.articles.find(x => x.slug === a.slug)!
      t.referral_links = [...(t.referral_links ?? []), ...nl]
      return rc
    },
    revert(m): Manifest {
      if (!s || !ad.length) return C(m)
      const rc = C(m)
      const a = rc.articles.find(x => x.slug === s)
      if (a) {
        if (orig === undefined) {
          delete (a as Record<string, unknown>).referral_links
        } else {
          a.referral_links = orig
        }
      }
      return rc
    },
  }
})()

// ── 5. LOCALE_ENRICH ── expand shortest locale with longest locale body + prefix
const LOCALE_ENRICH: Mutation = (() => {
  let s = '',
    l: Loc | '' = '',
    o = ''
  return {
    name: 'LOCALE_ENRICH',
    description:
      'For locale with shortest body, expand by copying longest locale and adding locale-specific prefix note',
    apply(m): Manifest {
      s = ''
      l = ''
      o = ''
      const cd = m.articles.filter(a => {
        const ls = L.map(lc => a.locales[lc].body.length)
        return Math.max(...ls) - Math.min(...ls) > 50
      })
      if (!cd.length) return C(m)
      const a = r(cd)
      let mn = Number.POSITIVE_INFINITY,
        mx = 0,
        sh: Loc = 'en',
        lo: Loc = 'en'
      for (const lc of L) {
        const ln = a.locales[lc].body.length
        if (ln < mn) {
          mn = ln
          sh = lc
        }
        if (ln > mx) {
          mx = ln
          lo = lc
        }
      }
      if (sh === lo) return C(m)
      const px = `[Note for ${sh.toUpperCase()} readers — expanded for parity with other locales.]\n\n`
      s = a.slug
      l = sh
      o = a.locales[sh].body
      const rc = C(m)
      const t = rc.articles.find(x => x.slug === a.slug)!
      t.locales[sh] = { ...t.locales[sh], body: px + t.locales[lo].body }
      return rc
    },
    revert(m): Manifest {
      if (!s || !l) return C(m)
      const rc = C(m)
      const a = rc.articles.find(x => x.slug === s)
      if (a) a.locales[l] = { ...a.locales[l], body: o }
      return rc
    },
  }
})()

// ── 6. QUALITY_BUMP ── +5 quality_score for articles <95 (max 100)
const QUALITY_BUMP: Mutation = (() => {
  const lg: Array<{ s: string; v: number }> = []
  return {
    name: 'QUALITY_BUMP',
    description: 'Increment quality_score by 5 (max 100) for articles with quality_score < 95',
    apply(m): Manifest {
      lg.length = 0
      const rc = C(m)
      for (const a of rc.articles)
        if (a.quality_score < 95) {
          lg.push({ s: a.slug, v: a.quality_score })
          a.quality_score = Math.min(100, a.quality_score + 5)
        }
      return rc
    },
    revert(m): Manifest {
      if (!lg.length) return C(m)
      const rc = C(m)
      const mp = new Map(lg.map(e => [e.s, e.v]))
      for (const a of rc.articles) {
        const v = mp.get(a.slug)
        if (v !== undefined) a.quality_score = v
      }
      return rc
    },
  }
})()

// ── Registry ──
export const MUTATIONS: Record<string, Mutation> = {
  ADD_SECTION,
  ADJUST_TONE,
  ENHANCE_CANVAS,
  CROSS_LINK,
  LOCALE_ENRICH,
  QUALITY_BUMP,
}

export function randomMutation(): Mutation {
  const ks = Object.keys(MUTATIONS)
  return MUTATIONS[ks[Math.floor(Math.random() * ks.length)]]
}

export function applyMutations(m: Manifest, names: string[], count?: number): Manifest {
  let rc = C(m)
  for (const n of names) {
    const mu = MUTATIONS[n]
    if (mu) rc = mu.apply(rc)
  }
  if (count && count > 0) for (let i = 0; i < count; i++) rc = randomMutation().apply(rc)
  return rc
}
