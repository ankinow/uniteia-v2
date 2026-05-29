import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { contentGraphData } from '../src/content-graph.generated'
import { SUPPORTED_LANGUAGES } from '../src/i18n/types'
import { buildRobotsTxt, formatSitemapDate } from '../src/utils/sitemap-builder'

interface SitemapEntry {
  lang: string
  slug: string
  updatedAt: string | undefined
}

async function generate() {
  const origin = process.env.DOMAIN || 'https://uniteia.com'
  const distDir = join(process.cwd(), 'dist')
  const today = new Date().toISOString().split('T')[0]

  console.log(`📍 Generating SEO files for ${origin}...`)

  try {
    // Group nodes by canonicalSlug for locale-aware URL generation
    const byCanonical = new Map<string, SitemapEntry[]>()
    for (const node of contentGraphData.nodes) {
      const key = node.canonicalSlug
      if (!byCanonical.has(key)) byCanonical.set(key, [])
      byCanonical.get(key)?.push({
        lang: node.locale,
        slug: node.slug,
        updatedAt: node.timestamps.updatedAt,
      })
    }

    // Collect unique niches from all nodes
    const allNiches = new Set<string>()
    for (const node of contentGraphData.nodes) {
      for (const n of node.niche) {
        allNiches.add(n)
      }
    }

    const entries: string[] = []
    // Root — priority 0.9
    entries.push(
      `  <url>
    <loc>${origin}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
    )

    // Language index pages — priority 0.8
    for (const l of SUPPORTED_LANGUAGES) {
      entries.push(
        `  <url>
    <loc>${origin}/${l.code}/signals</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
      )
    }

    // Niche listing pages — priority 0.6
    for (const l of SUPPORTED_LANGUAGES) {
      for (const niche of allNiches) {
        entries.push(
          `  <url>
    <loc>${origin}/${l.code}/signals/${niche}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
        )
      }
    }

    // Legal pages (privacy, terms) — priority 0.3
    for (const l of SUPPORTED_LANGUAGES) {
      for (const legalSlug of ['privacy', 'terms']) {
        entries.push(
          `  <url>
    <loc>${origin}/${l.code}/${legalSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>`
        )
      }
    }

    // Build sitemap entries from graph data — articles, priority 0.8
    for (const nodeId of contentGraphData.indexes.sitemapEligible) {
      const idx = contentGraphData.indexes.byId[nodeId]
      if (idx === undefined) continue
      const node = contentGraphData.nodes[idx]
      if (!node) continue

      const firstNiche = node.niche[0] ?? 'apex'
      const loc = `${origin}/${node.locale}/signals/${firstNiche}/${node.slug}`
      const lastmodDate = formatSitemapDate(node.timestamps.updatedAt)
      const lastmod = lastmodDate ? `    <lastmod>${lastmodDate}</lastmod>\n` : ''

      const group = byCanonical.get(node.canonicalSlug) ?? []
      const hreflangLines = group
        .filter(v => v.lang !== node.locale)
        .map(
          v =>
            `    <xhtml:link rel="alternate" hreflang="${v.lang}" href="${origin}/${v.lang}/signals/${firstNiche}/${v.slug}" />`
        )

      const hasEn = group.some(v => v.lang === 'en')
      if (hasEn) {
        const enSlug = group.find(v => v.lang === 'en')?.slug ?? node.slug
        hreflangLines.push(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/en/signals/${firstNiche}/${enSlug}" />`
        )
      }

      entries.push(
        `  <url>
    <loc>${loc}</loc>
${lastmod}    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${hreflangLines.join('\n')}
  </url>`
      )
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>`

    await writeFile(join(distDir, 'sitemap.xml'), sitemap)
    console.log('✅ dist/sitemap.xml generated')

    const robots = buildRobotsTxt(origin)
    await writeFile(join(distDir, 'robots.txt'), robots)
    console.log('✅ dist/robots.txt generated')
  } catch (err) {
    console.error('❌ Failed to generate SEO files:', err)
    process.exit(1)
  }
}

generate()
