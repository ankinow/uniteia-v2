import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { LOCALE_BCP47_TO_V2 } from '@uniteia/content-node-contract'
import { compileContentGraph, serializeGraphArtifacts } from '../src/content-graph'

const GENERATED_DIR = resolve(import.meta.dirname, '..', 'src', 'content-graph', 'generated')
const GENERATED_TS = resolve(import.meta.dirname, '..', 'src', 'content-graph.generated.ts')
const CONTENT_METADATA_DIR = resolve(import.meta.dirname, '..', 'content-metadata')

/**
 * Normalize a factory node ID from BCP47 locale prefix to v2 internal locale code.
 * E.g., "pt-BR-roundtrip-test-fixture" → "pt-roundtrip-test-fixture"
 * Identity mappings (en→en, es→es, etc.) are skipped.
 */
function normalizeBcp47NodeId(id: string): string {
  for (const [bcp47, v2] of Object.entries(LOCALE_BCP47_TO_V2)) {
    if (bcp47 === v2) continue
    const prefix = `${bcp47}-`
    if (id.startsWith(prefix)) {
      return id.replace(prefix, `${v2}-`)
    }
  }
  return id
}

/**
 * Normalize all locale-related fields in a factory node from BCP47 to v2 internal locale codes.
 * Mutates the node in place and returns the normalized id.
 */
function normalizeFactoryNode(node: Record<string, unknown>): string {
  const rawId = node.id as string
  const normalizedId = normalizeBcp47NodeId(rawId)

  // Normalize the locale and canonicalLocale fields
  if (node.locale && LOCALE_BCP47_TO_V2[node.locale as keyof typeof LOCALE_BCP47_TO_V2]) {
    node.locale = LOCALE_BCP47_TO_V2[node.locale as keyof typeof LOCALE_BCP47_TO_V2]
  }
  if (
    node.canonicalLocale &&
    LOCALE_BCP47_TO_V2[node.canonicalLocale as keyof typeof LOCALE_BCP47_TO_V2]
  ) {
    node.canonicalLocale =
      LOCALE_BCP47_TO_V2[node.canonicalLocale as keyof typeof LOCALE_BCP47_TO_V2]
  }

  // Normalize alternates keys and values (pt-BR → pt in locale keys and ID values)
  if (node.alternates && typeof node.alternates === 'object') {
    const normalized: Record<string, string> = {}
    for (const [key, val] of Object.entries(node.alternates)) {
      const v2Key = LOCALE_BCP47_TO_V2[key as keyof typeof LOCALE_BCP47_TO_V2] ?? key
      normalized[v2Key] = typeof val === 'string' ? normalizeBcp47NodeId(val) : String(val)
    }
    node.alternates = normalized
  }

  node.id = normalizedId
  return normalizedId
}

async function main() {
  const buildLocale = process.env.LOCALE || 'en'
  console.log(`[content-graph] Generating content graph for locale: ${buildLocale}...`)

  const { contentRegistry } = await import('../src/content-registry.generated')
  // Filter registry to only include entries for the build locale
  // contentRegistry is Record<string, string> with keys like './content/apex/en/slug.md'
  const filteredRegistry: Record<string, string> = {}
  let totalEntries = 0
  for (const [key, value] of Object.entries(contentRegistry)) {
    totalEntries++
    const localeMatch = key.match(/\/content\/apex\/([a-z]{2})\//)
    if (localeMatch && localeMatch[1] === buildLocale) {
      filteredRegistry[key] = value
    }
  }
  console.log(
    `[content-graph] Filtered registry: ${Object.keys(filteredRegistry).length} entries (from ${totalEntries})`
  )

  // Load factory-provided ContentNodes from content-metadata dirs
  const factoryNodes: Record<string, unknown> = {}
  if (existsSync(CONTENT_METADATA_DIR)) {
    const slugs = (await import('node:fs')).readdirSync(CONTENT_METADATA_DIR)
    for (const slug of slugs) {
      const nodePath = resolve(CONTENT_METADATA_DIR, slug, 'content-nodes.json')
      if (existsSync(nodePath)) {
        try {
          const nodes = JSON.parse(readFileSync(nodePath, 'utf-8'))
          if (Array.isArray(nodes)) {
            for (const node of nodes) {
              if (node.id) {
                // Normalize BCP47 locale prefix to v2 internal code
                // E.g., "pt-BR-slug" → "pt-slug", locale "pt-BR" → "pt"
                const normalizedId = normalizeFactoryNode(node)
                factoryNodes[normalizedId] = node
              }
            }
          }
        } catch {
          // Skip invalid content-nodes.json
        }
      }
    }
    console.log(`[content-graph] Loaded ${Object.keys(factoryNodes).length} factory nodes`)
  }

  const graph = compileContentGraph({
    registry: filteredRegistry,
    locales: [buildLocale],
    defaultLocale: buildLocale,
    // biome-ignore lint/suspicious/noExplicitAny: factory nodes come from dynamic LLM output with unknown shape
    factoryNodes: factoryNodes as Record<string, any>,
  })

  const artifacts = serializeGraphArtifacts(graph)

  mkdirSync(GENERATED_DIR, { recursive: true })

  const files: [string, string][] = [
    ['content-graph.v1.json', JSON.stringify(artifacts.graph, null, 2)],
    ['route-manifest.v1.json', JSON.stringify(artifacts.routeManifest, null, 2)],
    ['locale-index.v1.json', JSON.stringify(artifacts.localeIndex, null, 2)],
    ['taxonomy-index.v1.json', JSON.stringify(artifacts.taxonomyIndex, null, 2)],
    ['related-index.v1.json', JSON.stringify(artifacts.relatedIndex, null, 2)],
    ['visibility-index.v1.json', JSON.stringify(artifacts.visibilityIndex, null, 2)],
  ]

  for (const [filename, data] of files) {
    writeFileSync(resolve(GENERATED_DIR, filename), data, 'utf-8')
  }

  // Also generate a TypeScript module that routes can import
  const graphJson = JSON.stringify(artifacts.graph)
  const escapedJson = graphJson.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  const generatedTs = [
    '// AUTO-GENERATED by scripts/generate-content-graph.ts',
    "import { createStaticProvider } from './content-graph/loaders/create-static-provider'",
    "import type { SerializableGraphV1 } from './content-graph/contracts/artifacts'",
    '',
    `const _data: SerializableGraphV1 = JSON.parse('${escapedJson}')`,
    '',
    'export const contentGraphProvider = createStaticProvider(_data)',
    'export const contentGraphData = _data',
    '',
  ].join('\n')
  writeFileSync(GENERATED_TS, generatedTs, 'utf-8')

  console.log(`[content-graph] Generated ${graph.nodes.length} nodes`)
  console.log(`[content-graph] Public: ${artifacts.graph.indexes.public.length}`)
  console.log(`[content-graph] Edges: ${artifacts.graph.edges.length}`)
  console.log(`[content-graph] Written ${files.length} artifact files to ${GENERATED_DIR}`)
  console.log(`[content-graph] Written generated TS module to ${GENERATED_TS}`)
}

main().catch(err => {
  console.error('[content-graph] Failed:', err)
  process.exit(1)
})
