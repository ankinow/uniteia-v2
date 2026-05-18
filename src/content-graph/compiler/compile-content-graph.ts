import type { ContentNode as ContractContentNode } from '@uniteia/content-node-contract'
import matter from 'gray-matter'
import type { ContentGraph, SerializableContentGraph } from '../contracts/graph'
import type {
  ContentLocale,
  ContentNode,
  ContentNodeLifecycle,
  ContentNodeVerdict,
  ContentNodeVisibility,
} from '../contracts/node'
import { compileLocales } from './compile-locales'
import { compileRelated } from './compile-related'
import { compileRouting } from './compile-routing'
import { compileTaxonomy } from './compile-taxonomy'

export interface CompileInput {
  registry: Record<string, string>
  locales: ContentLocale[]
  defaultLocale: ContentLocale
  /**
   * Optional factory-provided ContentNode records (from content-nodes.json).
   * Keyed by "{locale}-{canonicalSlug}". When present, the compiler prefers
   * factory-provided qualityScore, trustScore, visibility, lifecycle, verdict, seo, timestamps.
   */
  factoryNodes?: Record<string, ContractContentNode>
}

export function compileContentGraph(input: CompileInput): ContentGraph {
  const nodes = new Map<string, ContentNode>()
  const factoryMap = input.factoryNodes ?? {}

  for (const [path, raw] of Object.entries(input.registry)) {
    const node = parseRegistryEntry(path, raw, input.defaultLocale, factoryMap)
    if (!node) continue
    nodes.set(node.id, node)
  }

  compileTaxonomy(nodes)
  compileRouting(nodes)
  compileLocales(nodes)
  compileRelated(nodes)

  const allNodes = Array.from(nodes.values()) as ContentNode[] & {
    get(id: string): ContentNode | undefined
    has(id: string): boolean
  }
  allNodes.get = (id: string) => nodes.get(id)
  allNodes.has = (id: string) => nodes.has(id)

  const groupsMap = new Map<string, ContentNode[]>()
  for (const node of allNodes) {
    const key = node.canonicalSlug
    const group = groupsMap.get(key) ?? []
    group.push(node)
    groupsMap.set(key, group)
  }

  const nichesMap = new Map<string, ContentNode[]>()
  for (const node of allNodes) {
    for (const niche of node.niche) {
      const list = nichesMap.get(niche) ?? []
      list.push(node)
      nichesMap.set(niche, list)
    }
  }

  computeGraphScores(allNodes)

  return {
    nodes: allNodes,
    groups: groupsMap,
    niches: nichesMap,
  }
}

export function serializeGraph(graph: ContentGraph): SerializableContentGraph {
  const nodeEntries: Record<string, ContentNode> = {}
  for (const node of graph.nodes) {
    nodeEntries[node.id] = node
  }

  const groupsObj: Record<string, string[]> = {}
  for (const [key, list] of graph.groups.entries()) {
    groupsObj[key] = list.map(n => n.id)
  }

  const nichesObj: Record<string, string[]> = {}
  for (const [key, list] of graph.niches.entries()) {
    nichesObj[key] = list.map(n => n.id)
  }

  return {
    nodes: nodeEntries,
    groups: groupsObj,
    niches: nichesObj,
  }
}

function parseRegistryEntry(
  path: string,
  raw: string,
  _defaultLocale: ContentLocale,
  factoryMap?: Record<string, ContractContentNode>
): ContentNode | null {
  const match = path.match(/\.\/content\/([^/]+)\/([^/]+)\/(.+)\.md$/)
  if (!match) return null

  const niche = match[1]
  const localeStr = match[2]
  const slugWithExt = match[3]

  if (!niche || !localeStr || !slugWithExt) return null
  if (slugWithExt === '_index') return null

  const locale = localeStr as ContentLocale
  const frontmatter = parseFrontmatter(raw)
  if (!frontmatter) return null

  const title = (frontmatter.title as string) ?? slugWithExt
  const qualityScore = (frontmatter.quality_score as number) ?? 0
  const verdict = (frontmatter.verdict as string) ?? 'caution'
  const subjects = (frontmatter.subjects as string[]) ?? [niche]
  const metadata = frontmatter.metadata as Record<string, unknown> | undefined
  const canonicalSlug = (frontmatter.canonical_slug as string) ?? slugWithExt
  const body = matter(raw).content

  const id = `${locale}-${canonicalSlug}`

  // Check for factory-provided ContentNode metadata (L2 bridge contract)
  const factoryNode = factoryMap?.[id]

  const isDraft: boolean = factoryNode
    ? factoryNode.visibility === 'draft'
    : verdict !== 'trusted' || qualityScore < 95
  const visibility: ContentNodeVisibility = factoryNode
    ? factoryNode.visibility
    : isDraft
      ? 'draft'
      : 'published'
  const lifecycle: ContentNodeLifecycle = factoryNode
    ? factoryNode.lifecycle
    : isDraft
      ? 'generated'
      : 'published'
  const v: ContentNodeVerdict = factoryNode
    ? factoryNode.verdict
    : qualityScore >= 95
      ? 'safe'
      : qualityScore >= 50
        ? 'caution'
        : 'unsafe'

  // Prefer factory qualityScore and trustScore, fall back to computed
  const effectiveQualityScore = factoryNode?.qualityScore ?? qualityScore
  const trustScore = factoryNode?.trustScore ?? computeTrustScore(verdict, qualityScore)
  const seoNoindex = factoryNode?.seo.noindex ?? isDraft
  const seoPriority = factoryNode?.seo.priority ?? effectiveQualityScore
  const createdAt =
    factoryNode?.timestamps.createdAt ??
    (metadata?.created_at as string) ??
    new Date().toISOString()
  const updatedAt =
    factoryNode?.timestamps.updatedAt ??
    (metadata?.updated_at as string) ??
    new Date().toISOString()
  const semanticDensity = computeSemanticDensity(body, subjects)
  const freshnessScore = computeFreshnessScore(
    (metadata?.updated_at as string) ?? (metadata?.created_at as string)
  )

  return {
    id,
    locale,
    canonicalLocale: locale,
    slug: slugWithExt,
    canonicalSlug,
    title,
    summary: extractSummary(body),
    niche: [niche],
    tags: subjects,
    entities: [],
    qualityScore: effectiveQualityScore,
    trustScore,
    visibility,
    lifecycle,
    verdict: v,
    routes: {
      canonical: '',
      aliases: [],
    },
    alternates: {},
    related: [],
    seo: {
      noindex: seoNoindex,
      priority: seoPriority,
    },
    timestamps: {
      createdAt,
      updatedAt,
    },
    metrics: {
      edgeRank: 0,
      semanticDensity,
      freshnessScore,
      graphScore: 0,
    },
  }
}

function parseFrontmatter(raw: string): Record<string, unknown> | null {
  try {
    const parsed = matter(raw)
    return parsed.data as Record<string, unknown>
  } catch {
    return null
  }
}

function extractSummary(body: string): string {
  const cleaned = body
    .replace(/^#\s+.*$/m, '')
    .replace(/[#*>`\[\]]/g, '')
    .trim()
  return cleaned.slice(0, 200).replace(/\s+\S*$/, '')
}

function computeTrustScore(verdict: string, qualityScore: number): number {
  if (verdict === 'trusted' || verdict === 'safe') return qualityScore
  if (verdict === 'caution') return Math.min(qualityScore * 0.6, 80)
  return Math.min(qualityScore * 0.3, 30)
}

function computeSemanticDensity(body: string, tags: string[]): number {
  const contentLength = body.length
  if (contentLength === 0) return 0
  const tagDensity = Math.min(tags.length / 3, 1)
  const contentDensity = Math.min(contentLength / 500, 1)
  return Math.round((tagDensity * 0.4 + contentDensity * 0.6) * 100)
}

function computeFreshnessScore(updatedAt: string | undefined): number {
  if (!updatedAt) return 0
  const updated = new Date(updatedAt).getTime()
  if (Number.isNaN(updated)) return 50
  const now = Date.now()
  const ageDays = (now - updated) / (1000 * 60 * 60 * 24)
  if (ageDays < 7) return 100
  if (ageDays < 30) return 90
  if (ageDays < 90) return 75
  if (ageDays < 180) return 50
  return 25
}

function computeGraphScores(allNodes: ContentNode[]): void {
  const totalNodes = allNodes.length
  if (totalNodes === 0) return

  const incomingEdges = new Map<string, number>()
  for (const node of allNodes) {
    for (const relatedId of node.related) {
      incomingEdges.set(relatedId, (incomingEdges.get(relatedId) ?? 0) + 1)
    }
  }

  for (const node of allNodes) {
    const edgeRank = Math.round(((incomingEdges.get(node.id) ?? 0) / Math.max(totalNodes, 1)) * 100)
    const graphScore = Math.round(
      node.qualityScore * 0.25 +
        node.trustScore * 0.25 +
        node.metrics.semanticDensity * 0.2 +
        node.metrics.freshnessScore * 0.15 +
        edgeRank * 0.15
    )

    node.metrics.edgeRank = edgeRank
    node.metrics.graphScore = graphScore
  }
}
