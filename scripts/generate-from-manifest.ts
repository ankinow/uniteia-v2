/**
 * generate-from-manifest.ts — Full manifest→markdown+collage generator
 *
 * Reads content-manifest.yaml, writes all article files (MD + collage JSONs)
 * to content/{niche}/{locale}/. Replaces generate-all-new-content.ts Phases 1-2.
 *
 * Per-article pipeline:
 *   1. For each locale: build YAML frontmatter, inject/generate canvas, write .md
 *   2. Generate collage JSON via generateCollageProps(), write to assets/collage/
 *   3. Write niche _index.md files
 *
 * RUN: cd /home/lermf/uniteia-v2 && bun run scripts/generate-from-manifest.ts
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yaml from 'js-yaml'
import { generateCanvas, generateCollageProps } from '../src/utils/canvas-template-engine'
import type { CanvasDef } from '../src/utils/canvas-template-engine'
import type { Manifest } from './manifest-schema'

const LOCALES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const
const CONTENT_DIR = path.resolve(process.cwd(), 'content')
const MANIFEST_PATH = path.resolve(process.cwd(), 'content-manifest.yaml')

// ─── Public API ───

export interface GenerationResult {
  articles: number
  files: number
  collages: number
}

export async function generateFromManifest(manifestInput?: Manifest): Promise<GenerationResult> {
  const manifest = manifestInput ?? loadManifest()
  const now = new Date().toISOString()
  const result: GenerationResult = { articles: 0, files: 0, collages: 0 }

  // ── 1. Process each article ──
  for (const entry of manifest.articles) {
    result.articles++

    // Resolve canvas: use manifest-provided or auto-generate
    const canvas: CanvasDef =
      (entry.canvas as CanvasDef | undefined) ??
      generateCanvas({
        tags: entry.tags,
        niche: entry.niche,
        bodySample: entry.locales.en.body.slice(0, 600),
      })

    // Retrieve raw canvas from manifest (may include connectors not in CanvasDef type)
    const manifestCanvas = (entry as Record<string, unknown>).canvas as
      | Record<string, unknown>
      | undefined

    // ── a. Write article MD for each locale ──
    for (const locale of LOCALES) {
      const locData = entry.locales[locale]
      if (!locData) {
        console.warn(`  ⚠ Missing locale ${locale} for article ${entry.slug} — skipping`)
        continue
      }

      // Build frontmatter
      const fm: Record<string, unknown> = {
        slug: entry.slug,
        lang: locale,
        title: locData.title,
        verdict: entry.verdict,
        quality_score: entry.quality_score,
        subjects: entry.subjects ?? entry.tags,
        referral_links: entry.referral_links ?? [],
        metadata: {
          created_at: now,
          updated_at: now,
          author: 'UniTeia System',
          version: 1,
        },
      }

      // Inject canvas: prefer manifest raw (with connectors) over generated
      if (manifestCanvas) {
        fm.canvas = manifestCanvas
      } else {
        fm.canvas = canvas
      }

      // Render frontmatter as YAML then append body
      const yamlBlock = yaml.dump(fm, {
        lineWidth: 1000,
        noCompatMode: true,
        quotingType: '"',
        forceQuotes: false,
      })
      const md = `---\n${yamlBlock}---\n${locData.body}\n`

      // Write .md
      const mdDir = path.join(CONTENT_DIR, entry.niche, locale)
      fs.mkdirSync(mdDir, { recursive: true })
      fs.writeFileSync(path.join(mdDir, `${entry.slug}.md`), md)
      result.files++

      // ── b. Generate & write collage JSON ──
      const collage = generateCollageProps(canvas, { width: 800, height: 500 })
      const collageJson = {
        slug: entry.slug,
        ...collage,
        generatedAt: now,
      }

      const collageDir = path.join(CONTENT_DIR, entry.niche, locale, 'assets', 'collage')
      fs.mkdirSync(collageDir, { recursive: true })
      fs.writeFileSync(
        path.join(collageDir, `${entry.slug}.json`),
        JSON.stringify(collageJson, null, 2)
      )
      result.collages++
    }
  }

  // ── 2. Write niche _index.md files ──
  for (const [nicheKey, nicheData] of Object.entries(manifest.niches)) {
    for (const locale of LOCALES) {
      const locData = nicheData.locales[locale]
      if (!locData) continue

      const indexFm: Record<string, unknown> = {
        type: 'index',
        slug: '_index',
        lang: locale,
        title: locData.title,
        subjects: [nicheData.subject ?? nicheKey],
        referral_links: [],
        verdict: 'trusted',
        quality_score: 100,
        metadata: {
          created_at: now,
          updated_at: now,
        },
      }

      const indexYaml = yaml.dump(indexFm, {
        lineWidth: 1000,
        noCompatMode: true,
        quotingType: '"',
        forceQuotes: false,
      })
      const indexMd = `---\n${indexYaml}---\n\n# ${locData.title}\n\n${locData.body}\n`

      const nicheDir = path.join(CONTENT_DIR, nicheKey, locale)
      fs.mkdirSync(nicheDir, { recursive: true })
      fs.writeFileSync(path.join(nicheDir, '_index.md'), indexMd)
    }
  }

  return result
}

// ─── Helpers ───

function loadManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Manifest not found at ${MANIFEST_PATH}`)
  }
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8')
  return yaml.load(raw) as Manifest
}

// ─── CLI entry ───
const isMain =
  (typeof require !== 'undefined' && require.main === module) ||
  process.argv[1]?.endsWith('generate-from-manifest.ts')

if (isMain) {
  try {
    const result = await generateFromManifest()
    console.log(
      `[generate-from-manifest] ✅ ${result.articles} articles → ` +
        `${result.files} MD files + ${result.collages} collage JSONs`
    )
  } catch (err) {
    console.error('[generate-from-manifest] ❌ Failed:', err)
    process.exit(1)
  }
}
