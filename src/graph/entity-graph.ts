/**
 * entity-graph.ts
 *
 * P0.1: Graph builder — orchestrates entity extraction across all articles,
 * deduplicates entities, builds indexes, and serializes to EntityGraph.
 *
 * Pipeline:
 *   1. Scan content/apex/{locale}/*.md
 *   2. Parse frontmatter → extract entities + edges
 *   3. Merge across all articles (deduplicate categories, brands, products)
 *   4. Add cross-locale translation edges
 *   5. Build indexes
 *   6. Validate schema
 *   7. Serialize to JSON
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { extractEntities, parseFrontmatter } from './entity-extractor'
import type { Edge, Entity, EntityGraph, EntityType } from './types'
import { validateEntityGraph } from './types'

export const LOCALES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const
export type Locale = (typeof LOCALES)[number]

export interface BuildInput {
  /** Root content directory (e.g., content/apex) */
  contentDir: string
  /** Locales to process */
  locales?: Locale[]
}

export interface BuildResult {
  graph: EntityGraph
  stats: {
    totalArticles: number
    totalEntities: number
    totalEdges: number
    byType: Partial<Record<EntityType, number>>
    errors: string[]
  }
}

/**
 * Discover markdown files for a given locale.
 */
function discoverMarkdownFiles(contentDir: string, locale: string): string[] {
  const dir = join(contentDir, locale)
  if (!existsSync(dir)) return []

  try {
    return readdirSync(dir)
      .filter(f => f.endsWith('.md') && f !== '_index.md')
      .map(f => join(dir, f))
  } catch {
    return []
  }
}

/**
 * Build the full entity graph from article markdown files.
 */
export function buildEntityGraph(input: BuildInput): BuildResult {
  const { contentDir } = input
  const locales = input.locales ?? (LOCALES as unknown as Locale[])
  const errors: string[] = []

  // Phase 1: Extract entities from all articles
  const allEntities = new Map<string, Entity>()
  const allEdges: Edge[] = []
  const articleIds: string[] = []
  const articlesBySlug: Record<string, string[]> = {} // canonicalSlug → [entityId]

  for (const locale of locales) {
    const files = discoverMarkdownFiles(contentDir, locale)

    for (const filePath of files) {
      try {
        const raw = readFileSync(filePath, 'utf-8')
        const frontmatter = parseFrontmatter(raw)
        if (!frontmatter) {
          errors.push(`No frontmatter in ${filePath}`)
          continue
        }

        const result = extractEntities(filePath, frontmatter)
        const articleEntity = result.entities.find(e => e.type === 'article')
        if (!articleEntity) {
          errors.push(`No article entity extracted from ${filePath}`)
          continue
        }

        articleIds.push(articleEntity.id)

        // Track by canonical slug for cross-locale linking
        const slug = frontmatter.slug
        if (!articlesBySlug[slug]) articlesBySlug[slug] = []
        articlesBySlug[slug].push(articleEntity.id)

        // Merge entities (deduplicate by id)
        for (const entity of result.entities) {
          if (!allEntities.has(entity.id)) {
            allEntities.set(entity.id, entity)
          }
        }

        allEdges.push(...result.edges)
      } catch (err) {
        errors.push(
          `Error processing ${filePath}: ${err instanceof Error ? err.message : String(err)}`
        )
      }
    }
  }

  // Phase 2: Add cross-locale translation edges
  for (const [, ids] of Object.entries(articlesBySlug)) {
    if (ids.length < 2) continue
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const source = ids[i]!
        const target = ids[j]!
        allEdges.push({
          source,
          target,
          kind: 'translated_as',
          weight: 1.0,
        })
      }
    }
  }

  // Phase 3: Add "related_to" edges between articles sharing subjects
  const articleEntities = Array.from(allEntities.values()).filter(e => e.type === 'article')
  for (let i = 0; i < articleEntities.length; i++) {
    for (let j = i + 1; j < articleEntities.length; j++) {
      const a = articleEntities[i]!
      const b = articleEntities[j]!
      if (a.locale === b.locale) {
        allEdges.push({
          source: a.id,
          target: b.id,
          kind: 'related_to',
          weight: 0.3,
        })
      }
    }
  }

  // Phase 4: Build indexes
  const nodes = Array.from(allEntities.values())
  const byId: Record<string, number> = {}
  const byType: Partial<Record<EntityType, string[]>> = {}
  const byLocale: Record<string, string[]> = {}

  nodes.forEach((node, index) => {
    byId[node.id] = index

    if (!byType[node.type]) byType[node.type] = []
    byType[node.type]?.push(node.id)

    if (node.locale) {
      if (!byLocale[node.locale]) byLocale[node.locale] = []
      byLocale[node.locale]?.push(node.id)
    }
  })

  const graph: EntityGraph = {
    version: 'entity-graph.v1',
    generatedAt: new Date().toISOString(),
    nodes,
    edges: allEdges,
    indexes: { byId, byType, byLocale },
  }

  // Phase 5: Validate
  const schemaErrors = validateEntityGraph(graph)
  if (schemaErrors.length > 0) {
    errors.push(...schemaErrors.map(e => `Schema: ${e}`))
  }

  // Stats
  const byTypeCount: Partial<Record<EntityType, number>> = {}
  for (const type of Object.keys(byType) as EntityType[]) {
    byTypeCount[type] = byType[type]?.length ?? 0
  }

  return {
    graph,
    stats: {
      totalArticles: articleIds.length,
      totalEntities: nodes.length,
      totalEdges: allEdges.length,
      byType: byTypeCount,
      errors,
    },
  }
}
