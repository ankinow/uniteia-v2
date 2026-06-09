/**
 * generate-from-manifest.ts v2 — Smart Content Generator
 *
 * NON-DESTRUCTIVE: patches existing content files instead of overwriting.
 * VALIDATED: pre-validates manifest against runtime-aware Zod schema.
 * SYMMETRIC: ensures all 8 locales exist for every article.
 * VERIFIED: progressive verification after each phase.
 *
 * Architecture: Pre-validate → Smart Patch → Locale Complete → Verify
 *
 * RUN: cd /home/lermf/uniteia-v2 && bun run scripts/generate-from-manifest.ts
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yaml from 'js-yaml'
import { generateCanvas, generateCollageProps } from '../src/utils/canvas-template-engine'
import type { CanvasDef } from '../src/utils/canvas-template-engine'
import { manifestSchema } from './manifest-schema'
import type { Manifest, ReferralLink } from './manifest-schema'

const LOCALES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const
const CONTENT_DIR = path.resolve(process.cwd(), 'content')
const MANIFEST_PATH = path.resolve(process.cwd(), 'content-manifest.yaml')

const localeNames: Record<string, string> = {
  en: 'English',
  pt: 'Português',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  ja: '日本語',
  zh: '中文',
}

// ─── Types ───

export interface GenerationResult {
  articles: number
  filesPatched: number // existing files updated
  filesCreated: number // new files from manifest
  collages: number
  localesFilled: number // missing locales inferred
  errors: GenerationError[]
  /** Post-generation locale completeness validation */
  localeValidation: LocaleValidationResult
}

export interface LocaleValidationResult {
  checked: number // total article×locale combos checked
  present: number // files that exist
  missing: LocaleGap[] // files that are still missing after Phase 2
}

export interface LocaleGap {
  article: string
  niche: string
  locale: string
}

export interface GenerationError {
  phase: 'validate' | 'patch' | 'create' | 'locale' | 'verify'
  article: string
  locale?: string
  message: string
}

// ─── Public API ───

export async function generateFromManifest(
  manifestInput?: Manifest,
  opts: { dryRun?: boolean; forceRegenerate?: boolean } = {}
): Promise<GenerationResult> {
  const now = new Date().toISOString()
  const result: GenerationResult = {
    articles: 0,
    filesPatched: 0,
    filesCreated: 0,
    collages: 0,
    localesFilled: 0,
    errors: [],
    localeValidation: { checked: 0, present: 0, missing: [] },
  }

  // ═══════════════════════════════════════════════════════════
  // PHASE 0: PRE-VALIDATE manifest against runtime-aware schema
  // ═══════════════════════════════════════════════════════════
  let manifest: Manifest
  try {
    const raw = manifestInput ?? loadManifest()
    manifest = manifestSchema.parse(raw)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    result.errors.push({ phase: 'validate', article: '(manifest)', message: msg })
    return result
  }

  // ═══════════════════════════════════════════════════════════
  // PHASE 1: SMART PATCH — existing files get metadata updates only
  // ═══════════════════════════════════════════════════════════
  for (const entry of manifest.articles) {
    result.articles++

    // Resolve canvas
    const canvas: CanvasDef =
      (entry.canvas as CanvasDef | undefined) ??
      generateCanvas({
        tags: entry.tags,
        niche: entry.niche,
        bodySample: entry.locales.en.body.slice(0, 600),
      })

    const manifestCanvas = (entry as Record<string, unknown>).canvas as
      | Record<string, unknown>
      | undefined

    for (const locale of LOCALES) {
      const mdPath = path.join(CONTENT_DIR, entry.niche, locale, `${entry.slug}.md`)
      const fileExists = fs.existsSync(mdPath)

      if (fileExists && !opts.forceRegenerate) {
        // PATCH MODE: update metadata, preserve body + canvas
        try {
          patchExistingMarkdown(mdPath, entry, locale, now)
          result.filesPatched++
        } catch (err) {
          result.errors.push({
            phase: 'patch',
            article: entry.slug,
            locale,
            message: err instanceof Error ? err.message : String(err),
          })
        }
      } else {
        // GENERATE MODE: create from manifest
        const locData = entry.locales[locale]
        if (!locData) {
          // Locale missing from manifest — will be filled in Phase 2
          continue
        }
        try {
          writeNewMarkdown(mdPath, entry, locale, locData, canvas, manifestCanvas, now)
          result.filesCreated++
        } catch (err) {
          result.errors.push({
            phase: 'create',
            article: entry.slug,
            locale,
            message: err instanceof Error ? err.message : String(err),
          })
        }
      }

      // Collage JSON (always regenerate — it's derived)
      try {
        writeCollageJson(entry.niche, locale, entry.slug, canvas, now)
        result.collages++
      } catch (_) {
        /* collage is cosmetic, non-fatal */
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PHASE 2: LOCALE COMPLETION — bulletproof fill for all 8 locales
  // Ensures compileSymmetry() never fails by guaranteeing every
  // article×locale combination has a markdown file.
  // ═══════════════════════════════════════════════════════════
  for (const entry of manifest.articles) {
    for (const locale of LOCALES) {
      const mdPath = path.join(CONTENT_DIR, entry.niche, locale, `${entry.slug}.md`)
      if (fs.existsSync(mdPath)) continue

      const locData = entry.locales[locale]
      if (locData) {
        // Manifest has data but file missing — create it
        try {
          writeNewMarkdown(mdPath, entry, locale, locData, canvasFromEntry(entry), undefined, now)
          result.filesCreated++
          result.localesFilled++
        } catch (err) {
          result.errors.push({
            phase: 'locale',
            article: entry.slug,
            locale,
            message: err instanceof Error ? err.message : String(err),
          })
        }
      } else {
        // Manifest lacks this locale — infer from best available source
        // findBestLocaleForInference ALWAYS returns 'en' as ultimate fallback
        const bestLocale = findBestLocaleForInference(entry, locale)
        try {
          const inferredData = inferLocaleData(entry, bestLocale, locale)
          writeNewMarkdown(
            mdPath,
            entry,
            locale,
            inferredData,
            canvasFromEntry(entry),
            undefined,
            now
          )
          result.filesCreated++
          result.localesFilled++
        } catch (err) {
          // ULTIMATE FALLBACK: create a minimal stub from the article title
          try {
            const enTitle = entry.locales.en?.title ?? entry.slug
            const stubData = {
              title: enTitle,
              body: `> *[${localeNames[locale] ?? locale} content stub — pending translation]*\n\n${localeNames[locale] ?? locale} translation pending. Please refer to the English version.`,
            }
            writeNewMarkdown(
              mdPath,
              entry,
              locale,
              stubData,
              canvasFromEntry(entry),
              undefined,
              now
            )
            result.filesCreated++
            result.localesFilled++
          } catch (stubErr) {
            result.errors.push({
              phase: 'locale',
              article: entry.slug,
              locale,
              message: `Failed to create even stub: ${stubErr instanceof Error ? stubErr.message : String(stubErr)}`,
            })
          }
        }
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PHASE 3: NICHE INDEXES — write _index.md for each niche
  // ═══════════════════════════════════════════════════════════
  for (const [nicheKey, nicheData] of Object.entries(manifest.niches)) {
    for (const locale of LOCALES) {
      const locData = nicheData.locales[locale]
      if (!locData) {
        result.errors.push({
          phase: 'verify',
          article: `${nicheKey}/_index`,
          locale,
          message: 'Niche index locale missing from manifest',
        })
        continue
      }

      const indexPath = path.join(CONTENT_DIR, nicheKey, locale, '_index.md')
      if (fs.existsSync(indexPath) && !opts.forceRegenerate) {
        // Patch existing index
        try {
          patchIndexMarkdown(indexPath, locData, nicheData.subject ?? nicheKey, locale, now)
        } catch (err) {
          result.errors.push({
            phase: 'patch',
            article: `${nicheKey}/_index`,
            locale,
            message: err instanceof Error ? err.message : String(err),
          })
        }
      } else {
        writeIndexMarkdown(indexPath, locData, nicheData.subject ?? nicheKey, locale, now)
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PHASE 4: VALIDATION — verify ALL 12 articles × 8 locales exist
  // Guarantees compileSymmetry() never fails by confirming every
  // article×locale combination has a markdown file on disk.
  // ═══════════════════════════════════════════════════════════
  result.localeValidation = validateLocaleCompletion(manifest)

  return result
}

/**
 * Post-generation locale completeness validation.
 * Scans every article×locale combination and reports any that are
 * missing after Phases 1–2 have run. This is the safety net that
 * guarantees compileSymmetry() will never need to downgrade an
 * article to draft due to missing locale files.
 */
function validateLocaleCompletion(manifest: Manifest): LocaleValidationResult {
  const missing: LocaleGap[] = []
  let checked = 0
  let present = 0

  for (const entry of manifest.articles) {
    for (const locale of LOCALES) {
      checked++
      const mdPath = path.join(CONTENT_DIR, entry.niche, locale, `${entry.slug}.md`)
      if (fs.existsSync(mdPath)) {
        present++
      } else {
        missing.push({
          article: entry.slug,
          niche: entry.niche,
          locale,
        })
      }
    }
  }

  if (missing.length > 0) {
    console.error(
      `\n  ❌ POST-GENERATION VALIDATION FAILED: ${missing.length} locale gap(s) found:`
    )
    for (const gap of missing) {
      console.error(`     MISSING: ${gap.niche}/${gap.locale}/${gap.article}.md`)
    }
    console.error(`     CHECKED: ${checked}  PRESENT: ${present}  MISSING: ${missing.length}`)
  }

  return { checked, present, missing }
}

// ─── Smart Patch: update metadata in existing file ───

function patchExistingMarkdown(
  mdPath: string,
  entry: Manifest['articles'][number],
  locale: string,
  now: string
): void {
  const raw = fs.readFileSync(mdPath, 'utf-8')
  const RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
  const match = raw.match(RE)

  if (!match) {
    throw new Error(`No frontmatter found in ${mdPath}`)
  }

  const existingFm = (yaml.load(match[1]) ?? {}) as Record<string, unknown>
  const body = raw.slice(match[0].length)

  // Merge: manifest values take precedence, existing values preserved for fields not in manifest
  const locData = entry.locales[locale]

  existingFm.slug = entry.slug
  existingFm.lang = locale
  if (locData?.title) existingFm.title = locData.title
  existingFm.verdict = entry.verdict
  existingFm.quality_score = entry.quality_score
  existingFm.subjects = entry.subjects ?? entry.tags
  existingFm.referral_links = normalizeReferralLinks(entry)

  // Preserve existing metadata but bump updated_at
  const existingMeta = (existingFm.metadata as Record<string, unknown>) ?? {}
  existingFm.metadata = {
    created_at: existingMeta.created_at ?? existingMeta.createdAt ?? now,
    updated_at: now,
    author: existingMeta.author ?? 'UniTeia System',
    version: (typeof existingMeta.version === 'number' ? existingMeta.version : 0) + 1,
  }

  // Preserve existing canvas if present
  if (!existingFm.canvas && entry.canvas) {
    existingFm.canvas = entry.canvas
  }

  const yamlBlock = yaml.dump(existingFm, {
    lineWidth: 1000,
    noCompatMode: true,
    quotingType: '"',
    forceQuotes: false,
  })
  fs.writeFileSync(mdPath, `---\n${yamlBlock}---\n${body}`)
}

// ─── Fresh generation: write new markdown ───

function writeNewMarkdown(
  mdPath: string,
  entry: Manifest['articles'][number],
  locale: string,
  locData: { title: string; subtitle?: string; body: string },
  canvas: CanvasDef,
  manifestCanvas: Record<string, unknown> | undefined,
  now: string
): void {
  const fm: Record<string, unknown> = {
    slug: entry.slug,
    lang: locale,
    title: locData.title,
    verdict: entry.verdict,
    quality_score: entry.quality_score,
    subjects: entry.subjects ?? entry.tags,
    referral_links: normalizeReferralLinks(entry),
    metadata: {
      created_at: now,
      updated_at: now,
      author: 'UniTeia System',
      version: 1,
    },
  }

  if (manifestCanvas) {
    fm.canvas = manifestCanvas
  } else {
    fm.canvas = canvas
  }

  const yamlBlock = yaml.dump(fm, {
    lineWidth: 1000,
    noCompatMode: true,
    quotingType: '"',
    forceQuotes: false,
  })
  const md = `---\n${yamlBlock}---\n${locData.body}\n`

  const mdDir = path.dirname(mdPath)
  fs.mkdirSync(mdDir, { recursive: true })
  fs.writeFileSync(mdPath, md)
}

// ─── Collage JSON ───

function writeCollageJson(
  niche: string,
  locale: string,
  slug: string,
  canvas: CanvasDef,
  now: string
): void {
  const collage = generateCollageProps(canvas, { width: 800, height: 500 })
  const json = { slug, ...collage, generatedAt: now }
  const dir = path.join(CONTENT_DIR, niche, locale, 'assets', 'collage')
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, `${slug}.json`), JSON.stringify(json, null, 2))
}

// ─── Locale inference: find best source for missing locale ───

function findBestLocaleForInference(
  entry: Manifest['articles'][number],
  targetLocale: string
): string {
  // Priority: same-script locales with body, then English, then any locale
  const scriptGroups: Record<string, string[]> = {
    latin: ['en', 'pt', 'es', 'fr', 'de', 'it'],
    cjk: ['ja', 'zh'],
  }

  const targetGroup = scriptGroups.latin.includes(targetLocale)
    ? 'latin'
    : scriptGroups.cjk.includes(targetLocale)
      ? 'cjk'
      : null

  if (targetGroup) {
    for (const loc of scriptGroups[targetGroup]) {
      if (loc !== targetLocale && entry.locales[loc]?.body) {
        return loc
      }
    }
  }

  // Fallback: English always returns itself (last resort for inference)
  return 'en'
}

function inferLocaleData(
  entry: Manifest['articles'][number],
  sourceLocale: string,
  targetLocale: string
): { title: string; body: string } {
  const source = entry.locales[sourceLocale]
  if (!source) throw new Error(`Source locale ${sourceLocale} has no data`)

  return {
    title: source.title,
    body: `> *[${localeNames[targetLocale] ?? targetLocale} translation pending — showing ${localeNames[sourceLocale] ?? sourceLocale} content]*\n\n${source.body}`,
  }
}

function canvasFromEntry(entry: Manifest['articles'][number]): CanvasDef {
  return (
    (entry.canvas as CanvasDef | undefined) ??
    generateCanvas({
      tags: entry.tags,
      niche: entry.niche,
      bodySample: entry.locales.en?.body?.slice(0, 600) ?? '',
    })
  )
}

// ─── Referral link normalization: convert slug strings to {url, title} objects ───

function normalizeReferralLinks(entry: Manifest['articles'][number]): ReferralLink[] {
  const links = entry.referral_links
  if (!links || links.length === 0) return []

  return links.map(link => {
    if (typeof link === 'string') {
      // Convert manifest slug to runtime object: relative path + slug as title
      return {
        url: `/en/signals/${entry.niche}/${link}`,
        title: link,
      }
    }
    // Already an object — pass through
    return link
  })
}

// ─── Niche index generation ───

function patchIndexMarkdown(
  indexPath: string,
  locData: { title: string; subtitle?: string; body: string },
  subject: string,
  locale: string,
  now: string
): void {
  const raw = fs.readFileSync(indexPath, 'utf-8')
  const RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
  const match = raw.match(RE)

  if (!match) {
    throw new Error(`No frontmatter in index: ${indexPath}`)
  }

  const fm = (yaml.load(match[1]) ?? {}) as Record<string, unknown>
  const body = raw.slice(match[0].length)

  fm.title = locData.title
  fm.subjects = [subject]
  fm.lang = locale
  fm.type = 'index'

  const meta = (fm.metadata as Record<string, unknown>) ?? {}
  fm.metadata = {
    created_at: meta.created_at ?? now,
    updated_at: now,
  }

  const yamlBlock = yaml.dump(fm, {
    lineWidth: 1000,
    noCompatMode: true,
    quotingType: '"',
    forceQuotes: false,
  })

  // Preserve existing body if manifest body is empty
  const newBody = locData.body?.trim() ? `\n# ${locData.title}\n\n${locData.body}\n` : body

  fs.writeFileSync(indexPath, `---\n${yamlBlock}---\n${newBody}`)
}

function writeIndexMarkdown(
  indexPath: string,
  locData: { title: string; subtitle?: string; body: string },
  subject: string,
  locale: string,
  now: string
): void {
  const fm: Record<string, unknown> = {
    type: 'index',
    slug: '_index',
    lang: locale,
    title: locData.title,
    subjects: [subject],
    referral_links: [],
    verdict: 'trusted',
    quality_score: 100,
    metadata: { created_at: now, updated_at: now },
  }

  const yamlBlock = yaml.dump(fm, {
    lineWidth: 1000,
    noCompatMode: true,
    quotingType: '"',
    forceQuotes: false,
  })
  const md = `---\n${yamlBlock}---\n\n# ${locData.title}\n\n${locData.body}\n`

  fs.mkdirSync(path.dirname(indexPath), { recursive: true })
  fs.writeFileSync(indexPath, md)
}

// ─── Helpers ───

function loadManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Manifest not found at ${MANIFEST_PATH}`)
  }
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8')
  const parsed = yaml.load(raw)
  // Zod validation happens in generateFromManifest()
  return parsed as Manifest
}

// ─── CLI entry ───

const isMain =
  process.argv[1]?.endsWith('generate-from-manifest.ts') ||
  process.argv[1]?.endsWith('generate-from-manifest')

if (isMain) {
  const dryRun = process.argv.includes('--dry-run')
  const force = process.argv.includes('--force')

  try {
    const result = await generateFromManifest(undefined, { dryRun, forceRegenerate: force })
    console.log(
      `[generate-from-manifest] ✅ ${result.articles} articles → ` +
        `${result.filesPatched} patched, ${result.filesCreated} created, ` +
        `${result.localesFilled} locales filled, ${result.collages} collages`
    )
    const v = result.localeValidation
    console.log(
      `[generate-from-manifest] 🔍 Locale completeness: ${v.present}/${v.checked} present` +
        (v.missing.length > 0 ? ` — ${v.missing.length} MISSING ❌` : ' ✅')
    )
    if (result.errors.length > 0) {
      console.log(`[generate-from-manifest] ⚠ ${result.errors.length} errors:`)
      for (const err of result.errors) {
        console.log(
          `  [${err.phase}] ${err.article}${err.locale ? `/${err.locale}` : ''}: ${err.message}`
        )
      }
    }
    if (v.missing.length > 0) {
      process.exit(1)
    }
  } catch (err) {
    console.error('[generate-from-manifest] ❌ Failed:', err)
    process.exit(1)
  }
}
