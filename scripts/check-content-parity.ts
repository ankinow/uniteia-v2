#!/usr/bin/env bun

/**
 * Content Parity Check
 *
 * Ensures all 8 locales under content/apex/ have identical article counts,
 * no empty articles, and valid frontmatter with required fields.
 *
 * Usage: bun run check:parity
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, join, relative, resolve } from 'node:path'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EXPECTED_LOCALES = ['de', 'en', 'es', 'fr', 'it', 'ja', 'pt', 'zh']
const ROOT_DIR = resolve(import.meta.dir, '..')
const APEX_DIR = join(ROOT_DIR, 'content', 'apex')
const EMPTY_THRESHOLD = 100 // bytes — articles under this are considered empty
const SKIP_FILES = new Set(['_index.md'])

// Required root-level frontmatter keys
const REQUIRED_ROOT_KEYS = ['slug', 'lang', 'title']
// Required nested key: metadata.created_at
const REQUIRED_NESTED = { metadata: ['created_at'] } as Record<string, string[]>

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ArticleInfo {
  /** Relative path from repo root */
  path: string
  /** Size in bytes */
  size: number
  /** Parsed frontmatter (top-level keys mapped to line numbers) */
  frontmatter: Map<string, number>
}

interface Discrepancy {
  locale: string
  file: string
  issue: string
  line?: number
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse YAML-like frontmatter from a markdown file.
 * Returns a map of key → line number for top-level keys, and also
 * tracks nested keys like metadata.created_at.
 */
function parseFrontmatter(content: string): {
  rootKeys: Map<string, number>
  nestedKeys: Map<string, number>
  lineOffset: number
} {
  const rootKeys = new Map<string, number>()
  const nestedKeys = new Map<string, number>()
  const lines = content.split('\n')

  if (lines[0]?.trim() !== '---') {
    return { rootKeys, nestedKeys, lineOffset: 0 }
  }

  // Find closing ---
  let closeIdx = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      closeIdx = i
      break
    }
  }

  if (closeIdx === -1) {
    return { rootKeys, nestedKeys, lineOffset: 0 }
  }

  let currentParent = ''
  let indentLevel = 0

  for (let i = 1; i < closeIdx; i++) {
    const raw = lines[i]
    const lineNum = i + 1 // 1-indexed for reporting
    const trimmed = raw.trim()

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue

    // Detect indent level
    const leadingSpaces = raw.length - raw.trimStart().length

    // Check if this is a nested key (indented under a parent)
    if (leadingSpaces >= 2 && currentParent) {
      const colonIdx = trimmed.indexOf(':')
      if (colonIdx !== -1) {
        const key = trimmed.slice(0, colonIdx).trim()
        const compoundKey = `${currentParent}.${key}`
        nestedKeys.set(compoundKey, lineNum)

        // Check for further nesting (value is empty → new mapping)
        const value = trimmed.slice(colonIdx + 1).trim()
        if (!value) {
          currentParent = compoundKey
          indentLevel = leadingSpaces
        }
      }
      continue
    }

    // Top-level key
    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue

    const key = trimmed.slice(0, colonIdx).trim()
    const value = trimmed.slice(colonIdx + 1).trim()

    rootKeys.set(key, lineNum)

    // If value is empty, it's a mapping key — track as current parent
    if (!value) {
      currentParent = key
      indentLevel = leadingSpaces
    } else {
      // Value is present — reset parent tracking
      currentParent = ''
      indentLevel = 0
    }
  }

  return { rootKeys, nestedKeys, lineOffset: 0 }
}

// ---------------------------------------------------------------------------
// Core checks
// ---------------------------------------------------------------------------

function gatherArticles(): Map<string, ArticleInfo[]> {
  const localeArticles = new Map<string, ArticleInfo[]>()

  for (const locale of EXPECTED_LOCALES) {
    const localeDir = join(APEX_DIR, locale)
    const articles: ArticleInfo[] = []

    try {
      const entries = readdirSync(localeDir)
      for (const entry of entries) {
        if (!entry.endsWith('.md')) continue
        if (SKIP_FILES.has(entry)) continue

        const filePath = join(localeDir, entry)
        try {
          const stats = statSync(filePath)
          const content = readFileSync(filePath, 'utf-8')
          const { rootKeys, nestedKeys } = parseFrontmatter(content)

          articles.push({
            path: relative(ROOT_DIR, filePath),
            size: stats.size,
            frontmatter: rootKeys,
          })
        } catch (err) {
          console.error(`[ERROR] Failed to read ${filePath}: ${err}`)
        }
      }
    } catch {
      // Locale directory doesn't exist
    }

    localeArticles.set(locale, articles)
  }

  return localeArticles
}

function checkParity(): Discrepancy[] {
  const localeArticles = gatherArticles()
  const discrepancies: Discrepancy[] = []

  // ── 1. Check article counts ──────────────────────────────────────────
  const counts = new Map<string, number>()
  for (const [locale, articles] of localeArticles) {
    counts.set(locale, articles.length)
  }

  const targetCount = counts.get('en')
  if (targetCount === undefined) {
    discrepancies.push({
      locale: 'ALL',
      file: 'content/apex',
      issue: 'English locale not found — cannot determine expected article count',
    })
    return discrepancies
  }

  for (const [locale, count] of counts) {
    if (count !== targetCount) {
      const diff = count - targetCount
      const sign = diff > 0 ? '+' : ''
      discrepancies.push({
        locale,
        file: `content/apex/${locale}/`,
        issue: `Article count mismatch: ${count} articles (expected ${targetCount}, ${sign}${diff})`,
      })
    }
  }

  // ── 2. Check for empty articles (< EMPTY_THRESHOLD bytes) ────────────
  for (const [locale, articles] of localeArticles) {
    for (const article of articles) {
      if (article.size < EMPTY_THRESHOLD) {
        discrepancies.push({
          locale,
          file: article.path,
          issue: `Article too small: ${article.size} bytes (threshold: ${EMPTY_THRESHOLD})`,
        })
      }
    }
  }

  // ── 3. Verify required frontmatter fields ────────────────────────────
  for (const [locale, articles] of localeArticles) {
    for (const article of articles) {
      for (const key of REQUIRED_ROOT_KEYS) {
        const lineNum = article.frontmatter.get(key)
        if (lineNum === undefined) {
          discrepancies.push({
            locale,
            file: article.path,
            issue: `Missing required frontmatter field: "${key}"`,
          })
        }
      }

      // Check nested keys
      for (const [parent, children] of Object.entries(REQUIRED_NESTED)) {
        const parentExists = article.frontmatter.has(parent)
        if (!parentExists) {
          discrepancies.push({
            locale,
            file: article.path,
            issue: `Missing required frontmatter section: "${parent}"`,
          })
          continue
        }
        for (const child of children) {
          const compoundKey = `${parent}.${child}`
          // We need to re-parse to check nested keys — use parseFrontmatter
          const filePath = join(ROOT_DIR, article.path)
          try {
            const content = readFileSync(filePath, 'utf-8')
            const { nestedKeys } = parseFrontmatter(content)
            const nestedLine = nestedKeys.get(compoundKey)
            if (nestedLine === undefined) {
              discrepancies.push({
                locale,
                file: article.path,
                issue: `Missing required nested frontmatter field: "${compoundKey}"`,
              })
            }
          } catch {
            // Already handled
          }
        }
      }
    }
  }

  return discrepancies
}

// ---------------------------------------------------------------------------
// Report & main
// ---------------------------------------------------------------------------

function printReport(
  discrepancies: Discrepancy[],
  localeArticles: Map<string, ArticleInfo[]>
): void {
  console.log('═══════════════════════════════════════════')
  console.log('  Content Parity Check — content/apex/*')
  console.log('═══════════════════════════════════════════')
  console.log()

  // ── Article counts per locale ────────────────────────────────────────
  console.log('📊 Article counts per locale:')
  console.log('───────────────────────────────────────────')
  const counts: Record<string, number> = {}
  for (const [locale, articles] of localeArticles) {
    counts[locale] = articles.length
  }

  const enCount = counts['en']
  for (const locale of EXPECTED_LOCALES) {
    const count = counts[locale] ?? 0
    const status = count === enCount ? '✅' : '❌'
    const fileList = (localeArticles.get(locale) ?? []).map(a => basename(a.path)).join(', ')
    console.log(`  ${status} ${locale}: ${count} articles  [${fileList}]`)
  }

  console.log()
  console.log(`  Target count (en): ${enCount}`)
  console.log()

  // ── Summary ──────────────────────────────────────────────────────────
  if (discrepancies.length === 0) {
    console.log('✅ ALL CHECKS PASSED — Content parity is maintained across all 8 locales.')
    console.log()
    return
  }

  console.log(`❌ ${discrepancies.length} discrepancy(s) found:`)
  console.log('───────────────────────────────────────────')
  console.log()

  for (const d of discrepancies) {
    const lineSuffix = d.line ? `:${d.line}` : ''
    console.log(`  [${d.locale}] ${d.file}${lineSuffix}`)
    console.log(`    → ${d.issue}`)
    console.log()
  }

  console.log('───────────────────────────────────────────')
  console.log()
}

function main(): void {
  const localeArticles = gatherArticles()
  const discrepancies = checkParity()

  printReport(discrepancies, localeArticles)

  if (discrepancies.length > 0) {
    process.exit(1)
  }
}

main()
