export function formatSitemapDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined

  const timestamp = Date.parse(dateStr)
  if (!Number.isFinite(timestamp)) return undefined

  return new Date(timestamp).toISOString().split('T')[0]
}

export function buildRobotsTxt(origin: string): string {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /build/
Sitemap: ${origin}/sitemap-index.xml
`
}
