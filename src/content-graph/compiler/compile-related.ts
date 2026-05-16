import type { ContentNode } from '../contracts/node'

export function compileRelated(nodes: Map<string, ContentNode>): void {
  const nodeArray = Array.from(nodes.values())

  for (const node of nodeArray) {
    if (node.related.length > 0) continue

    const candidates = nodeArray.filter(candidate => {
      if (candidate.id === node.id) return false
      if (candidate.locale !== node.locale) return false
      if (!isPublicNode(candidate)) return false

      const nicheOverlap = candidate.niche.some(n => node.niche.includes(n))
      const tagOverlap = candidate.tags.some(t => node.tags.includes(t))
      return nicheOverlap || tagOverlap
    })

    candidates.sort((a, b) => b.qualityScore - a.qualityScore)

    node.related = candidates.slice(0, 4).map(c => c.id)
  }
}

function isPublicNode(node: ContentNode): boolean {
  return node.visibility === 'published' && node.qualityScore >= 95
}
