import type { ContentLocale, ContentNode } from '../contracts/node'

export function compileLocales(nodes: Map<string, ContentNode>): void {
  const byCanonicalSlug = new Map<string, ContentNode[]>()

  for (const node of nodes.values()) {
    const key = node.canonicalSlug
    const group = byCanonicalSlug.get(key) ?? []
    group.push(node)
    byCanonicalSlug.set(key, group)
  }

  for (const [, group] of byCanonicalSlug) {
    for (const node of group) {
      for (const sibling of group) {
        if (sibling.locale !== node.locale) {
          node.alternates[sibling.locale as ContentLocale] = sibling.routes.canonical
        }
      }
    }
  }
}
