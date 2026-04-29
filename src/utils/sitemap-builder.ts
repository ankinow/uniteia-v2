import { SUPPORTED_LANGUAGES } from '~/i18n/types'
import { listNicheArticles } from '~/utils/content-loader'
import { parseHost } from '~/utils/host-parser'
import { generateHreflangLinks } from '~/utils/hreflang'

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function formatSitemapDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined

  const timestamp = Date.parse(dateStr)
  if (!Number.isFinite(timestamp)) return undefined

  return new Date(timestamp).toISOString().split('T')[0]
}

export async function buildSitemapXml(origin: string, host: string): Promise<string> {
  const { niche } = parseHost(host)
  const articles = await listNicheArticles(niche)

  const articlesBySlug = articles.reduce(
    (acc, article) => {
      const slug = article.slug
      if (!acc[slug]) acc[slug] = []
      acc[slug]?.push(article)
      return acc
    },
    {} as Record<string, typeof articles>
  )

  const entries: string[] = []

  entries.push(
    `  <url>\n    <loc>${escapeXML(`${origin}/`)}</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`
  )

  for (const l of SUPPORTED_LANGUAGES) {
    entries.push(
      `  <url>\n    <loc>${escapeXML(`${origin}/${l.code}/n`)}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`
    )
  }

  for (const article of articles) {
    const loc = `${origin}/${article.lang}/${article.slug}`
    const alternates = articlesBySlug[article.slug] || []
    const langCodes = alternates.map(a => a.lang)
    const hreflangLinks = generateHreflangLinks(niche, article.slug, langCodes, origin)
    const lastmodDate = formatSitemapDate(article.updatedAt)
    const lastmod = lastmodDate ? `    <lastmod>${lastmodDate}</lastmod>\n` : ''

    entries.push(
      `  <url>\n    <loc>${escapeXML(loc)}</loc>\n${lastmod}    <changefreq>weekly</changefreq>\n    <priority>${article.slug === '_index' ? '0.9' : '0.7'}</priority>\n${hreflangLinks
        .map(
          link =>
            `    <xhtml:link rel="alternate" hreflang="${link.hreflang}" href="${escapeXML(link.href)}" />`
        )
        .join('\n')}\n  </url>`
    )
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>`
}

export function buildRobotsTxt(origin: string): string {
  return `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`
}
