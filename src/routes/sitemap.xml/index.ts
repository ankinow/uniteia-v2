import type { RequestHandler } from '@builder.io/qwik-city'
import { SUPPORTED_LANGUAGES } from '~/i18n/types'
import { listNicheArticles } from '~/utils/content-loader'
import { parseHost } from '~/utils/host-parser'
import { generateHreflangLinks } from '~/utils/hreflang'

export const onGet: RequestHandler = async ({ url, send, headers }) => {
  const { niche } = parseHost(url.host)
  const articles = await listNicheArticles(niche)

  // Group articles by slug to find alternates
  const articlesBySlug = articles.reduce(
    (acc, article) => {
      const slug = article.slug
      if (!acc[slug]) acc[slug] = []
      acc[slug]?.push(article)
      return acc
    },
    {} as Record<string, typeof articles>
  )

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${url.origin}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${SUPPORTED_LANGUAGES.map(
    l => `  <url>
    <loc>${url.origin}/${l.code}/n</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  ).join('\n')}
  ${articles
    .map(article => {
      const loc = `${url.origin}/${article.lang}/${article.slug}`
      const alternates = articlesBySlug[article.slug] || []
      const langCodes = alternates.map(a => a.lang)
      const hreflangLinks = generateHreflangLinks(niche, article.slug, langCodes, url.origin)
      const lastmod = article.updatedAt
        ? `<lastmod>${article.updatedAt.split('T')[0]}</lastmod>`
        : ''

      return `  <url>
    <loc>${loc}</loc>
    ${lastmod}
    <changefreq>weekly</changefreq>
    <priority>${article.slug === '_index' ? '0.9' : '0.7'}</priority>
    ${hreflangLinks
      .map(link => `<xhtml:link rel="alternate" hreflang="${link.hreflang}" href="${link.href}" />`)
      .join('')}
  </url>`
    })
    .join('\n')}
</urlset>`

  headers.set('Content-Type', 'text/xml; charset=utf-8')
  headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  send(200, sitemap)
}
