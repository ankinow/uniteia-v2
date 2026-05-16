import type {
  ContentNode,
  ContentNodeLifecycle,
  ContentNodeVerdict,
  ContentNodeVisibility,
} from '../contracts/node'

export function isPublicNode(node: ContentNode): boolean {
  return (
    node.visibility === 'published' &&
    node.qualityScore >= 95 &&
    (node.lifecycle === 'published' || node.lifecycle === 'reviewed')
  )
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
  publishable: boolean,
  lifecycle?: string
): {
  visibility: ContentNodeVisibility
  lifecycle: ContentNodeLifecycle
  verdict: ContentNodeVerdict
} {
  const isDraft = !publishable || (lifecycle !== undefined && lifecycle === 'draft')
  const visibility: ContentNodeVisibility = isDraft ? 'draft' : 'published'
  const lc: ContentNodeLifecycle = isDraft ? 'generated' : 'published'
  const verdict: ContentNodeVerdict =
    qualityScore >= 95 ? 'safe' : qualityScore >= 50 ? 'caution' : 'unsafe'
  return { visibility, lifecycle: lc, verdict }
}
