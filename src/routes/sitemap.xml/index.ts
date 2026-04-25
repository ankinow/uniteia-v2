import type { RequestHandler } from '@builder.io/qwik-city'
import { parseHost } from '~/utils/host-parser'
import { listNicheArticles } from '~/utils/content-loader'

export const onGet: RequestHandler = async ({ url, send, headers }) => {
  const { niche } = parseHost(url.host)
  const articles = await listNicheArticles(niche)

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${url.origin}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${articles
    .map((article) => {
      const loc = `${url.origin}/${article.lang}/${article.slug}`
      return `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    })
    .join('\n')}
</urlset>`

  headers.set('Content-Type', 'text/xml; charset=utf-8')
  headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  send(200, sitemap)
}
