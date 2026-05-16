import type { ContentLocale, ContentNode } from '../contracts/node'
import type { ContentGraphProvider, ContentGraphQuery } from '../contracts/provider'

export class StaticJsonContentGraphProvider implements ContentGraphProvider {
  private nodes: Map<string, ContentNode>
  private allNodes: ContentNode[]

  constructor(nodes: Map<string, ContentNode>) {
    this.nodes = nodes
    this.allNodes = Array.from(nodes.values())
  }

  getNode(id: string): ContentNode | undefined {
    return this.nodes.get(id)
  }

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

  getRelated(nodeId: string): ContentNode[] {
    const node = this.nodes.get(nodeId)
    if (!node) return []

    return node.related.map(id => this.nodes.get(id)).filter(Boolean) as ContentNode[]
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
