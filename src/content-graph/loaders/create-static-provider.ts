import type { SerializableGraphV1 } from '../contracts/artifacts'
import { StaticJsonContentGraphProvider } from '../providers/static-json-provider'
import { loadSerializedGraph } from './load-serialized-graph'

export function createStaticProvider(serialized: SerializableGraphV1) {
  const graph = loadSerializedGraph(serialized)
  return new StaticJsonContentGraphProvider(graph.nodes, serialized.buildLocale)
}
