import type { ContentGroup, ContentGroupCollection } from '../contracts/group'
import { REQUIRED_LOCALES } from '../contracts/group'
import type { ContentLocale, ContentNode } from '../contracts/node'

export function compileGroups(nodes: Map<string, ContentNode>): ContentGroupCollection {
  const byCanonical = new Map<string, ContentNode[]>()

  for (const node of nodes.values()) {
    const key = node.canonicalSlug
    const g = byCanonical.get(key) ?? []
    g.push(node)
    byCanonical.set(key, g)
  }

  const groups: ContentGroup[] = []

  for (const [canonicalSlug, groupNodes] of byCanonical) {
    const publishedLocales: ContentLocale[] = []
    const missingLocales: ContentLocale[] = []

    // Single-locale build: only check the locales actually present
    console.log(
      '[compileGroups] buildLocale:',
      process.env.LOCALE,
      'isFullySymmetric samples:',
      groups.slice(0, 2).map(g => g.isFullySymmetric)
    )
    const buildLocale = process.env.LOCALE
    const requiredLocales = buildLocale ? [buildLocale as ContentLocale] : REQUIRED_LOCALES

    for (const loc of requiredLocales) {
      const hasNode = groupNodes.some(
        n => n.locale === loc && n.visibility === 'published' && n.qualityScore >= 95
      )
      if (hasNode) {
        publishedLocales.push(loc)
      } else {
        missingLocales.push(loc)
      }
    }

    const completionScore = publishedLocales.length / requiredLocales.length
    const isFullySymmetric = missingLocales.length === 0

    const title = groupNodes[0]?.title ?? canonicalSlug

    groups.push({
      canonicalSlug,
      title,
      contentType: inferContentType(groupNodes),
      nodes: groupNodes,
      publishedLocales,
      missingLocales,
      completionScore,
      isFullySymmetric,
    })
  }

  const complete = groups.filter(g => g.completionScore >= 1)
  const partial = groups.filter(g => g.completionScore >= 0.5 && g.completionScore < 1)
  const incomplete = groups.filter(g => g.completionScore < 0.5)
  const fullySymmetric = groups.filter(g => g.isFullySymmetric)
  // For single-locale builds, all groups with published nodes are public
  // Single-locale build: accept any group with published nodes
  console.log(
    '[compileGroups] buildLocale:',
    process.env.LOCALE,
    'isFullySymmetric samples:',
    groups.slice(0, 2).map(g => g.isFullySymmetric)
  )
  const buildLocale = process.env.LOCALE
  const publicGroups = buildLocale
    ? groups.filter(g => g.nodes.some(n => n.visibility === 'published' && n.qualityScore >= 95))
    : groups.filter(g => {
        if (!g.isFullySymmetric) return false
        return g.nodes.every(n => n.visibility === 'published' && n.qualityScore >= 95)
      })

  return {
    groups,
    byCompletion: { complete, partial, incomplete },
    fullySymmetric,
    publicGroups,
  }
}

function inferContentType(nodes: ContentNode[]): ContentGroup['contentType'] {
  const tags = new Set(nodes.flatMap(n => n.tags))
  if (tags.has('guide')) return 'guide'
  if (tags.has('reference')) return 'reference'
  return 'article'
}
