import type { ContentLocale } from './node'

export type CollectionKind = 'home' | 'niche' | 'taxonomy' | 'article' | 'sitemap'

export interface CollectionQuery {
  kind: CollectionKind
  locale: ContentLocale
  niche?: string
  tag?: string
  limit?: number
  includeDrafts?: boolean
}

export interface PageQuery {
  kind: 'article'
  locale: ContentLocale
  niche: string
  slug: string
  includeDrafts?: boolean
}

export interface StaticParamsQuery {
  kind: 'article' | 'niche' | 'taxonomy'
  locales?: ContentLocale[]
}
