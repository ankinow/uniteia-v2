import type { ContentLocale, ContentNode } from './node'

export interface ContentGraphQuery {
  locale?: ContentLocale
  niche?: string
  tag?: string
  limit?: number
  offset?: number
  visibility?: 'public' | 'all'
}

export interface ContentGraphProvider {
  getNode(id: string): ContentNode | undefined
  getNodes(query?: ContentGraphQuery): ContentNode[]
  getByNiche(niche: string, query?: ContentGraphQuery): ContentNode[]
  getByLocale(locale: ContentLocale, query?: ContentGraphQuery): ContentNode[]
  getFeatured(query?: ContentGraphQuery): ContentNode[]
  getRelated(nodeId: string): ContentNode[]
  getTotalCount(): number
}
