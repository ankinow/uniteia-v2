#!/usr/bin/env bun
/**
 * roundtrip-contract-verify.ts
 *
 * v2-side roundtrip verification script.
 * Imports a factory export package, runs the full validate→import→compile
 * pipeline, and verifies every ContentNode field matches the factory originals.
 *
 * Usage:
 *   bun run scripts/roundtrip-contract-verify.ts          (default slug: roundtrip-fixture-2026-05)
 *   bun run scripts/roundtrip-contract-verify.ts --slug=<export-slug>
 *
 * Exit code: 0 if ALL fields match across ALL locales, 1 otherwise.
 * Structured JSON summary printed to stdout for orchestrator consumption.
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { LOCALE_BCP47_TO_V2 } from '@uniteia/content-node-contract'
import type { ContentNode as ContractContentNode } from '@uniteia/content-node-contract'
import { compileContentGraph } from '../src/content-graph'
import { importPackage } from '../src/content-import/import-package'
import { validatePackage } from '../src/content-import/validate-package'

// ── Argument parsing ──────────────────────────────────────────────────────

const SLUG_PREFIX = '--slug='
const slugArg = process.argv.find(a => a.startsWith(SLUG_PREFIX))
const slug = slugArg ? slugArg.slice(SLUG_PREFIX.length) : 'roundtrip-fixture-2026-05'

// ── Path resolution ───────────────────────────────────────────────────────

const V2_ROOT = resolve(import.meta.dirname, '..')
const FACTORY_ROOT = resolve(V2_ROOT, '..', 'uniteia-mega-factory')
const PACKAGE_DIR = resolve(FACTORY_ROOT, 'exports', slug)

if (!existsSync(PACKAGE_DIR)) {
  console.error(`[verify] ❌ Export package not found: ${PACKAGE_DIR}`)
  process.exit(1)
}

// ── Helpers ───────────────────────────────────────────────────────────────

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

// ── Phase 1: Validate ─────────────────────────────────────────────────────

console.error(`[verify] Phase 1/6 — Validating package at ${PACKAGE_DIR}...`)
const validation = validatePackage(PACKAGE_DIR)
if (!validation.valid) {
  console.error('[verify] ❌ Package validation failed')
  for (const issue of validation.issues) {
    const icon = issue.severity === 'error' ? '✗' : '⚠'
    console.error(`  ${icon} [${issue.severity}] ${issue.path}: ${issue.message}`)
  }
  process.exit(1)
}
console.error(
  `[verify] ✅ Package validation passed (${validation.issues.length} issues, all warnings)`
)

// ── Phase 2: Import ───────────────────────────────────────────────────────

console.error('[verify] Phase 2/6 — Importing package...')
const manifestRaw = JSON.parse(readFileSync(resolve(PACKAGE_DIR, 'manifest.json'), 'utf-8'))
const imported = importPackage(PACKAGE_DIR, manifestRaw)

if (imported.importReport.metadataOrigin !== 'factory') {
  console.error(
    `[verify] ❌ metadataOrigin is "${imported.importReport.metadataOrigin}", expected "factory"`
  )
  process.exit(1)
}
console.error(
  `[verify] ✅ Imported ${imported.importReport.nodeCount} factory nodes, ` +
    `metadataOrigin=${imported.importReport.metadataOrigin}`
)

// ── Phase 3: Build normalized factory-nodes map ────────────────────────────

console.error('[verify] Phase 3/6 — Normalizing factory node IDs (BCP47→v2)...')
const factoryNodes: Record<string, ContractContentNode> = {}

for (const node of imported.factoryNodes) {
  const bcp47Locale = node.locale as keyof typeof LOCALE_BCP47_TO_V2
  const v2Locale = LOCALE_BCP47_TO_V2[bcp47Locale] ?? node.locale
  const normalizedId = `${v2Locale}-${node.canonicalSlug}`

  // Clone and normalize locale-related fields
  const normalized = JSON.parse(JSON.stringify(node)) as ContractContentNode
  ;(normalized as Record<string, unknown>).locale = v2Locale
  ;(normalized as Record<string, unknown>).canonicalLocale = v2Locale

  // Normalize alternates keys and values from BCP47 to v2
  const alt: Record<string, string> = {}
  for (const [altLocale, altValue] of Object.entries(node.alternates)) {
    const altV2 = LOCALE_BCP47_TO_V2[altLocale as keyof typeof LOCALE_BCP47_TO_V2] ?? altLocale
    alt[altV2] = normalizeBcp47NodeId(String(altValue))
  }
  ;(normalized as Record<string, unknown>).alternates = alt

  factoryNodes[normalizedId] = normalized
}
console.error(`[verify] ✅ Normalized ${Object.keys(factoryNodes).length} factory nodes`)

// ── Phase 4: Build content registry ────────────────────────────────────────

console.error('[verify] Phase 4/6 — Building content registry...')
const NICHE = 'apex'
const registry: Record<string, string> = {}

for (const node of imported.factoryNodes) {
  const bcp47Locale = node.locale as keyof typeof LOCALE_BCP47_TO_V2
  const v2Locale = LOCALE_BCP47_TO_V2[bcp47Locale] ?? node.locale
  const contentPath = resolve(PACKAGE_DIR, `content.${node.locale}.mdx`)

  if (!existsSync(contentPath)) {
    console.error(`[verify] ⚠ Content file not found for locale ${node.locale}: ${contentPath}`)
    continue
  }

  const rawContent = readFileSync(contentPath, 'utf-8')

  // Prepend minimal frontmatter so the compiler's parseFrontmatter succeeds.
  // The title is the only field needed — all quality/visibility/timestamps
  // values will come from the factory-nodes overrides.
  const contentWithFrontmatter = [
    '---',
    `title: ${JSON.stringify(node.title)}`,
    '---',
    '',
    rawContent.trim(),
  ].join('\n')

  registry[`./content/${NICHE}/${v2Locale}/${node.canonicalSlug}.md`] = contentWithFrontmatter
}
console.error(`[verify] ✅ Registry built with ${Object.keys(registry).length} locale entries`)

// ── Phase 5: Compile content graph ─────────────────────────────────────────

console.error('[verify] Phase 5/6 — Compiling content graph...')
const graph = compileContentGraph({
  registry,
  locales: ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'],
  defaultLocale: 'en',
  factoryNodes,
})

console.error(
  `[verify] ✅ Graph compiled: ${graph.nodes.length} nodes, ` +
    `${graph.nodes.filter(n => n.visibility === 'public' || (n.visibility as string) === 'published').length} public`
)

// ── Phase 6: Verify field fidelity ─────────────────────────────────────────

console.error('[verify] Phase 6/6 — Verifying field fidelity...\n')

const CHECK_FIELDS_DISPLAY = [
  'qualityScore',
  'trustScore',
  'visibility',
  'lifecycle',
  'verdict',
  'seo.noindex',
  'seo.priority',
  'timestamps.createdAt',
]

interface FieldCheck {
  field: string
  expected: unknown
  actual: unknown
  passed: boolean
}

interface LocaleCheck {
  locale: string
  nodeId: string
  passed: boolean
  fields: FieldCheck[]
}

const results: LocaleCheck[] = []
let totalFields = 0
let passedFields = 0

for (const node of imported.factoryNodes) {
  const bcp47Locale = node.locale as keyof typeof LOCALE_BCP47_TO_V2
  const v2Locale = LOCALE_BCP47_TO_V2[bcp47Locale] ?? node.locale
  const normalizedId = `${v2Locale}-${node.canonicalSlug}`

  const compiledNode = graph.nodes.get(normalizedId)

  if (!compiledNode) {
    results.push({
      locale: node.locale,
      nodeId: normalizedId,
      passed: false,
      fields: [{ field: 'node', expected: 'exists', actual: 'not found', passed: false }],
    })
    console.error(`[verify] ❌ [${node.locale}] Node "${normalizedId}" not found in compiled graph`)
    continue
  }

  const fields: FieldCheck[] = []

  // Direct scalar fields
  for (const field of [
    'qualityScore',
    'trustScore',
    'visibility',
    'lifecycle',
    'verdict',
  ] as const) {
    const expected = node[field]
    const actual = (compiledNode as Record<string, unknown>)[field]
    const passed = expected === actual
    fields.push({ field, expected, actual, passed })
    totalFields++
    if (passed) passedFields++
  }

  // Nested: seo
  const sExpected = node.seo
  const sActual = compiledNode.seo
  const noindexPassed = sExpected.noindex === sActual.noindex
  const priorityPassed = sExpected.priority === sActual.priority
  fields.push({
    field: 'seo.noindex',
    expected: sExpected.noindex,
    actual: sActual.noindex,
    passed: noindexPassed,
  })
  fields.push({
    field: 'seo.priority',
    expected: sExpected.priority,
    actual: sActual.priority,
    passed: priorityPassed,
  })
  totalFields += 2
  if (noindexPassed) passedFields++
  if (priorityPassed) passedFields++

  // Nested: timestamps
  const tExpected = node.timestamps
  const tActual = compiledNode.timestamps
  const createdAtPassed = tExpected.createdAt === tActual.createdAt
  fields.push({
    field: 'timestamps.createdAt',
    expected: tExpected.createdAt,
    actual: tActual.createdAt,
    passed: createdAtPassed,
  })
  totalFields++
  if (createdAtPassed) passedFields++

  const localePassed = fields.every(f => f.passed)
  results.push({ locale: node.locale, nodeId: normalizedId, passed: localePassed, fields })

  if (localePassed) {
    console.error(`[verify] ✅ [${node.locale}] All ${CHECK_FIELDS_DISPLAY.length} fields match`)
  } else {
    console.error(`[verify] ❌ [${node.locale}] Some fields mismatch:`)
    for (const f of fields.filter(f => !f.passed)) {
      console.error(
        `       ${f.field}: expected=${JSON.stringify(f.expected)}, actual=${JSON.stringify(f.actual)}`
      )
    }
  }
}

// ── Summary ────────────────────────────────────────────────────────────────

const allPassed = results.every(r => r.passed)
const passedLocales = results.filter(r => r.passed).length
const failedLocales = results.filter(r => !r.passed).length

console.error('')
console.error('[verify] ═══════════════════════════════════════')
console.error(
  `[verify]  Locales: ${results.length} total, ${passedLocales} passed, ${failedLocales} failed`
)
console.error(
  `[verify]  Fields:  ${totalFields} total, ${passedFields} passed, ${totalFields - passedFields} failed`
)
console.error(`[verify]  Result:  ${allPassed ? '✅ ALL PASSED' : '❌ FAILED'}`)
console.error('[verify] ═══════════════════════════════════════')

// ── Structured JSON summary to stdout ──────────────────────────────────────

const summary = {
  slug,
  packageDir: PACKAGE_DIR,
  passed: allPassed,
  totalLocales: results.length,
  passedLocales,
  failedLocales,
  totalFieldsChecked: CHECK_FIELDS_DISPLAY.length,
  totalFieldInstances: totalFields,
  passedFieldInstances: passedFields,
  perLocale: Object.fromEntries(
    results.map(r => [
      r.locale,
      {
        nodeId: r.nodeId,
        passed: r.passed,
        fields: Object.fromEntries(
          r.fields.map(f => [f.field, { expected: f.expected, actual: f.actual, passed: f.passed }])
        ),
      },
    ])
  ),
  timestamp: new Date().toISOString(),
}

console.log(JSON.stringify(summary, null, 2))

if (!allPassed) {
  process.exit(1)
}
