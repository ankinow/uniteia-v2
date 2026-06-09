import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'

const CONTENT_ROOT = 'content'
const METADATA_ROOT = 'content-metadata'
const LOCALES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const

// Map locale dir name to the ID prefix used in metadata
const LOCALE_ID_MAP: Record<string, string> = {
  en: 'en',
  pt: 'pt-BR',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  ja: 'ja',
  zh: 'zh',
}

// We need to discover all article slugs that DON'T have content-metadata yet
const existingMetadata = new Set(readdirSync(METADATA_ROOT))

// Discover all articles across all niches
interface ArticleInfo {
  slug: string
  niche: string
  titles: Record<string, string>
  summaries: Record<string, string>
}

const articles = new Map<string, ArticleInfo>()

const niches = ['ai-agents', 'llm-comparison', 'cloud-computing', 'virtual-machines']

for (const niche of niches) {
  const nichePath = join(CONTENT_ROOT, niche)
  for (const locale of LOCALES) {
    const localePath = join(nichePath, locale)
    let files: string[]
    try {
      files = readdirSync(localePath).filter(f => f.endsWith('.md') && !f.startsWith('_'))
    } catch {
      continue
    }

    for (const file of files) {
      const slug = basename(file, '.md')

      // Skip if metadata already exists
      if (existingMetadata.has(slug)) continue

      if (!articles.has(slug)) {
        articles.set(slug, {
          slug,
          niche,
          titles: {},
          summaries: {},
        })
      }

      const art = articles.get(slug)!

      // Parse frontmatter to extract title
      const content = readFileSync(join(localePath, file), 'utf-8')
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (fmMatch) {
        const fm = fmMatch[1]
        const titleMatch = fm.match(/title:\s*"([^"]+)"/)
        if (titleMatch) {
          art.titles[locale] = titleMatch[1]
        }
      }

      // Extract the first paragraph as summary
      const bodyStart = content.indexOf('---', 3)
      if (bodyStart > 0) {
        const body = content.slice(bodyStart + 3).trim()
        // Skip the H1 line and get first paragraph
        const lines = body.split('\n').filter(l => l.trim() && !l.startsWith('#'))
        if (lines.length > 0) {
          const summary = lines[0].trim().slice(0, 160)
          art.summaries[locale] = summary
        }
      }
    }
  }
}

// Now generate content-metadata for each article
const NOW = new Date().toISOString()

for (const [slug, info] of articles) {
  const metaDir = join(METADATA_ROOT, slug)
  mkdirSync(metaDir, { recursive: true })

  const nodes: any[] = []

  for (const locale of LOCALES) {
    const localeId = LOCALE_ID_MAP[locale]
    const id = `${localeId}-${slug}`
    const title = info.titles[locale] || info.titles['en'] || slug
    const summary = info.summaries[locale] || info.summaries['en'] || ''

    // Build alternates map (all other locales)
    const alternates: Record<string, string> = {}
    for (const altLocale of LOCALES) {
      if (altLocale === locale) continue
      const altId = LOCALE_ID_MAP[altLocale]
      alternates[altId] = `${altId}-${slug}`
    }

    nodes.push({
      id,
      locale: localeId,
      canonicalLocale: localeId,
      slug,
      canonicalSlug: slug,
      title,
      summary,
      niche: [info.niche],
      tags: [],
      entities: [],
      qualityScore: 95,
      trustScore: 95,
      visibility: 'published',
      lifecycle: 'generated',
      verdict: 'trusted',
      routes: {
        canonical: '',
        aliases: [],
      },
      alternates,
      related: [],
      seo: {
        noindex: false,
        priority: 65,
      },
      timestamps: {
        createdAt: NOW,
        updatedAt: NOW,
      },
      metrics: {
        edgeRank: 0,
        semanticDensity: 0,
        freshnessScore: 0,
        graphScore: 0,
      },
    })
  }

  writeFileSync(join(metaDir, 'content-nodes.json'), JSON.stringify(nodes, null, 2) + '\n')
  console.log(`✅ Generated metadata: ${metaDir}/content-nodes.json (${nodes.length} nodes)`)
}

console.log(`\n🎯 Total articles processed: ${articles.size}`)
