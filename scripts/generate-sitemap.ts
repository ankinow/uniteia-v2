import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { contentGraphData } from '../src/content-graph.generated'
import { buildRobotsTxt, formatSitemapDate } from '../src/utils/sitemap-builder'

interface SitemapEntry {
  lang: string
  slug: string
  updatedAt: string | undefined
}

async function generate() {
  const buildLocale = process.env.LOCALE || 'en'
  // Single-locale: use subdomain origin (e.g., https://pt.uniteia.com)
  // Multi-locale fallback: use configured DOMAIN or uniteia.com
  const origin =
    process.env.DOMAIN ||
    (buildLocale ? `https://${buildLocale}.uniteia.com` : 'https://uniteia.com')
  const apexDomain = 'uniteia.com'
  const distDir = join(process.cwd(), 'dist')
  const today = new Date().toISOString().split('T')[0]

  console.log(`📍 Generating SEO files for locale=${buildLocale} origin=${origin}...`)

  // Filter nodes to build locale only
  const localeNodes = buildLocale
    ? contentGraphData.nodes.filter(n => n.locale === buildLocale)
    : contentGraphData.nodes

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

    // Collect unique niches from locale nodes
    const allNiches = new Set<string>()
    for (const node of localeNodes) {
      for (const n of node.niche) {
        allNiches.add(n)
      }
    }

    // Get locale origin for hreflang
    const getLocaleOrigin = (code: string) => `https://${code}.${apexDomain}`

    const entries: string[] = []

    // Root — only for multi-locale or build locale home
    if (!buildLocale) {
      entries.push(
        `  <url>\n    <loc>${origin}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`
      )
    }

    // Home page for build locale
    entries.push(
      `  <url>\n    <loc>${origin}/${buildLocale}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`
    )

    // Signals index for build locale
    entries.push(
      `  <url>\n    <loc>${origin}/${buildLocale}/signals</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`
    )

    // Niche listing pages for build locale
    for (const niche of allNiches) {
      entries.push(
        `  <url>\n    <loc>${origin}/${buildLocale}/signals/${niche}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`
      )
    }

    // Legal pages for build locale
    for (const legalSlug of ['privacy', 'terms']) {
      entries.push(
        `  <url>\n    <loc>${origin}/${buildLocale}/${legalSlug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.3</priority>\n  </url>`
      )
    }

    // Build sitemap entries from graph data — articles for build locale
    const publicNodes = localeNodes.filter(n => n.visibility === 'published')

    for (const node of publicNodes) {
      const firstNiche = node.niche[0] ?? 'apex'
      const loc = `${origin}/${node.locale}/signals/${firstNiche}/${node.slug}`
      const lastmodDate = formatSitemapDate(node.timestamps.updatedAt)
      const lastmod = lastmodDate ? `    <lastmod>${lastmodDate}</lastmod>\n` : ''

      // hreflang alternates pointing to locale subdomains
      const group = byCanonical.get(node.canonicalSlug) ?? []
      const hreflangLines = group
        .filter(v => v.lang !== node.locale)
        .map(
          v =>
            `    <xhtml:link rel="alternate" hreflang="${v.lang}" href="${getLocaleOrigin(v.lang)}/${v.lang}/signals/${firstNiche}/${v.slug}" />`
        )

      const hasEn = group.some(v => v.lang === 'en')
      if (hasEn) {
        const enSlug = group.find(v => v.lang === 'en')?.slug ?? node.slug
        hreflangLines.push(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${getLocaleOrigin('en')}/en/signals/${firstNiche}/${enSlug}" />`
        )
      }

      entries.push(
        `  <url>\n    <loc>${loc}</loc>\n${lastmod}    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n${hreflangLines.join('\n')}\n  </url>`
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
