import type { ContentLocale, ContentNode } from '../contracts/node'
import type {
  ContentGraphProvider,
  ContentGraphQuery,
  NavigationItem,
  SitemapEntry,
} from '../contracts/provider'

export class StaticJsonContentGraphProvider implements ContentGraphProvider {
  private nodes: Map<string, ContentNode>
  private allNodes: ContentNode[]

  constructor(nodes: Map<string, ContentNode> | ContentNode[]) {
    if (nodes instanceof Map) {
      this.nodes = nodes
      this.allNodes = Array.from(nodes.values())
    } else {
      this.allNodes = nodes
      this.nodes = new Map(nodes.map(n => [n.id, n]))
    }
  }

  // Spec methods
  getNode(slug: string, locale?: ContentLocale): ContentNode | null {
    if (locale) {
      // First try to match both slug and locale
      const match = this.allNodes.find(n => n.slug === slug && n.locale === locale)
      if (match) return match
    }

    // Try finding by id directly (which format is locale-slug)
    const byId = this.nodes.get(slug)
    if (byId) return byId

    // Fallback to any node with matching slug
    return this.allNodes.find(n => n.slug === slug) ?? null
  }

  getGroup(canonicalSlug: string): ContentNode[] | null {
    const nodes = this.allNodes.filter(n => n.canonicalSlug === canonicalSlug)
    return nodes.length > 0 ? nodes : null
  }

  getPublicNodes(
    locale: ContentLocale,
    filters?: { niche?: string; limit?: number }
  ): ContentNode[] {
    let result = this.allNodes.filter(n => n.locale === locale && this.isPublic(n))
    if (filters?.niche) {
      const niche = filters.niche
      result = result.filter(n => n.niche.includes(niche))
    }
    if (filters?.limit) {
      result = result.slice(0, filters.limit)
    }
    return result
  }

  isPublic(node: ContentNode): boolean {
    if (node.qualityScore < 95 || node.visibility !== 'published') {
      return false
    }
    // Enforce 8-locale symmetry
    const group = this.getGroup(node.canonicalSlug)
    if (!group || group.length < 8) return false
    const locales = new Set(group.map(n => n.locale))
    return locales.size === 8
  }

  getHomepageProjection(locale: ContentLocale): {
    featured: ContentNode[]
    clusters: Array<{ niche: string; nodes: ContentNode[] }>
    frontier: ContentNode[]
  } {
    const publicNodes = this.getPublicNodes(locale)

    // Featured: sorted by graphScore
    const featured = [...publicNodes]
      .sort((a, b) => b.metrics.graphScore - a.metrics.graphScore)
      .slice(0, 6)

    // Frontier: sorted by freshness (timestamps.createdAt)
    const frontier = [...publicNodes]
      .sort(
        (a, b) =>
          new Date(b.timestamps.createdAt).getTime() - new Date(a.timestamps.createdAt).getTime()
      )
      .slice(0, 6)

    // Clusters: grouped by niche
    const nicheMap = new Map<string, ContentNode[]>()
    for (const node of publicNodes) {
      for (const niche of node.niche) {
        const list = nicheMap.get(niche) ?? []
        list.push(node)
        nicheMap.set(niche, list)
      }
    }

    const clusters = Array.from(nicheMap.entries()).map(([niche, nodes]) => ({
      niche,
      nodes: nodes.sort((a, b) => b.metrics.graphScore - a.metrics.graphScore).slice(0, 6),
    }))

    return { featured, clusters, frontier }
  }

  getNavigation(): NavigationItem[] {
    const nicheSet = new Set<string>()
    for (const node of this.allNodes) {
      for (const n of node.niche) {
        nicheSet.add(n)
      }
    }

    const items: NavigationItem[] = []
    for (const nicheSlug of nicheSet) {
      const nodes = this.allNodes.filter(n => n.niche.includes(nicheSlug) && this.isPublic(n))
      if (nodes.length === 0) continue
      const totalScore = nodes.reduce((sum, n) => sum + n.metrics.graphScore, 0)

      const firstNode = nodes[0]
      if (!firstNode) continue
      items.push({
        nicheSlug,
        label: nicheSlug.charAt(0).toUpperCase() + nicheSlug.slice(1),
        href: `/${firstNode.locale}/signals/${nicheSlug}`,
        articleCount: nodes.length,
        avgGraphScore: totalScore / nodes.length,
      })
    }
    return items.sort((a, b) => b.avgGraphScore - a.avgGraphScore)
  }

  getRelated(fromId: string, locale: ContentLocale, limit?: number): ContentNode[] {
    const node = this.nodes.get(fromId)
    if (!node) return []

    const related = node.related
      .map(id => this.nodes.get(id))
      .filter((n): n is ContentNode => !!n && n.locale === locale && this.isPublic(n))

    return limit ? related.slice(0, limit) : related
  }

  getSitemapEntries(): SitemapEntry[] {
    return this.allNodes
      .filter(n => this.isPublic(n))
      .map(node => {
        const firstNiche = node.niche[0] ?? 'apex'
        const group = this.getGroup(node.canonicalSlug) ?? []
        const alternates = group
          .filter(v => v.locale !== node.locale)
          .map(v => ({
            hreflang: v.locale,
            href: `/${v.locale}/signals/${firstNiche}/${v.slug}`,
          }))

        return {
          loc: `/${node.locale}/signals/${firstNiche}/${node.slug}`,
          lastmod: node.timestamps.updatedAt,
          changefreq: 'weekly' as const,
          priority: 0.7,
          alternates,
        }
      })
  }

  // Legacy/compatibility methods
  getNodes(query?: ContentGraphQuery): ContentNode[] {
    let result = this.allNodes
    if (query) {
      result = this.applyQuery(result, query)
    }
    return result
  }

  getByNiche(niche: string, query?: ContentGraphQuery): ContentNode[] {
    let result = this.allNodes.filter(n => n.niche.includes(niche))
    if (query) {
      result = this.applyQuery(result, query)
    }
    return result
  }

  getByLocale(locale: ContentLocale, query?: ContentGraphQuery): ContentNode[] {
    let result = this.allNodes.filter(n => n.locale === locale)
    if (query) {
      result = this.applyQuery(result, query)
    }
    return result
  }

  getFeatured(query?: ContentGraphQuery): ContentNode[] {
    let result = [...this.allNodes]
      .filter(n => n.visibility === 'published' && n.qualityScore >= 95)
      .sort((a, b) => b.qualityScore - a.qualityScore)

    if (query) {
      result = this.applyQuery(result, query)
    }
    return result.slice(0, query?.limit ?? 12)
  }

  getRelatedLegacy(nodeId: string): ContentNode[] {
    const node = this.nodes.get(nodeId)
    if (!node) return []

    return node.related.map(id => this.nodes.get(id)).filter(Boolean) as ContentNode[]
  }

  getRelatedNodesLegacy(nodeId: string): ContentNode[] {
    return this.getRelatedLegacy(nodeId)
  }

  getTotalCount(): number {
    return this.nodes.size
  }

  private applyQuery(nodes: ContentNode[], query: ContentGraphQuery): ContentNode[] {
    let result = nodes

    if (query.locale) {
      result = result.filter(n => n.locale === query.locale)
    }
    if (query.tag) {
      const tag = query.tag
      result = result.filter(n => n.tags.includes(tag))
    }
    if (query.visibility === 'public') {
      result = result.filter(n => n.visibility === 'published' && n.qualityScore >= 95)
    }
    if (query.limit) {
      result = result.slice(0, query.limit)
    }

    return result
  }
}
