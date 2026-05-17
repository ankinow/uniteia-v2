import type { ContentLocale, ContentNode } from './node'

export interface NavigationItem {
  nicheSlug: string
  label: string
  href: string
  articleCount: number
  avgGraphScore: number
}

export interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  alternates?: Array<{ hreflang: string; href: string }>
}

export interface ContentGraphQuery {
  locale?: ContentLocale
  niche?: string
  tag?: string
  limit?: number
  offset?: number
  visibility?: 'public' | 'all'
}

export interface ContentGraphProvider {
  // Spec methods
  getNode(slug: string, locale?: ContentLocale): ContentNode | null
  getGroup(canonicalSlug: string): ContentNode[] | null // all locales
  getPublicNodes(locale: ContentLocale, filters?: { niche?: string; limit?: number }): ContentNode[]
  getHomepageProjection(locale: ContentLocale): {
    featured: ContentNode[] // by graphScore
    clusters: Array<{ niche: string; nodes: ContentNode[] }>
    frontier: ContentNode[] // by freshness
  }
  getNavigation(): NavigationItem[]
  getRelated(fromId: string, locale: ContentLocale, limit?: number): ContentNode[]
  getSitemapEntries(): SitemapEntry[]
  isPublic(node: ContentNode): boolean // quality + visibility + locales complete

  // Legacy/compatibility methods
  getNodes(query?: ContentGraphQuery): ContentNode[]
  getByNiche(niche: string, query?: ContentGraphQuery): ContentNode[]
  getByLocale(locale: ContentLocale, query?: ContentGraphQuery): ContentNode[]
  getFeatured(query?: ContentGraphQuery): ContentNode[]
  getTotalCount(): number
}
