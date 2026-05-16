import type { GraphEdge } from './edge'
import type { ContentGroupCollection } from './group'
import type { ContentLocale, ContentNode } from './node'

export interface SerializableGraphV1 {
  version: 'content-graph.v1'
  generatedAt: string
  nodes: ContentNode[]
  edges: GraphEdge[]
  groups?: ContentGroupCollection
  indexes: {
    byId: Record<string, number>
    bySlug: Record<string, string>
    byRoute: Record<string, string>
    byLocale: Record<ContentLocale, string[]>
    byNiche: Record<string, string[]>
    byTag: Record<string, string[]>
    public: string[]
    sitemapEligible: string[]
  }
}

export interface RouteManifestV1 {
  version: 'route-manifest.v1'
  generatedAt: string
  routes: Record<
    string,
    {
      nodeId: string
      locale: ContentLocale
      canonical: string
      aliases: string[]
      noindex: boolean
      sitemapEligible: boolean
    }
  >
}

export interface LocaleIndexV1 {
  version: 'locale-index.v1'
  generatedAt: string
  alternates: Record<string, Partial<Record<ContentLocale, string>>>
}

export interface TaxonomyIndexV1 {
  version: 'taxonomy-index.v1'
  generatedAt: string
  byNiche: Record<string, string[]>
  byTag: Record<string, string[]>
}

export interface RelatedIndexV1 {
  version: 'related-index.v1'
  generatedAt: string
  related: Record<string, string[]>
}

export interface VisibilityIndexV1 {
  version: 'visibility-index.v1'
  generatedAt: string
  public: string[]
  noindex: string[]
  sitemapEligible: string[]
  draft: string[]
}
