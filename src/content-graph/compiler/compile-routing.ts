import type { ContentNode } from '../contracts/node'

export function compileRouting(nodes: Map<string, ContentNode>): void {
  for (const node of nodes.values()) {
    const locale = node.locale
    const niche = node.niche[0] ?? 'apex'

    const canonical = `/${locale}/n/${niche}/${node.canonicalSlug}`
    const localeAlias = `/${node.locale}/n/${niche}/${node.slug}`

    node.routes = {
      canonical,
      aliases: canonical !== localeAlias ? [localeAlias] : [],
    }
  }
}
