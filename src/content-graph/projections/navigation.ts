import type { NicheConfig } from '~/types/niche'
import type { ContentLocale, ContentNode } from '../contracts/node'
import type { ContentGraphProvider } from '../contracts/provider'

export interface NavigationItem {
  nicheSlug: string
  label: string
  href: string
  articleCount: number
  avgGraphScore: number
}

export function getPublicNavigation(
  provider: ContentGraphProvider,
  nicheConfig: NicheConfig[],
  locale: ContentLocale
): NavigationItem[] {
  const nicheMap = new Map(nicheConfig.map(n => [n.slug, n]))
  const allLocaleNodes = provider.getByLocale(locale)
  const publicNodes = allLocaleNodes.filter(n => n.visibility === 'published' && n.trustScore >= 80)

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

  const items: NavigationItem[] = []
  for (const [nicheSlug, nodes] of byNiche) {
    const config = nicheMap.get(nicheSlug)
    if (!config) continue
    const totalScore = nodes.reduce((s, n) => s + n.metrics.graphScore, 0)
    items.push({
      nicheSlug,
      label: config.title[locale] ?? config.title.en,
      href: `/${locale}/signals/${nicheSlug}`,
      articleCount: nodes.length,
      avgGraphScore: totalScore / nodes.length,
    })
  }

  return items.sort((a, b) => b.avgGraphScore - a.avgGraphScore)
}
