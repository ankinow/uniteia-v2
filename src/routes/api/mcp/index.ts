import type { RequestHandler } from '@builder.io/qwik-city'
import { contentGraphData } from '~/content-graph.generated'

export const onGet: RequestHandler = async ({ json, cacheControl }) => {
  cacheControl({ maxAge: 300, staleWhileRevalidate: 60 })

  const graph = contentGraphData as {
    publicGroups?: Array<{
      canonicalSlug: string
      title: string
      contentType: string
      nodes: Array<{
        id: string
        locale: string
        slug: string
        title: string
        summary: string
        niche: string[]
        tags: string[]
        qualityScore: number
        trustScore: number
        verdict: string
        routes: { canonical: string }
        metrics: {
          edgeRank: number
          semanticDensity: number
          freshnessScore: number
          graphScore: number
        }
      }>
    }>
  }

  const groups = graph.publicGroups ?? []

  const nodes = groups.flatMap(g => g.nodes)
  const edges = groups.flatMap(g =>
    g.nodes.flatMap(
      n =>
        (n as { related?: string[] }).related?.map((r: string) => ({
          source: n.id,
          target: r,
          relation: 'related',
        })) ?? []
    )
  )

  const mcpPayload = {
    $schema: 'https://schema.uniteia.com/mcp/v1/content-graph.json',
    meta: {
      exportedAt: new Date().toISOString(),
      totalGroups: groups.length,
      totalNodes: nodes.length,
      totalEdges: edges.length,
      locales: [...new Set(nodes.map(n => n.locale))],
      niches: [...new Set(nodes.flatMap(n => n.niche))],
    },
    groups: groups.map(g => ({
      slug: g.canonicalSlug,
      title: g.title,
      type: g.contentType,
      nodeCount: g.nodes.length,
      topArticles: g.nodes
        .filter(n => n.locale === 'en')
        .map(n => ({
          id: n.id,
          title: n.title,
          slug: n.slug,
          canonical: n.routes.canonical,
          quality: n.qualityScore,
          trust: n.trustScore,
          verdict: n.verdict,
          metrics: n.metrics,
        })),
    })),
    edges,
    _prompt:
      'UniTeia content graph snapshot for MCP consumption. Query by group slug, locale, or niche.',
  }

  json(200, mcpPayload)
}
