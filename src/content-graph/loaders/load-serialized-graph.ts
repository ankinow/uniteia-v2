import { deserializeGraph } from '../compiler/compile-content-graph'
import type { SerializableGraphV1 } from '../contracts/artifacts'

export function loadSerializedGraph(serialized: SerializableGraphV1) {
  return deserializeGraph({
    nodes: Object.fromEntries(serialized.nodes.map(node => [node.id, node])),
    collections: {
      featured: serialized.indexes.public,
      byNiche: serialized.indexes.byNiche,
      byLocale: serialized.indexes.byLocale,
      public: serialized.indexes.public,
    },
    metadata: {
      totalNodes: serialized.nodes.length,
      lastGenerated: serialized.generatedAt,
      version: serialized.version,
      packageSources: [],
    },
  })
}
