#!/usr/bin/env bun
/**
 * SEO Verification Report Generator
 *
 * Verifies hreflang bidirectionality, sitemap coherence, noindex alignment,
 * canonical integrity, and priority distribution across the content graph.
 * Writes to artifacts/seo/seo-verification-report.md.
 *
 * Usage: bun run scripts/generate-seo-verification.ts
 * Prerequisite: bun run generate:content-graph
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { SerializableGraphV1 } from '../src/content-graph/contracts/artifacts'
import type { ContentLocale, ContentNode } from '../src/content-graph/contracts/node'

// ── Result types ────────────────────────────────────────────────────────

export interface HreflangIssue {
  nodeId: string
  locale: ContentLocale
  targetUrl: string
  targetNodeId: string
  reciprocalMissing: boolean
  reciprocalPointsWrong: boolean
}

export interface SitemapIssue {
  nodeId: string
  problem: 'sitemap-listed-not-published' | 'published-not-sitemap-listed'
  visibility?: string
}

export interface NoindexIssue {
  nodeId: string
  problem: 'published-with-noindex' | 'noindex-without-draft-or-generated-lifecycle'
  visibility?: string
  lifecycle?: string
}

export interface CanonicalIssue {
  nodeId: string
  canonicalUrl: string
  problem: 'does-not-resolve' | 'resolves-to-different-node'
  resolvedNodeId?: string
}

export interface PriorityBucket {
  range: string
  count: number
  nodes: string[]
}

export interface SeoVerificationReport {
  timestamp: string
  totalNodes: number
  checks: {
    hreflangReciprocity: { passed: boolean; issues: HreflangIssue[] }
    sitemapCoherence: { passed: boolean; issues: SitemapIssue[] }
    noindexAlignment: { passed: boolean; issues: NoindexIssue[] }
    canonicalCoherence: { passed: boolean; issues: CanonicalIssue[] }
    priorityDistribution: { buckets: PriorityBucket[] }
  }
}

// ── Core verification functions (exported for testing) ──────────────────

/**
 * Check hreflang reciprocity.
 * For each node with alternates, verify that for every (locale, url) pair,
 * the target node at that url has a reciprocal alternate pointing back.
 * Handles empty alternates {} gracefully.
 */
export function checkHreflangReciprocity(
  nodes: ContentNode[],
  routeToNodeId: Record<string, string>
): HreflangIssue[] {
  const issues: HreflangIssue[] = []
  const nodeMap = new Map<string, ContentNode>()
  for (const n of nodes) {
    nodeMap.set(n.id, n)
  }

  for (const node of nodes) {
    const alternateEntries = Object.entries(node.alternates) as [ContentLocale, string][]
    if (alternateEntries.length === 0) continue // nothing to check

    for (const [locale, targetUrl] of alternateEntries) {
      const targetNodeId = routeToNodeId[targetUrl]
      if (!targetNodeId) {
        // Target URL doesn't resolve — flag but this is more of a canonical issue
        continue
      }

      const targetNode = nodeMap.get(targetNodeId)
      if (!targetNode) continue

      // Check if target node has a reciprocal alternate for this node's locale
      const reciprocalUrl = targetNode.alternates[node.locale]
      if (!reciprocalUrl) {
        issues.push({
          nodeId: node.id,
          locale,
          targetUrl,
          targetNodeId,
          reciprocalMissing: true,
          reciprocalPointsWrong: false,
        })
        continue
      }

      // Verify the reciprocal URL resolves back to the original node
      const backNodeId = routeToNodeId[reciprocalUrl]
      if (backNodeId !== node.id) {
        issues.push({
          nodeId: node.id,
          locale,
          targetUrl,
          targetNodeId,
          reciprocalMissing: false,
          reciprocalPointsWrong: true,
        })
      }
    }
  }

  return issues
}

/**
 * Check sitemap coherence:
 * - All nodes in indexes.sitemapEligible must be public (visibility === 'published')
 * - All public nodes must appear in indexes.sitemapEligible
 */
export function checkSitemapCoherence(
  nodes: ContentNode[],
  sitemapEligible: string[],
  publicNodeIds: string[]
): SitemapIssue[] {
  const issues: SitemapIssue[] = []
  const sitemapSet = new Set(sitemapEligible)
  const nodeMap = new Map<string, ContentNode>()
  for (const n of nodes) {
    nodeMap.set(n.id, n)
  }

  // Check: every sitemap-eligible node must be published
  for (const nodeId of sitemapEligible) {
    const node = nodeMap.get(nodeId)
    if (!node) continue
    if (node.visibility !== 'published') {
      issues.push({
        nodeId,
        problem: 'sitemap-listed-not-published',
        visibility: node.visibility,
      })
    }
  }

  // Check: every public node must be sitemap-eligible
  for (const nodeId of publicNodeIds) {
    if (!sitemapSet.has(nodeId)) {
      issues.push({
        nodeId,
        problem: 'published-not-sitemap-listed',
        visibility: 'published',
      })
    }
  }

  return issues
}

/**
 * Check noindex alignment:
 * - Nodes with seo.noindex === true must have visibility !== 'published'
 *   or lifecycle in ['generated', 'deprecated']
 * - Published nodes must not have noindex set
 */
export function checkNoindexAlignment(nodes: ContentNode[]): NoindexIssue[] {
  const issues: NoindexIssue[] = []

  for (const node of nodes) {
    if (node.seo.noindex) {
      // Node has noindex — it should not be published (or be in generated/deprecated lifecycle)
      if (
        node.visibility === 'published' &&
        !['generated', 'deprecated'].includes(node.lifecycle)
      ) {
        issues.push({
          nodeId: node.id,
          problem: 'published-with-noindex',
          visibility: node.visibility,
          lifecycle: node.lifecycle,
        })
      }
      if (node.visibility === 'published' && ['generated', 'deprecated'].includes(node.lifecycle)) {
        // Published with noindex but lifecycle is generated/deprecated — acceptable per spec
        continue
      }
    } else {
      // Node does NOT have noindex — it should not be non-published unless lifecycle justifies it
      // Actually, only check: published nodes shouldn't have noindex
      // The inverse (non-published without noindex) is fine
      if (node.visibility === 'published') {
        // This is fine — published without noindex
      }
    }
  }

  return issues
}

/**
 * Check canonical coherence:
 * For each node, verify routes.canonical resolves to a valid node
 * via indexes.byRoute. Flag any canonical URL that doesn't resolve
 * or points to a different node.
 */
export function checkCanonicalCoherence(
  nodes: ContentNode[],
  routeToNodeId: Record<string, string>
): CanonicalIssue[] {
  const issues: CanonicalIssue[] = []

  for (const node of nodes) {
    const canonicalUrl = node.routes.canonical
    const resolvedNodeId = routeToNodeId[canonicalUrl]

    if (!resolvedNodeId) {
      issues.push({
        nodeId: node.id,
        canonicalUrl,
        problem: 'does-not-resolve',
      })
      continue
    }

    if (resolvedNodeId !== node.id) {
      issues.push({
        nodeId: node.id,
        canonicalUrl,
        problem: 'resolves-to-different-node',
        resolvedNodeId,
      })
    }
  }

  return issues
}

/**
 * Build priority distribution histogram.
 * Buckets: 0-20, 21-40, 41-60, 61-80, 81-100
 */
export function buildPriorityHistogram(nodes: ContentNode[]): PriorityBucket[] {
  const buckets: PriorityBucket[] = [
    { range: '0–20', count: 0, nodes: [] },
    { range: '21–40', count: 0, nodes: [] },
    { range: '41–60', count: 0, nodes: [] },
    { range: '61–80', count: 0, nodes: [] },
    { range: '81–100', count: 0, nodes: [] },
  ]

  for (const node of nodes) {
    const p = node.seo.priority
    let idx: number
    if (p >= 0 && p <= 20) idx = 0
    else if (p >= 21 && p <= 40) idx = 1
    else if (p >= 41 && p <= 60) idx = 2
    else if (p >= 61 && p <= 80) idx = 3
    else idx = 4 // 81-100

    buckets[idx].count++
    buckets[idx].nodes.push(node.id)
  }

  return buckets
}

// ── Markdown formatting helpers ─────────────────────────────────────────

function formatTimestamp(): string {
  return new Date().toISOString()
}

function hreflangTable(issues: HreflangIssue[]): string {
  if (issues.length === 0) return '*No issues found.*'
  const rows = issues
    .map(i => {
      const desc = i.reciprocalMissing
        ? 'Missing reciprocal alternate'
        : 'Reciprocal URL points to wrong node'
      return `| ${i.nodeId} | \`${i.locale}\` → \`${i.targetUrl}\` | ${i.targetNodeId} | ${desc} |`
    })
    .join('\n')
  return '| Node | Link | Target Node | Issue |\n|------|------|-------------|-------|\n' + rows
}

function sitemapTable(issues: SitemapIssue[]): string {
  if (issues.length === 0) return '*No issues found.*'
  const rows = issues
    .map(i => {
      const desc =
        i.problem === 'sitemap-listed-not-published'
          ? `Listed in sitemap but visibility is \`${i.visibility}\``
          : 'Published but not listed in sitemap'
      return `| ${i.nodeId} | ${desc} |`
    })
    .join('\n')
  return '| Node | Issue |\n|------|-------|\n' + rows
}

function noindexTable(issues: NoindexIssue[]): string {
  if (issues.length === 0) return '*No issues found.*'
  const rows = issues
    .map(i => {
      const desc =
        i.problem === 'published-with-noindex'
          ? `Published node has \`noindex: true\` (lifecycle: ${i.lifecycle})`
          : `Unpublished node without \`noindex\` (visibility: ${i.visibility}, lifecycle: ${i.lifecycle})`
      return `| ${i.nodeId} | ${desc} |`
    })
    .join('\n')
  return '| Node | Issue |\n|------|-------|\n' + rows
}

function canonicalTable(issues: CanonicalIssue[]): string {
  if (issues.length === 0) return '*No issues found.*'
  const rows = issues
    .map(i => {
      const desc =
        i.problem === 'does-not-resolve'
          ? 'Canonical URL does not resolve to any node'
          : `Resolves to \`${i.resolvedNodeId}\` instead of this node`
      return `| ${i.nodeId} | \`${i.canonicalUrl}\` | ${desc} |`
    })
    .join('\n')
  return '| Node | Canonical URL | Issue |\n|------|---------------|-------|\n' + rows
}

function priorityHistogram(buckets: PriorityBucket[]): string {
  const rows = buckets
    .map(b => {
      const bar = '█'.repeat(Math.max(1, b.count))
      return `| ${b.range} | ${b.count} | ${bar} |`
    })
    .join('\n')
  return '| Range | Count | Distribution |\n|-------|-------|--------------|\n' + rows
}

function perNodeSeoSnapshot(nodes: ContentNode[]): string {
  const rows = nodes
    .map(n => {
      const altLocales =
        Object.keys(n.alternates).length > 0 ? Object.keys(n.alternates).join(', ') : '*none*'
      return `| \`${n.id}\` | ${n.locale} | ${n.visibility} | ${n.lifecycle} | ${n.seo.noindex} | ${n.seo.priority} | ${n.routes.canonical} | ${altLocales} |`
    })
    .join('\n')
  return (
    '| Node | Locale | Visibility | Lifecycle | Noindex | Priority | Canonical URL | Alternates |\n|------|--------|------------|-----------|---------|----------|---------------|------------|\n' +
    rows
  )
}

// ── Main script ─────────────────────────────────────────────────────────

async function main() {
  console.log('[seo] Generating SEO verification report...')

  let graph: SerializableGraphV1
  try {
    const mod = await import('../src/content-graph.generated')
    graph = mod.contentGraphData
  } catch (err) {
    console.error('[seo] Failed to load content graph data.')
    console.error('[seo] Run `bun run generate:content-graph` first.')
    process.exit(1)
  }

  if (!graph || !graph.nodes || !graph.indexes) {
    console.error('[seo] Content graph data is empty or malformed.')
    process.exit(1)
  }

  const { nodes, indexes } = graph
  console.log(
    `[seo] Loaded ${nodes.length} nodes and ${indexes.sitemapEligible.length} sitemap-eligible entries`
  )

  // --- Hreflang reciprocity ---
  const hreflangIssues = checkHreflangReciprocity(nodes, indexes.byRoute)
  const hreflangPassed = hreflangIssues.length === 0
  console.log(
    `[seo] Hreflang reciprocity: ${hreflangPassed ? 'PASS' : 'FAIL'} (${hreflangIssues.length} issues)`
  )

  // --- Sitemap coherence ---
  // "Public nodes" = nodes with visibility === 'published'
  const allPublicNodeIds = nodes.filter(n => n.visibility === 'published').map(n => n.id)
  const sitemapIssues = checkSitemapCoherence(nodes, indexes.sitemapEligible, allPublicNodeIds)
  const sitemapPassed = sitemapIssues.length === 0
  console.log(
    `[seo] Sitemap coherence: ${sitemapPassed ? 'PASS' : 'FAIL'} (${sitemapIssues.length} issues)`
  )
  for (const si of sitemapIssues) {
    console.log(`[seo]   Sitemap issue: ${si.nodeId} — ${si.problem}`)
  }

  // --- Noindex alignment ---
  const noindexIssues = checkNoindexAlignment(nodes)
  const noindexPassed = noindexIssues.length === 0
  console.log(
    `[seo] Noindex alignment: ${noindexPassed ? 'PASS' : 'FAIL'} (${noindexIssues.length} issues)`
  )

  // --- Canonical coherence ---
  const canonicalIssues = checkCanonicalCoherence(nodes, indexes.byRoute)
  const canonicalPassed = canonicalIssues.length === 0
  console.log(
    `[seo] Canonical coherence: ${canonicalPassed ? 'PASS' : 'FAIL'} (${canonicalIssues.length} issues)`
  )

  // --- Priority distribution ---
  const buckets = buildPriorityHistogram(nodes)
  for (const b of buckets) {
    if (b.count > 0) {
      console.log(`[seo] Priority ${b.range}: ${b.count} nodes (${b.nodes.join(', ')})`)
    }
  }

  // --- Assemble report ---
  const totalChecks = 4
  const passedChecks = [hreflangPassed, sitemapPassed, noindexPassed, canonicalPassed].filter(
    Boolean
  ).length
  const overallPassed = passedChecks === totalChecks

  const report = [
    '# SEO Verification Report',
    '',
    `**Generated:** ${formatTimestamp()}`,
    `**Source:** content-graph.generated (${graph.generatedAt})`,
    `**Nodes analyzed:** ${nodes.length}`,
    '',
    '## Summary',
    '',
    `| Check | Status | Issues |`,
    `|-------|--------|--------|`,
    `| Hreflang Reciprocity | ${hreflangPassed ? '✅ PASS' : '❌ FAIL'} | ${hreflangIssues.length} |`,
    `| Sitemap Coherence | ${sitemapPassed ? '✅ PASS' : '❌ FAIL'} | ${sitemapIssues.length} |`,
    `| Noindex Alignment | ${noindexPassed ? '✅ PASS' : '❌ FAIL'} | ${noindexIssues.length} |`,
    `| Canonical Coherence | ${canonicalPassed ? '✅ PASS' : '❌ FAIL'} | ${canonicalIssues.length} |`,
    `| **Overall** | **${overallPassed ? '✅ PASS' : '⚠️  ISSUES FOUND'}** | **${hreflangIssues.length + sitemapIssues.length + noindexIssues.length + canonicalIssues.length}** |`,
    '',
    overallPassed
      ? 'All SEO checks passed.'
      : `${totalChecks - passedChecks} of ${totalChecks} checks have issues that may require attention.`,
    '',
    '## Hreflang Reciprocity',
    '',
    'Verifies that for every alternate link A→B, node B has a reciprocal link back to A.',
    '',
    hreflangTable(hreflangIssues),
    '',
    '## Sitemap Coherence',
    '',
    'Verifies that all sitemap-eligible nodes are published and all published nodes are sitemap-eligible.',
    '',
    sitemapTable(sitemapIssues),
    '',
    '## Noindex Alignment',
    '',
    'Verifies that nodes with `noindex: true` are unpublished or have a generated/deprecated lifecycle.',
    '',
    noindexTable(noindexIssues),
    '',
    '## Canonical Coherence',
    '',
    "Verifies that each node's canonical URL resolves to the correct node via the route index.",
    '',
    canonicalTable(canonicalIssues),
    '',
    '## Priority Distribution',
    '',
    priorityHistogram(buckets),
    '',
    '## Appendix: Per-Node SEO Snapshot',
    '',
    perNodeSeoSnapshot(nodes),
    '',
    '---',
    '',
    `*Report generated by scripts/generate-seo-verification.ts at ${formatTimestamp()}*`,
    '',
  ].join('\n')

  const outputDir = join(process.cwd(), 'artifacts/seo')
  mkdirSync(outputDir, { recursive: true })

  const outputPath = join(outputDir, 'seo-verification-report.md')
  writeFileSync(outputPath, report, 'utf-8')

  console.log(`[seo] Report written to ${outputPath}`)
  console.log(`[seo] Done — ${report.length} bytes written`)
}

// Only run main() when this module is the entry point (not when imported for tests)
const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('scripts/generate-seo-verification.ts') ||
    process.argv[1].endsWith('generate-seo-verification.ts'))

if (isMain) {
  await main().catch(err => {
    console.error('[seo] Script failed:', err)
    process.exit(1)
  })
}
