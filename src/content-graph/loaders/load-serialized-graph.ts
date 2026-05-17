import { deserializeGraph } from '../compiler/compile-content-graph'
import type { SerializableGraphV1 } from '../contracts/artifacts'
import type { SerializableContentGraph } from '../contracts/graph'

export function loadSerializedGraph(serialized: SerializableGraphV1) {
  // Convert SerializableGraphV1 (array-based) to SerializableContentGraph (record-based)
  const nodeEntries: Record<string, import('../contracts/node').ContentNode> = {}
  for (const node of serialized.nodes) {
    nodeEntries[node.id] = node
  }

  // Reconstruct groups from the serialized graph
  // Groups are derived from canonicalSlug — all nodes sharing the same canonicalSlug form a group
  const groupMap = new Map<string, string[]>()
  for (const node of serialized.nodes) {
    const key = node.canonicalSlug
    const list = groupMap.get(key) ?? []
    list.push(node.id)
    groupMap.set(key, list)
  }

  const groupsObj: Record<string, string[]> = {}
  for (const [key, ids] of groupMap.entries()) {
    groupsObj[key] = ids
  }

  // Reconstruct niches from node.niche arrays
  const nichesObj: Record<string, string[]> = {}
  // Use serialized.indexes.byNiche as the authoritative niche index when available
  if (serialized.indexes.byNiche && Object.keys(serialized.indexes.byNiche).length > 0) {
    for (const [niche, ids] of Object.entries(serialized.indexes.byNiche)) {
      nichesObj[niche] = ids
    }
  } else {
    // Fallback: compute from node data
    for (const node of serialized.nodes) {
      for (const niche of node.niche) {
        const list = nichesObj[niche] ?? []
        if (!list.includes(node.id)) list.push(node.id)
        nichesObj[niche] = list
      }
    }
  }

  const serializable: SerializableContentGraph = {
    nodes: nodeEntries,
    groups: groupsObj,
    niches: nichesObj,
  }

  const graph = deserializeGraph(serializable)

  // Attach metadata from SerializableGraphV1 onto the deserialized graph
  // ContentGraph interface doesn't include metadata directly, but the provider
  // uses graph.nodes which is now correct
  return graph
}
