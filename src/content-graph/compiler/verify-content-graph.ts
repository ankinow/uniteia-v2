import type { ContentGraph } from '../contracts/graph'
import { REQUIRED_LOCALES } from '../contracts/group'
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
    | 'incomplete-locale-group'
    | 'asymmetric-publish'
    | 'group-visibility-mismatch'
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

  for (const node of nodes) {
    const routeCounts: Record<string, string[]> = {}
    for (const n of nodes) {
      if (n.routes.canonical) {
        const existing = routeCounts[n.routes.canonical]
        if (existing) {
          existing.push(n.id)
        } else {
          routeCounts[n.routes.canonical] = [n.id]
        }
      }
      for (const alias of n.routes.aliases) {
        const existing = routeCounts[alias]
        if (existing) {
          existing.push(n.id)
        } else {
          routeCounts[alias] = [n.id]
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

    const slugMap: Record<string, string[]> = {}
    for (const n of nodes) {
      const key = `${n.locale}:${n.slug}`
      const existing = slugMap[key]
      if (existing) {
        existing.push(n.id)
      } else {
        slugMap[key] = [n.id]
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

    for (const n of nodes) {
      for (const relatedId of n.related) {
        if (!graph.nodes.has(relatedId)) {
          warnings.push({
            severity: 'warning',
            code: 'broken-related-ref',
            nodeId: n.id,
            message: `Node "${n.id}" references missing related node "${relatedId}"`,
          })
        }
      }
    }

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

    const validLifecycles = ['generated', 'verified', 'reviewed', 'published', 'deprecated']
    for (const n of nodes) {
      if (!validLifecycles.includes(n.lifecycle)) {
        warnings.push({
          severity: 'warning',
          code: 'invalid-lifecycle',
          nodeId: n.id,
          message: `Node "${n.id}" has unknown lifecycle "${n.lifecycle}"`,
        })
      }
    }

    if (node.visibility === 'published' && node.qualityScore < 95) {
      warnings.push({
        severity: 'warning',
        code: 'visibility-incoherent',
        nodeId: node.id,
        message: `Node "${node.id}" is published but qualityScore=${node.qualityScore} < 95`,
      })
    }

    if (isPublicNode(node) && node.seo.noindex) {
      errors.push({
        severity: 'error',
        code: 'sitemap-incoherent',
        nodeId: node.id,
        message: `Node "${node.id}" is public but marked noindex`,
      })
    }

    if (node.slug === '_index') {
      errors.push({
        severity: 'error',
        code: 'index-leak',
        nodeId: node.id,
        message: `Node "${node.id}" is an _index file that leaked into the graph`,
      })
    }
  }

  // --- Locale symmetry checks ---
  const byCanonical = new Map<string, typeof nodes>()
  for (const n of nodes) {
    const g = byCanonical.get(n.canonicalSlug) ?? []
    g.push(n)
    byCanonical.set(n.canonicalSlug, g)
  }

  for (const [slug, groupNodes] of byCanonical) {
    const publishedLocales = new Set(
      groupNodes
        .filter(n => n.visibility === 'published' && n.qualityScore >= 95)
        .map(n => n.locale)
    )
    const allLocales = new Set(groupNodes.map(n => n.locale))
    const missingLocales = REQUIRED_LOCALES.filter(l => !allLocales.has(l))
    const publishedMissingLocales = REQUIRED_LOCALES.filter(l => !publishedLocales.has(l))

    if (missingLocales.length > 0 && missingLocales.length < 5) {
      warnings.push({
        severity: 'warning',
        code: 'incomplete-locale-group',
        message: `Group "${slug}" missing ${missingLocales.length} locales: ${missingLocales.join(', ')}. Completion: ${(((REQUIRED_LOCALES.length - missingLocales.length) / REQUIRED_LOCALES.length) * 100).toFixed(0)}%`,
      })
    }

    const anyPublished = [...allLocales].some(l =>
      groupNodes.some(n => n.locale === l && n.visibility === 'published')
    )
    const anyDraft = [...allLocales].some(l =>
      groupNodes.some(n => n.locale === l && n.visibility === 'draft')
    )

    if (anyPublished && anyDraft) {
      errors.push({
        severity: 'error',
        code: 'asymmetric-publish',
        message: `Group "${slug}" has mixed visibility: some locales published, others draft. Asymmetric groups block public content. Missing published: ${publishedMissingLocales.join(', ')}`,
      })
    }

    if (graph.groups) {
      const matchingGroup = graph.groups.groups.find(g => g.canonicalSlug === slug)
      if (matchingGroup) {
        const expectedPublic =
          matchingGroup.isFullySymmetric &&
          matchingGroup.nodes.every(n => n.visibility === 'published' && n.qualityScore >= 95)
        const actualPublic = graph.collections.public.some(n => n.canonicalSlug === slug)

        if (expectedPublic && !actualPublic) {
          errors.push({
            severity: 'error',
            code: 'group-visibility-mismatch',
            message: `Group "${slug}" meets public criteria but is not in public collection`,
          })
        }
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  }
}
