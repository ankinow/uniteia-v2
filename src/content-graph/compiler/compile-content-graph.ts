import matter from 'gray-matter'
import type { ContentGraph, SerializableContentGraph } from '../contracts/graph'
import type {
  ContentLocale,
  ContentNode,
  ContentNodeLifecycle,
  ContentNodeVerdict,
  ContentNodeVisibility,
} from '../contracts/node'
import { compileGroups } from './compile-groups'
import { compileLocales } from './compile-locales'
import { compileRelated } from './compile-related'
import { compileRouting } from './compile-routing'
import { compileTaxonomy } from './compile-taxonomy'

export interface CompileInput {
  registry: Record<string, string>
  locales: ContentLocale[]
  defaultLocale: ContentLocale
}

export function compileContentGraph(input: CompileInput): ContentGraph {
  const nodes = new Map<string, ContentNode>()

  for (const [path, raw] of Object.entries(input.registry)) {
    const node = parseRegistryEntry(path, raw, input.defaultLocale)
    if (!node) continue
    nodes.set(node.id, node)
  }

  compileTaxonomy(nodes)
  compileRouting(nodes)
  compileLocales(nodes)
  compileRelated(nodes)

  const groups = compileGroups(nodes)
  const allNodes = Array.from(nodes.values())

  const collections = buildCollections(allNodes, groups)

  const graph: ContentGraph = {
    nodes,
    groups,
    collections,
    metadata: {
      totalNodes: nodes.size,
      lastGenerated: new Date().toISOString(),
      version: '2026.05',
      packageSources: derivePackageSources(allNodes),
    },
  }

  return graph
}

export function serializeGraph(graph: ContentGraph): SerializableContentGraph {
  const nodeEntries: Record<string, ContentNode> = {}
  for (const [id, node] of graph.nodes) {
    nodeEntries[id] = node
  }

  return {
    nodes: nodeEntries,
    groups: graph.groups,
    collections: {
      featured: graph.collections.featured.map(n => n.id),
      byNiche: mapValues(graph.collections.byNiche, arr => arr.map(n => n.id)),
      byLocale: mapValues(graph.collections.byLocale, arr => arr.map(n => n.id)),
      public: graph.collections.public.map(n => n.id),
    },
    metadata: graph.metadata,
  }
}

export function deserializeGraph(serialized: SerializableContentGraph): ContentGraph {
  const nodes = new Map<string, ContentNode>()
  for (const [id, node] of Object.entries(serialized.nodes)) {
    nodes.set(id, node as ContentNode)
  }

  const resolve = (ids: string[]) => ids.map(id => nodes.get(id)).filter(Boolean) as ContentNode[]

  const resolveGroup = (g: import('../contracts/group').ContentGroup) => ({
    ...g,
    nodes: g.nodes.map(n => nodes.get(n.id)).filter(Boolean) as ContentNode[],
  })

  const groups = serialized.groups
    ? {
        ...serialized.groups,
        groups: serialized.groups.groups.map(resolveGroup),
        fullySymmetric: serialized.groups.fullySymmetric.map(resolveGroup),
        publicGroups: serialized.groups.publicGroups.map(resolveGroup),
        byCompletion: {
          complete: (serialized.groups.byCompletion?.complete ?? []).map(resolveGroup),
          partial: (serialized.groups.byCompletion?.partial ?? []).map(resolveGroup),
          incomplete: (serialized.groups.byCompletion?.incomplete ?? []).map(resolveGroup),
        },
      }
    : undefined

  return {
    nodes,
    groups: groups ?? compileGroups(nodes),
    collections: {
      featured: resolve(serialized.collections.featured),
      byNiche: mapValues(serialized.collections.byNiche, resolve),
      byLocale: mapValues(serialized.collections.byLocale, resolve),
      public: resolve(serialized.collections.public),
    },
    metadata: serialized.metadata,
  }
}

function parseRegistryEntry(
  path: string,
  raw: string,
  _defaultLocale: ContentLocale
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

  const isDraft = verdict !== 'trusted' || qualityScore < 95
  const visibility: ContentNodeVisibility = isDraft ? 'draft' : 'published'
  const lifecycle: ContentNodeLifecycle = isDraft ? 'generated' : 'published'
  const v: ContentNodeVerdict =
    qualityScore >= 95 ? 'safe' : qualityScore >= 50 ? 'caution' : 'unsafe'

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
    qualityScore,
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
      noindex: isDraft,
      priority: qualityScore,
    },
    timestamps: {
      createdAt: (metadata?.created_at as string) ?? new Date().toISOString(),
      updatedAt: (metadata?.updated_at as string) ?? new Date().toISOString(),
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

function buildCollections(
  allNodes: ContentNode[],
  groups: import('../contracts/group').ContentGroupCollection
): ContentGraph['collections'] {
  const byNiche: Record<string, ContentNode[]> = {}
  const byLocale: Record<string, ContentNode[]> = {}

  const publicGroupIds = new Set(groups.publicGroups.flatMap(g => g.nodes.map(n => n.id)))

  for (const node of allNodes) {
    for (const n of node.niche) {
      if (!byNiche[n]) byNiche[n] = []
      byNiche[n]?.push(node)
    }
    if (!byLocale[node.locale]) byLocale[node.locale] = []
    byLocale[node.locale]?.push(node)
  }

  const featured = allNodes
    .filter(n => publicGroupIds.has(n.id))
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, 12)

  const publicNodes = allNodes.filter(n => publicGroupIds.has(n.id))

  return {
    featured,
    byNiche,
    byLocale: byLocale as Record<ContentLocale, ContentNode[]>,
    public: publicNodes,
  }
}

function derivePackageSources(nodes: ContentNode[]): string[] {
  const sources = new Set<string>()
  for (const node of nodes) {
    if (node.slug.includes('tencent-cloud') || node.slug.includes('creator-ai')) {
      sources.add('uniteia-mega-factory')
    }
    if (node.slug.includes('foundation-models') || node.slug.includes('llm-aggregators')) {
      sources.add('uniteia-editorial')
    }
  }
  return Array.from(sources)
}

function mapValues<K extends string, V, R>(
  obj: Record<K, V[]>,
  fn: (arr: V[]) => R[]
): Record<K, R[]> {
  const result: Record<string, R[]> = {}
  for (const [key, val] of Object.entries(obj)) {
    result[key] = fn(val as V[])
  }
  return result as Record<K, R[]>
}
