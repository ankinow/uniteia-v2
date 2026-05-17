import type { ContentGroup } from '../contracts/group'
import type { ContentNode, ContentNodeVerdict } from '../contracts/node'

export function isPublicNode(node: ContentNode): boolean {
  if (node.visibility !== 'published' || node.qualityScore < 95) return false
  // Enforce 8-locale symmetry (current locale + 7 alternates = 8 locales complete)
  const alternateCount = Object.keys(node.alternates).length
  return alternateCount >= 7
}

export function isIndexableNode(node: ContentNode): boolean {
  if (node.seo.noindex) return false
  return isPublicNode(node)
}

export function getVisibilityVerdict(node: ContentNode): ContentNodeVerdict {
  if (node.qualityScore < 95) return 'caution'
  if (node.visibility !== 'published') return 'unsafe'
  return 'safe'
}

export function deriveVisibility(
  qualityScore: number,
  publishable: boolean
): {
  noindex: boolean
} {
  const isDraft = !publishable || qualityScore < 95
  return { noindex: isDraft }
}

export function isPublicContentGroup(group: ContentGroup): boolean {
  if (!group.isFullySymmetric) return false
  if (group.missingLocales.length > 0) return false
  if (group.nodes.length !== 8) return false
  return group.nodes.every(node => isPublicNode(node) && node.trustScore >= 95)
}

export function getGroupVisibilityScore(group: ContentGroup): number {
  const publishedCount = group.publishedLocales.length
  const totalRequired = 8
  return publishedCount / totalRequired
}
