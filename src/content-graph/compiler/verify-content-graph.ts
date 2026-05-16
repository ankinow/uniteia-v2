import type { ContentGraph } from '../contracts/graph'
import { isPublicNode } from '../policies/visibility-policy'

export interface GraphVerificationIssue {
  severity: 'error' | 'warning'
  code:
    | 'duplicate-route'
    | 'duplicate-slug'
    | 'missing-alternate'
    | 'broken-related-ref'
    | 'invalid-lifecycle'
    | 'visibility-incoherent'
    | 'sitemap-incoherent'
    | 'missing-taxonomy-edge'
    | 'index-leak'
  nodeId?: string
  message: string
}

export interface GraphVerificationReport {
  ok: boolean
  errors: GraphVerificationIssue[]
  warnings: GraphVerificationIssue[]
}

export function verifyContentGraph(graph: ContentGraph): GraphVerificationReport {
  const errors: GraphVerificationIssue[] = []
  const warnings: GraphVerificationIssue[] = []
  const nodes = Array.from(graph.nodes.values())

  // 1. Duplicate routes
  const routeCounts: Record<string, string[]> = {}
  for (const node of nodes) {
    if (node.routes.canonical) {
      const existing = routeCounts[node.routes.canonical]
      if (existing) {
        existing.push(node.id)
      } else {
        routeCounts[node.routes.canonical] = [node.id]
      }
    }
    for (const alias of node.routes.aliases) {
      const existing = routeCounts[alias]
      if (existing) {
        existing.push(node.id)
      } else {
        routeCounts[alias] = [node.id]
      }
    }
  }
  for (const [route, ids] of Object.entries(routeCounts)) {
    if (ids.length > 1 && ids[0]) {
      errors.push({
        severity: 'error',
        code: 'duplicate-route',
        nodeId: ids[0],
        message: `Route "${route}" is claimed by ${ids.length} nodes: ${ids.join(', ')}`,
      })
    }
  }

  // 2. Duplicate locale+slug
  const slugMap: Record<string, string[]> = {}
  for (const node of nodes) {
    const key = `${node.locale}:${node.slug}`
    const existing = slugMap[key]
    if (existing) {
      existing.push(node.id)
    } else {
      slugMap[key] = [node.id]
    }
  }
  for (const [key, ids] of Object.entries(slugMap)) {
    if (ids.length > 1) {
      errors.push({
        severity: 'error',
        code: 'duplicate-slug',
        message: `Duplicate ${key} across nodes: ${ids.join(', ')}`,
      })
    }
  }

  // 3. Broken related refs
  for (const node of nodes) {
    for (const relatedId of node.related) {
      if (!graph.nodes.has(relatedId)) {
        warnings.push({
          severity: 'warning',
          code: 'broken-related-ref',
          nodeId: node.id,
          message: `Node "${node.id}" references missing related node "${relatedId}"`,
        })
      }
    }
  }

  // 4. Missing hreflang alternates (warning for now)
  for (const node of nodes) {
    const localeGroup = nodes.filter(
      n => n.canonicalSlug === node.canonicalSlug && n.slug === node.slug
    )
    if (localeGroup.length > 1) {
      for (const sibling of localeGroup) {
        if (sibling.id !== node.id && !node.alternates[sibling.locale]) {
          warnings.push({
            severity: 'warning',
            code: 'missing-alternate',
            nodeId: node.id,
            message: `Node "${node.id}" is missing alternate for locale "${sibling.locale}" (sibling: "${sibling.id}")`,
          })
        }
      }
    }
  }

  // 5. Invalid lifecycle
  const validLifecycles = ['generated', 'verified', 'reviewed', 'published', 'deprecated']
  for (const node of nodes) {
    if (!validLifecycles.includes(node.lifecycle)) {
      warnings.push({
        severity: 'warning',
        code: 'invalid-lifecycle',
        nodeId: node.id,
        message: `Node "${node.id}" has unknown lifecycle "${node.lifecycle}"`,
      })
    }
  }

  // 6. Visibility incoherence: published but quality < 95 => should be caution
  for (const node of nodes) {
    if (node.visibility === 'published' && node.qualityScore < 95) {
      warnings.push({
        severity: 'warning',
        code: 'visibility-incoherent',
        nodeId: node.id,
        message: `Node "${node.id}" is published but qualityScore=${node.qualityScore} < 95`,
      })
    }
  }

  // 7. Sitemap incoherence: public node with noindex
  for (const node of nodes) {
    if (isPublicNode(node) && node.seo.noindex) {
      errors.push({
        severity: 'error',
        code: 'sitemap-incoherent',
        nodeId: node.id,
        message: `Node "${node.id}" is public but marked noindex`,
      })
    }
  }

  // 8. _index leakage: _index files should have been excluded
  for (const node of nodes) {
    if (node.slug === '_index') {
      errors.push({
        severity: 'error',
        code: 'index-leak',
        nodeId: node.id,
        message: `Node "${node.id}" is an _index file that leaked into the graph`,
      })
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  }
}
