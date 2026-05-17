import type { ContentNode } from './node'

export interface ContentGraph {
  nodes: ContentNode[]
  groups: Map<string, ContentNode[]> // by canonicalSlug
  niches: Map<string, ContentNode[]>
}

export interface SerializableContentGraph {
  nodes: Record<string, ContentNode>
  groups: Record<string, string[]> // by canonicalSlug, array of node IDs
  niches: Record<string, string[]> // by niche name, array of node IDs
}
