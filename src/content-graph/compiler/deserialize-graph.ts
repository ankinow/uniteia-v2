import type { ContentGraph } from '../contracts/graph'
import type { ContentNode } from '../contracts/node'

/**
 * Deserializes a ContentGraph from its serializable representation.
 * Pure function — no markdown parsing, no gray-matter dependency.
 * Separated from compile-content-graph.ts to prevent gray-matter from
 * leaking into runtime bundles.
 */
// biome-ignore lint/suspicious/noExplicitAny: serialized is dynamic untrusted JSON payload
export function deserializeGraph(serialized: any): ContentGraph {
  const nodesMap = new Map<string, ContentNode>()
  const nodesArr: ContentNode[] = []

  const rawNodes = Array.isArray(serialized.nodes)
    ? serialized.nodes
    : Object.values(serialized.nodes || {})

  for (const node of rawNodes) {
    const n = node as ContentNode
    nodesMap.set(n.id, n)
    nodesArr.push(n)
  }

  const decoratedNodesArr = nodesArr as ContentNode[] & {
    get(id: string): ContentNode | undefined
    has(id: string): boolean
  }
  decoratedNodesArr.get = (id: string) => nodesMap.get(id)
  decoratedNodesArr.has = (id: string) => nodesMap.has(id)

  const groupsMap = new Map<string, ContentNode[]>()
  const groupsSource = serialized.groups || {}

  if (Array.isArray(groupsSource.groups)) {
    for (const g of groupsSource.groups) {
      const gNodes = (g.nodes || [])
        // biome-ignore lint/suspicious/noExplicitAny: nodes list can contain raw IDs or objects
        .map((n: any) => (typeof n === 'string' ? nodesMap.get(n) : nodesMap.get(n.id)))
        .filter(Boolean) as ContentNode[]
      groupsMap.set(g.canonicalSlug, gNodes)
    }
  } else {
    for (const [key, ids] of Object.entries(groupsSource)) {
      if (Array.isArray(ids)) {
        groupsMap.set(key, ids.map(id => nodesMap.get(id)).filter(Boolean) as ContentNode[])
      }
    }
  }

  const nichesMap = new Map<string, ContentNode[]>()
  const nichesSource =
    serialized.niches || serialized.indexes?.byNiche || serialized.collections?.byNiche || {}
  for (const [key, ids] of Object.entries(nichesSource)) {
    if (Array.isArray(ids)) {
      nichesMap.set(
        key,
        ids
          // biome-ignore lint/suspicious/noExplicitAny: id can be raw string or object wrapper
          .map(id => (typeof id === 'string' ? nodesMap.get(id) : nodesMap.get((id as any).id)))
          .filter(Boolean) as ContentNode[]
      )
    }
  }

  // Fallback: reconstruct groups from canonicalSlug if not provided
  if (groupsMap.size === 0) {
    for (const node of nodesArr) {
      const key = node.canonicalSlug
      const group = groupsMap.get(key) ?? []
      group.push(node)
      groupsMap.set(key, group)
    }
  }

  // Fallback: reconstruct niches from node.niche arrays if not provided
  if (nichesMap.size === 0) {
    for (const node of nodesArr) {
      for (const niche of node.niche) {
        const list = nichesMap.get(niche) ?? []
        list.push(node)
        nichesMap.set(niche, list)
      }
    }
  }

  return {
    nodes: decoratedNodesArr,
    groups: groupsMap,
    niches: nichesMap,
  }
}
