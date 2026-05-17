#!/usr/bin/env bun
/**
 * Linkgraph Report Generator
 *
 * Analyzes the content graph edges and produces a structured markdown report
 * covering edge kind distribution, reciprocity, degree centrality, and niche
 * connectivity. Writes to artifacts/linkgraph/linkgraph-report.md.
 *
 * Usage: bun run scripts/generate-linkgraph-report.ts
 * Prerequisite: bun run generate:content-graph
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { SerializableGraphV1 } from '../src/content-graph/contracts/artifacts'
import type { GraphEdge, GraphEdgeKind } from '../src/content-graph/contracts/edge'
import type { ContentNode } from '../src/content-graph/contracts/node'

// ── Core analysis functions (exported for testing) ──────────────────────

export interface EdgeDistributionEntry {
  kind: GraphEdgeKind
  count: number
}

/** Count edges per GraphEdgeKind, sorted descending by count. */
export function buildEdgeDistribution(edges: GraphEdge[]): EdgeDistributionEntry[] {
  const counts = new Map<GraphEdgeKind, number>()
  for (const e of edges) {
    counts.set(e.kind, (counts.get(e.kind) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([kind, count]) => ({ kind, count }))
    .sort((a, b) => b.count - a.count)
}

export interface ReciprocityEntry {
  kind: GraphEdgeKind
  total: number
  reciprocalCount: number
  reciprocalPct: number
  /** True when this edge kind is expected to be asymmetric by design. */
  expectedAsymmetric: boolean
}

/**
 * Compute reciprocity per edge kind.
 * An edge A→B of kind K is reciprocal if B→A of the same kind also exists.
 * `belongs-to-niche` and `related-to` are expected to be asymmetric.
 */
export function computeReciprocity(edges: GraphEdge[]): ReciprocityEntry[] {
  const asymmetricKinds = new Set<GraphEdgeKind>(['belongs-to-niche', 'related-to'])

  // Build a lookup set: "kind:from→to"
  const edgeSet = new Set<string>()
  for (const e of edges) {
    edgeSet.add(`${e.kind}:${e.from}:${e.to}`)
  }

  // Group edges by kind
  const byKind = new Map<GraphEdgeKind, GraphEdge[]>()
  for (const e of edges) {
    if (!byKind.has(e.kind)) byKind.set(e.kind, [])
    byKind.get(e.kind)?.push(e)
  }

  const results: ReciprocityEntry[] = []
  for (const [kind, kindEdges] of byKind) {
    let reciprocalCount = 0
    for (const e of kindEdges) {
      if (edgeSet.has(`${e.kind}:${e.to}:${e.from}`)) {
        reciprocalCount++
      }
    }
    const total = kindEdges.length
    const reciprocalPct = total > 0 ? Math.round((reciprocalCount / total) * 100) : 0
    results.push({
      kind,
      total,
      reciprocalCount,
      reciprocalPct,
      expectedAsymmetric: asymmetricKinds.has(kind),
    })
  }

  // Sort: asymmetric kinds last
  return results.sort((a, b) => {
    if (a.expectedAsymmetric !== b.expectedAsymmetric) return a.expectedAsymmetric ? 1 : -1
    return b.total - a.total
  })
}

export interface DegreeEntry {
  nodeId: string
  title: string
  slug: string
  inbound: number
  outbound: number
  total: number
}

/**
 * Compute degree centrality: inbound count, outbound count, and total degree
 * per node. Returns all nodes sorted by total degree descending.
 */
export function computeDegreeCentrality(edges: GraphEdge[], nodes: ContentNode[]): DegreeEntry[] {
  const nodeMap = new Map<string, ContentNode>()
  for (const n of nodes) {
    nodeMap.set(n.id, n)
  }

  const inbound = new Map<string, number>()
  const outbound = new Map<string, number>()

  for (const e of edges) {
    outbound.set(e.from, (outbound.get(e.from) ?? 0) + 1)
    inbound.set(e.to, (inbound.get(e.to) ?? 0) + 1)
  }

  // Collect all unique node IDs referenced in edges
  const nodeIds = new Set<string>()
  for (const e of edges) {
    nodeIds.add(e.from)
    nodeIds.add(e.to)
  }

  const entries: DegreeEntry[] = []
  for (const nodeId of nodeIds) {
    const node = nodeMap.get(nodeId)
    const ib = inbound.get(nodeId) ?? 0
    const ob = outbound.get(nodeId) ?? 0
    entries.push({
      nodeId,
      title: node?.title ?? nodeId,
      slug: node?.slug ?? nodeId,
      inbound: ib,
      outbound: ob,
      total: ib + ob,
    })
  }

  return entries.sort((a, b) => b.total - a.total)
}

export interface NicheConnectivityEntry {
  niche: string
  nodeCount: number
  internalEdgeCount: number
  connectedNiches: string[]
}

/**
 * Compute niche connectivity. An edge is "internal" to a niche when both
 * endpoint nodes share at least one common niche. Reports per-niche stats
 * plus cross-niche connections.
 */
export function computeNicheConnectivity(
  edges: GraphEdge[],
  nodes: ContentNode[]
): NicheConnectivityEntry[] {
  // Map nodeId → set of niches
  const nodeNiches = new Map<string, Set<string>>()
  for (const n of nodes) {
    nodeNiches.set(n.id, new Set(n.niche))
  }

  // Group nodes by niche
  const nodesInNiche = new Map<string, Set<string>>()
  for (const n of nodes) {
    for (const niche of n.niche) {
      if (!nodesInNiche.has(niche)) nodesInNiche.set(niche, new Set())
      nodesInNiche.get(niche)?.add(n.id)
    }
  }

  const results: NicheConnectivityEntry[] = []

  for (const [niche, nodeIds] of nodesInNiche) {
    let internalEdgeCount = 0
    const connectedNiches = new Set<string>()

    for (const e of edges) {
      const fromNiches = nodeNiches.get(e.from)
      const toNiches = nodeNiches.get(e.to)
      if (!fromNiches || !toNiches) continue

      // Check if either endpoint belongs to this niche
      if (!fromNiches.has(niche) && !toNiches.has(niche)) continue

      // Edge touches this niche — count as internal if both nodes share at least one niche
      const shared = [...fromNiches].some(n => toNiches.has(n))
      if (shared) {
        internalEdgeCount++
      }

      // Track cross-niche connections
      for (const n of fromNiches) {
        if (n !== niche) connectedNiches.add(n)
      }
      for (const n of toNiches) {
        if (n !== niche) connectedNiches.add(n)
      }
    }

    results.push({
      niche,
      nodeCount: nodeIds.size,
      internalEdgeCount,
      connectedNiches: [...connectedNiches].sort(),
    })
  }

  return results.sort((a, b) => b.nodeCount - a.nodeCount)
}

// ── Markdown formatting helpers ─────────────────────────────────────────

function formatTimestamp(): string {
  return new Date().toISOString()
}

function edgeDistributionTable(entries: EdgeDistributionEntry[]): string {
  const rows = entries.map(e => `| ${e.kind} | ${e.count} |`).join('\n')
  return `| Edge Kind | Count |\n|-----------|-------|\n${rows}`
}

function reciprocityTable(entries: ReciprocityEntry[]): string {
  const rows = entries
    .map(e => {
      const flag = e.expectedAsymmetric ? ' (expected)' : ''
      return `| ${e.kind} | ${e.total} | ${e.reciprocalCount} | ${e.reciprocalPct}%${flag} |`
    })
    .join('\n')
  return `| Edge Kind | Total | Reciprocal | % Reciprocal |\n|-----------|-------|------------|--------------|\n${rows}`
}

function degreeTable(entries: DegreeEntry[], limit: number): string {
  const rows = entries
    .slice(0, limit)
    .map(
      e => `| ${escapeMd(e.title)} | \`${e.slug}\` | ${e.inbound} | ${e.outbound} | ${e.total} |`
    )
    .join('\n')
  return `| Title | Slug | Inbound | Outbound | Total |\n|-------|------|---------|----------|-------|\n${rows}`
}

function nicheConnectivitySection(entries: NicheConnectivityEntry[]): string {
  const parts = entries.map(e => {
    const connected =
      e.connectedNiches.length > 0 ? e.connectedNiches.map(n => `\`${n}\``).join(', ') : '*none*'
    return `### ${escapeMd(e.niche)}\n\n- Nodes: ${e.nodeCount}\n- Internal edges: ${e.internalEdgeCount}\n- Connected to: ${connected}`
  })
  return parts.join('\n\n')
}

function fullNodeList(nodes: ContentNode[]): string {
  const rows = nodes
    .map(
      n =>
        `| \`${n.id}\` | ${escapeMd(n.title)} | \`${n.slug}\` | ${n.locale} | ${n.niche.map(nn => `\`${nn}\``).join(', ')} |`
    )
    .join('\n')
  return `| ID | Title | Slug | Locale | Niches |\n|----|-------|------|--------|--------|\n${rows}`
}

function escapeMd(text: string): string {
  return text.replace(/\|/g, '\\|')
}

// ── Main script ─────────────────────────────────────────────────────────

async function main() {
  console.log('[linkgraph] Generating linkgraph report...')

  let graph: SerializableGraphV1
  try {
    const mod = await import('../src/content-graph.generated')
    graph = mod.contentGraphData
  } catch (_err) {
    console.error('[linkgraph] Failed to load content graph data.')
    console.error('[linkgraph] Run `bun run generate:content-graph` first.')
    process.exit(1)
  }

  if (!graph || !graph.edges || !graph.nodes) {
    console.error('[linkgraph] Content graph data is empty or malformed.')
    process.exit(1)
  }

  console.log(`[linkgraph] Loaded ${graph.nodes.length} nodes and ${graph.edges.length} edges`)

  // --- Edge kind distribution ---
  const distribution = buildEdgeDistribution(graph.edges)
  console.log(`[linkgraph] Edge kinds: ${distribution.map(e => `${e.kind}=${e.count}`).join(', ')}`)

  // --- Reciprocity ---
  const reciprocity = computeReciprocity(graph.edges)
  for (const r of reciprocity) {
    console.log(
      `[linkgraph] Reciprocity ${r.kind}: ${r.reciprocalCount}/${r.total} (${r.reciprocalPct}%)${r.expectedAsymmetric ? ' [expected asymmetric]' : ''}`
    )
  }

  // --- Degree centrality ---
  const degree = computeDegreeCentrality(graph.edges, graph.nodes)
  console.log(
    `[linkgraph] Top node: ${degree[0]?.title ?? 'N/A'} (degree ${degree[0]?.total ?? 0})`
  )

  // --- Niche connectivity ---
  const niche = computeNicheConnectivity(graph.edges, graph.nodes)
  console.log(`[linkgraph] Niches: ${niche.length}`)

  // --- Build report ---
  const report = [
    '# Linkgraph Report',
    '',
    `**Generated:** ${formatTimestamp()}`,
    `**Source:** content-graph.generated (${graph.generatedAt})`,
    `**Nodes:** ${graph.nodes.length}`,
    `**Edges:** ${graph.edges.length}`,
    '',
    '## Edge Kind Distribution',
    '',
    edgeDistributionTable(distribution),
    '',
    '## Edge Reciprocity',
    '',
    'Reciprocity measures how often edges of a given kind are bidirectional (A→B and B→A both exist).',
    'Kinds marked as *expected asymmetric* are designed to be one-directional; low reciprocity there is normal.',
    '',
    reciprocityTable(reciprocity),
    '',
    '## Top Linked Nodes (by degree centrality)',
    '',
    'Nodes with the highest total degree (inbound + outbound connections):',
    '',
    degreeTable(degree, 5),
    '',
    '> Full node list with individual degree scores: see appendix below.',
    '',
    '## Niche Connectivity',
    '',
    'For each niche, this section reports how many internal edges exist (edges where both endpoints share at least one niche) and which other niches it connects to.',
    '',
    nicheConnectivitySection(niche),
    '',
    '## Appendix: Full Node List',
    '',
    fullNodeList(graph.nodes),
    '',
    '---',
    '',
    `*Report generated by scripts/generate-linkgraph-report.ts at ${formatTimestamp()}*`,
    '',
  ].join('\n')

  const outputDir = join(process.cwd(), 'artifacts/linkgraph')
  mkdirSync(outputDir, { recursive: true })

  const outputPath = join(outputDir, 'linkgraph-report.md')
  writeFileSync(outputPath, report, 'utf-8')

  console.log(`[linkgraph] Report written to ${outputPath}`)
  console.log(`[linkgraph] Done — ${report.length} bytes written`)
}

// Only run main() when this module is the entry point (not when imported for tests)
const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('scripts/generate-linkgraph-report.ts') ||
    process.argv[1].endsWith('generate-linkgraph-report.ts'))

if (isMain) {
  await main().catch(err => {
    console.error('[linkgraph] Script failed:', err)
    process.exit(1)
  })
}
