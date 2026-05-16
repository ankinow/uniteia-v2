import type { ContentNode } from '../contracts/node'

export function compileTaxonomy(nodes: Map<string, ContentNode>): void {
  const tagIndex = new Map<string, ContentNode[]>()

  for (const node of nodes.values()) {
    for (const tag of node.tags) {
      const group = tagIndex.get(tag) ?? []
      group.push(node)
      tagIndex.set(tag, group)
    }
  }
}
