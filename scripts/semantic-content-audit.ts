#!/usr/bin/env bun
/**
 * Semantic Content Audit — CLI entry point
 *
 * Reads the content graph data and audits hreflang reciprocity and
 * translation consistency across all locales. Writes a structured
 * report to artifacts/semantic-audit/semantic-audit-report.md.
 *
 * Usage: bun run scripts/semantic-content-audit.ts
 * Prerequisite: bun run generate:content-graph
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const PROJECT_ROOT = join(import.meta.dirname, '..')
const REPORT_DIR = join(PROJECT_ROOT, 'artifacts', 'semantic-audit')
const REPORT_PATH = join(REPORT_DIR, 'semantic-audit-report.md')

// ── Types ──────────────────────────────────────────────────────────────

interface ContentNode {
  id: string
  locale: string
  slug: string
  niche: string[]
  title?: string
  visibility?: string
  lifecycle?: string
  translations?: Record<string, string>
  canonical?: string
}

interface AuditResult {
  passed: boolean
  totalNodes: number
  hreflangIssues: string[]
  translationIssues: string[]
  canonicalIssues: string[]
}

// ── Audit logic ────────────────────────────────────────────────────────

function auditSemanticContent(nodes: ContentNode[]): AuditResult {
  const hreflangIssues: string[] = []
  const translationIssues: string[] = []
  const canonicalIssues: string[] = []

  const published = nodes.filter(n => n.visibility === 'published' || n.visibility === undefined)

  for (const node of published) {
    // Check for hreflang reciprocity: if node A links to node B as a translation,
    // node B should link back to node A
    if (node.translations) {
      for (const [lang, url] of Object.entries(node.translations)) {
        // Find the target node
        const targetId =
          Object.keys(published.find(n => n.locale === lang && n.slug === node.slug) ?? {}).length >
          0
            ? published.find(n => n.locale === lang && n.slug === node.slug)?.id
            : null

        if (!targetId) {
          hreflangIssues.push(
            `Node "${node.id}" (${node.locale}) has translation for "${lang}" at "${url}" but no matching published node found`
          )
          continue
        }

        const targetNode = published.find(n => n.id === targetId)
        if (targetNode?.translations && !targetNode.translations[node.locale]) {
          hreflangIssues.push(
            `Non-reciprocal hreflang: "${node.id}" (${node.locale}) -> "${targetId}" (${lang}) has no return link`
          )
        }
      }
    }

    // Check canonical consistency
    if (node.canonical && node.canonical !== '') {
      const _expectedCanonical = `https://uniteia.app/${node.locale}/signals/${node.niche[0] ?? ''}/${node.slug}`
      if (!node.canonical.includes(node.locale)) {
        canonicalIssues.push(
          `Node "${node.id}" canonical "${node.canonical}" does not match expected locale "${node.locale}"`
        )
      }
    }
  }

  return {
    passed:
      hreflangIssues.length === 0 && translationIssues.length === 0 && canonicalIssues.length === 0,
    totalNodes: published.length,
    hreflangIssues,
    translationIssues,
    canonicalIssues,
  }
}

function generateReport(result: AuditResult): string {
  const allIssues =
    result.hreflangIssues.length + result.translationIssues.length + result.canonicalIssues.length

  const lines: string[] = [
    '# Semantic Content Audit Report',
    '',
    '## Summary',
    '',
    '| Metric | Value |',
    '|--------|-------|',
    `| Status | ${result.passed ? '✅ PASSED' : '❌ FAILED'} |`,
    `| Published nodes | ${result.totalNodes} |`,
    `| Hreflang issues | ${result.hreflangIssues.length} |`,
    `| Translation issues | ${result.translationIssues.length} |`,
    `| Canonical issues | ${result.canonicalIssues.length} |`,
    `| Total issues | ${allIssues} |`,
    '',
  ]

  if (allIssues === 0) {
    lines.push('## ✅ All Checks Passed', '')
    lines.push('No semantic issues found across all published nodes.')
    lines.push('')
  } else {
    if (result.hreflangIssues.length > 0) {
      lines.push('## ❌ Hreflang Issues', '')
      for (const issue of result.hreflangIssues) {
        lines.push(`- ${issue}`)
      }
      lines.push('')
    }
    if (result.translationIssues.length > 0) {
      lines.push('## ❌ Translation Issues', '')
      for (const issue of result.translationIssues) {
        lines.push(`- ${issue}`)
      }
      lines.push('')
    }
    if (result.canonicalIssues.length > 0) {
      lines.push('## ❌ Canonical Issues', '')
      for (const issue of result.canonicalIssues) {
        lines.push(`- ${issue}`)
      }
      lines.push('')
    }
  }

  return lines.join('\n')
}

// ── Main ────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('=== Semantic Content Audit ===')
  console.log('')

  let nodes: ContentNode[]

  try {
    const mod = await import('../src/content-graph.generated')
    const graph = mod.contentGraphData
    nodes = (graph?.nodes ?? []) as ContentNode[]
  } catch (_err) {
    console.error('[semantic-audit] Failed to load content graph data.')
    console.error('[semantic-audit] Run `bun run generate:content-graph` first.')
    process.exit(1)
  }

  console.log(`Loaded ${nodes.length} content nodes.`)

  const result = auditSemanticContent(nodes)

  mkdirSync(REPORT_DIR, { recursive: true })
  const report = generateReport(result)
  writeFileSync(REPORT_PATH, report, 'utf-8')
  console.log(`Report written to ${REPORT_PATH}`)

  if (result.passed) {
    console.log(`\n✅ Semantic audit passed (${result.totalNodes} nodes checked).`)
    process.exit(0)
  } else {
    console.log(
      `\n❌ Semantic audit found ${result.hreflangIssues.length + result.translationIssues.length + result.canonicalIssues.length} issue(s).`
    )
    process.exit(1)
  }
}

main()
