import type { ContentLocale, ContentNode } from './node'

export interface ContentGraph {
  nodes: Map<string, ContentNode>
  collections: {
    featured: ContentNode[]
    byNiche: Record<string, ContentNode[]>
    byLocale: Record<ContentLocale, ContentNode[]>
    public: ContentNode[]
  }
  metadata: {
    totalNodes: number
    lastGenerated: string
    version: string
    packageSources: string[]
  }
}

export interface SerializableContentGraph {
  nodes: Record<string, import('./node').ContentNode>
  collections: {
    featured: string[]
    byNiche: Record<string, string[]>
    byLocale: Record<ContentLocale, string[]>
    public: string[]
  }
  metadata: ContentGraph['metadata']
}
