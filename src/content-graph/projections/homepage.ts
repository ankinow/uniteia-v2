import { nicheIndex } from '~/routing/routes'
import type { NicheConfig } from '~/types/niche'
import type { ContentLocale, ContentNode } from '../contracts/node'
import type { ContentGraphProvider } from '../contracts/provider'

export interface FeaturedSignal {
  node: ContentNode
  href: string
}

export interface KnowledgeCluster {
  nicheSlug: string
  label: string
  href: string
  articleCount: number
  avgGraphScore: number
}

export interface FrontierStream {
  node: ContentNode
  href: string
}

export interface HomepageProjection {
  featuredSignals: FeaturedSignal[]
  knowledgeClusters: KnowledgeCluster[]
  frontierStreams: FrontierStream[]
}

export function getHomepageProjection(
  provider: ContentGraphProvider,
  nicheConfig: NicheConfig[],
  locale: ContentLocale
): HomepageProjection {
  const nicheMap = new Map(nicheConfig.map(n => [n.slug, n]))
  const allLocaleNodes = provider.getByLocale(locale)
  const publicNodes = allLocaleNodes.filter(n => provider.isPublic(n))

  const featuredSignals: FeaturedSignal[] = [...publicNodes]
    .sort((a, b) => b.metrics.graphScore - a.metrics.graphScore)
    .slice(0, 6)
    .map(node => ({ node, href: node.routes.canonical }))

  const byNiche = new Map<string, ContentNode[]>()
  for (const node of publicNodes) {
    for (const niche of node.niche) {
      const list = byNiche.get(niche)
      if (list) {
        list.push(node)
      } else {
        byNiche.set(niche, [node])
      }
    }
  }

  const knowledgeClusters: KnowledgeCluster[] = []
  for (const [nicheSlug, nodes] of byNiche) {
    const config = nicheMap.get(nicheSlug)
    if (!config) continue
    knowledgeClusters.push({
      nicheSlug,
      label: config.title[locale] ?? config.title.en,
      href: nicheIndex(locale, nicheSlug),
      articleCount: nodes.length,
      avgGraphScore: nodes.reduce((s, n) => s + n.metrics.graphScore, 0) / nodes.length,
    })
  }

  const featuredIds = new Set(featuredSignals.map(f => f.node.id))

  const frontierStreams: FrontierStream[] = [...publicNodes]
    .filter(node => !featuredIds.has(node.id))
    .sort((a, b) => b.metrics.freshnessScore - a.metrics.freshnessScore)
    .slice(0, 5)
    .map(node => ({ node, href: node.routes.canonical }))

  return { featuredSignals, knowledgeClusters, frontierStreams }
}
