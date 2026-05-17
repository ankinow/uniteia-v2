import type {
  LocaleIndexV1,
  RelatedIndexV1,
  RouteManifestV1,
  SerializableGraphV1,
  TaxonomyIndexV1,
  VisibilityIndexV1,
} from '../contracts/artifacts'
import type { GraphEdge } from '../contracts/edge'
import type { ContentGraph } from '../contracts/graph'

export interface GraphArtifacts {
  graph: SerializableGraphV1
  routeManifest: RouteManifestV1
  localeIndex: LocaleIndexV1
  taxonomyIndex: TaxonomyIndexV1
  relatedIndex: RelatedIndexV1
  visibilityIndex: VisibilityIndexV1
}

export function serializeGraphArtifacts(graph: ContentGraph): GraphArtifacts {
  const nodes = graph.nodes
  const now = new Date().toISOString()

  // Compute public group node IDs dynamically
  const publicGroupIds = new Set<string>()
  for (const [_, groupNodes] of graph.groups.entries()) {
    // A group is public if it has all 8 target locales, and all of them are published and quality >= 95
    if (groupNodes.length >= 8) {
      const locales = new Set(groupNodes.map(n => n.locale))
      if (
        locales.size === 8 &&
        groupNodes.every(n => n.visibility === 'published' && n.qualityScore >= 95)
      ) {
        for (const n of groupNodes) {
          publicGroupIds.add(n.id)
        }
      }
    }
  }

  const sitemapEligible = nodes
    .filter(n => publicGroupIds.has(n.id) && !n.seo.noindex)
    .map(n => n.id)

  const edges = buildEdges(graph)

  const byId: Record<string, number> = {}
  const bySlug: Record<string, string> = {}
  const byRoute: Record<string, string> = {}
  const byLocale: Record<string, string[]> = {}
  const byNiche: Record<string, string[]> = {}
  const byTag: Record<string, string[]> = {}

  nodes.forEach((node, index) => {
    byId[node.id] = index
    bySlug[node.slug] = node.id
    if (node.routes.canonical) byRoute[node.routes.canonical] = node.id

    if (!byLocale[node.locale]) byLocale[node.locale] = []
    byLocale[node.locale]?.push(node.id)

    for (const n of node.niche) {
      if (!byNiche[n]) byNiche[n] = []
      byNiche[n]?.push(node.id)
    }

    for (const tag of node.tags) {
      if (!byTag[tag]) byTag[tag] = []
      byTag[tag]?.push(node.id)
    }
  })

  // Format groups for SerializableGraphV1: it expects ContentGroupCollection structure
  const groupsList = Array.from(graph.groups.entries()).map(([canonicalSlug, groupNodes]) => {
    return {
      canonicalSlug,
      title: groupNodes[0]?.title ?? canonicalSlug,
      contentType: 'article' as const,
      nodes: groupNodes,
      publishedLocales: groupNodes.map(n => n.locale),
      missingLocales: [] as import('../contracts/node').ContentLocale[],
      completionScore: groupNodes.length / 8,
      isFullySymmetric: groupNodes.length >= 8,
    }
  })

  const graphArtifact: SerializableGraphV1 = {
    version: 'content-graph.v1',
    generatedAt: now,
    nodes,
    edges,
    groups: {
      groups: groupsList,
      byCompletion: {
        complete: groupsList.filter(g => g.completionScore >= 1),
        partial: groupsList.filter(g => g.completionScore >= 0.5 && g.completionScore < 1),
        incomplete: groupsList.filter(g => g.completionScore < 0.5),
      },
      fullySymmetric: groupsList.filter(g => g.isFullySymmetric),
      publicGroups: groupsList.filter(
        g =>
          g.isFullySymmetric &&
          g.nodes.every(n => n.visibility === 'published' && n.qualityScore >= 95)
      ),
    },
    indexes: {
      byId,
      bySlug,
      byRoute,
      byLocale: byLocale as Record<import('../contracts/node').ContentLocale, string[]>,
      byNiche,
      byTag,
      public: nodes.filter(n => publicGroupIds.has(n.id)).map(n => n.id),
      sitemapEligible,
    },
  }

  const routeMap: RouteManifestV1['routes'] = {}
  for (const node of nodes) {
    routeMap[node.id] = {
      nodeId: node.id,
      locale: node.locale,
      canonical: node.routes.canonical,
      aliases: node.routes.aliases,
      noindex: node.seo.noindex,
      sitemapEligible: sitemapEligible.includes(node.id),
    }
  }

  const alternates: Record<string, Partial<Record<string, string>>> = {}
  for (const node of nodes) {
    if (Object.keys(node.alternates).length > 0) {
      alternates[node.id] = { ...node.alternates }
    }
  }

  const related: Record<string, string[]> = {}
  for (const node of nodes) {
    if (node.related.length > 0) {
      related[node.id] = node.related
    }
  }

  return {
    graph: graphArtifact,
    routeManifest: {
      version: 'route-manifest.v1',
      generatedAt: now,
      routes: routeMap,
    },
    localeIndex: {
      version: 'locale-index.v1',
      generatedAt: now,
      alternates: alternates as Record<
        string,
        Partial<Record<import('../contracts/node').ContentLocale, string>>
      >,
    },
    taxonomyIndex: {
      version: 'taxonomy-index.v1',
      generatedAt: now,
      byNiche,
      byTag,
    },
    relatedIndex: {
      version: 'related-index.v1',
      generatedAt: now,
      related,
    },
    visibilityIndex: {
      version: 'visibility-index.v1',
      generatedAt: now,
      public: nodes.filter(n => publicGroupIds.has(n.id)).map(n => n.id),
      noindex: nodes.filter(n => n.seo.noindex).map(n => n.id),
      sitemapEligible,
      draft: nodes.filter(n => n.visibility === 'draft').map(n => n.id),
    },
  }
}

function buildEdges(graph: ContentGraph): GraphEdge[] {
  const edges: GraphEdge[] = []
  const nodes = graph.nodes
  const nodeIdSet = new Set(nodes.map(n => n.id))

  for (const node of nodes) {
    for (const relatedId of node.related) {
      if (nodeIdSet.has(relatedId)) {
        edges.push({
          from: node.id,
          to: relatedId,
          kind: 'related-to',
        })
      }
    }

    for (const altLocale of Object.keys(node.alternates)) {
      const altId = nodes.find(n => n.slug === node.slug && n.locale === altLocale)?.id
      if (altId) {
        edges.push({
          from: node.id,
          to: altId,
          kind: 'translated-as',
          reason: `locale alternate: ${altLocale}`,
        })
      }
    }

    for (const n of node.niche) {
      const nicheNodes = nodes.filter(other => other.niche.includes(n) && other.id !== node.id)
      for (const nicheNode of nicheNodes.slice(0, 5)) {
        edges.push({
          from: node.id,
          to: nicheNode.id,
          kind: 'belongs-to-niche',
          weight: 0.3,
          reason: `shared niche: ${n}`,
        })
      }
    }
  }

  return edges
}
