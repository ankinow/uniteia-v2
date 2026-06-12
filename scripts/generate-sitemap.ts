import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { contentGraphData } from '../src/content-graph.generated'
import { buildRobotsTxt, formatSitemapDate } from '../src/utils/sitemap-builder'

const ALL_LOCALES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const
const APEX_DOMAIN = 'uniteia.com'

interface SitemapEntry {
  lang: string
  slug: string
  updatedAt: string | undefined
}

async function generateSitemapForLocale(buildLocale: string, distDir: string) {
  const origin = `https://${buildLocale}.${APEX_DOMAIN}`
  const today = new Date().toISOString().split('T')[0]

  const localeNodes = contentGraphData.nodes.filter(n => n.locale === buildLocale)

  // Group nodes by canonicalSlug for hreflang alternates
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

  // Collect unique niches for this locale
  const allNiches = new Set<string>()
  for (const node of localeNodes) {
    for (const n of node.niche) allNiches.add(n)
  }

  const getLocaleOrigin = (code: string) => `https://${code}.${APEX_DOMAIN}`
  const entries: string[] = []

  // Home page
  entries.push(
    `  <url>\n    <loc>${origin}/${buildLocale}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`
  )

  // Signals index
  entries.push(
    `  <url>\n    <loc>${origin}/${buildLocale}/signals</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`
  )

  // Niche listing pages
  for (const niche of allNiches) {
    entries.push(
      `  <url>\n    <loc>${origin}/${buildLocale}/signals/${niche}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`
    )
  }

  // Legal pages
  for (const legalSlug of ['privacy', 'terms']) {
    entries.push(
      `  <url>\n    <loc>${origin}/${buildLocale}/${legalSlug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.3</priority>\n  </url>`
    )
  }

  // Articles
  const publicNodes = localeNodes.filter(n => n.visibility === 'published')
  for (const node of publicNodes) {
    const firstNiche = node.niche[0] ?? 'apex'
    const loc = `${origin}/${node.locale}/signals/${firstNiche}/${node.slug}`
    const lastmodDate = formatSitemapDate(node.timestamps.updatedAt)
    const lastmod = lastmodDate ? `    <lastmod>${lastmodDate}</lastmod>\n` : ''

    // hreflang alternates
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

  // Write locale-specific sitemap
  const filename = buildLocale === 'en' ? 'sitemap.xml' : `sitemap-${buildLocale}.xml`
  await writeFile(join(distDir, filename), sitemap)
  console.log(`  ✅ dist/${filename} (${publicNodes.length} articles, ${entries.length} URLs)`)
}

async function generate() {
  const buildLocale = process.env.LOCALE || 'en'
  const origin = `https://${buildLocale}.${APEX_DOMAIN}`
  const distDir = join(process.cwd(), 'dist')

  console.log(`📍 Generating SEO files for all 8 locales (build=${buildLocale})...`)

  // Generate sitemap for ALL locales (not just build locale)
  for (const locale of ALL_LOCALES) {
    await generateSitemapForLocale(locale, distDir)
  }

  // Default sitemap.xml = build locale's sitemap (already written as sitemap.xml for en)
  // For non-en build locale, copy it as sitemap.xml too
  if (buildLocale !== 'en') {
    const buildSitemap = `sitemap-${buildLocale}.xml`
    const { copyFile } = await import('node:fs/promises')
    await copyFile(join(distDir, buildSitemap), join(distDir, 'sitemap.xml'))
    console.log(`  📋 dist/sitemap.xml → copy of dist/${buildSitemap}`)
  }

  // Robots.txt
  const robots = buildRobotsTxt(origin)
  await writeFile(join(distDir, 'robots.txt'), robots)
  console.log('✅ dist/robots.txt generated')

  // Sitemap index for discovery (links to all locale sitemaps)
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ALL_LOCALES.map(loc => `  <sitemap>
    <loc>https://${loc}.${APEX_DOMAIN}/sitemap.xml</loc>
  </sitemap>`).join('\n')}
</sitemapindex>`
  await writeFile(join(distDir, 'sitemap-index.xml'), sitemapIndex)
  console.log('✅ dist/sitemap-index.xml generated (all 8 locales)')
  console.log(`   Submit to Google: https://en.uniteia.com/sitemap-index.xml`)
}

generate()
