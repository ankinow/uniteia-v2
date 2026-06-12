#!/usr/bin/env bun
/**
 * Image optimization pipeline for UniTeia v2.
 *
 * Usage:
 *   bun run optimize:images                    # optimize public/assets/
 *   bun run optimize:images --source dist      # optimize dist/assets/
 *   bun run optimize:images --dry-run          # preview what would happen
 *   bun run optimize:images --force            # re-optimize existing outputs
 *
 * What it does:
 *   1. Finds all PNG/JPG/JPEG images in public/assets/ and content/**\/assets/
 *   2. Converts to WebP (lossy, quality 80) and AVIF (lossy, quality 50)
 *   3. Generates responsive sizes (320w, 640w, 1280w) — skipped when original is smaller
 *   4. Saves alongside originals: hero.jpg → hero.webp, hero.avif, hero-320w.webp, etc.
 *   5. Creates public/assets/optimized-manifest.json mapping original→optimized
 */

import { existsSync, mkdirSync } from 'node:fs'
import type { Dirent } from 'node:fs'
import * as fs from 'node:fs/promises'
import { basename, dirname, extname, join, relative } from 'node:path'
import sharp from 'sharp'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg'])
const RESPONSIVE_WIDTHS = [320, 640, 1280]
const WEBP_QUALITY = 80
const AVIF_QUALITY = 50

// Files/directories to skip
const SKIP_PATTERNS = [/\.git/, /node_modules/, /optimized-manifest\.json$/]

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Variant {
  path: string
  format: 'webp' | 'avif'
  width: number | null // null = full-size
  sizeBytes: number
}

interface Entry {
  original: string
  originalSize: number
  variants: Variant[]
}

interface Manifest {
  generated: string
  source: string
  totalOriginals: number
  totalOptimized: number
  originalBytes: number
  optimizedBytes: number
  entries: Entry[]
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

interface CliOptions {
  source: 'public' | 'dist'
  dryRun: boolean
  force: boolean
  help: boolean
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { source: 'public', dryRun: false, force: false, help: false }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--source') {
      const val = argv[++i]
      if (val !== 'public' && val !== 'dist') {
        throw new Error(`--source must be "public" or "dist", got "${val}"`)
      }
      opts.source = val
    } else if (arg === '--dry-run') {
      opts.dryRun = true
    } else if (arg === '--force') {
      opts.force = true
    } else if (arg === '--help' || arg === '-h') {
      opts.help = true
    } else {
      throw new Error(`Unknown argument: ${arg}`)
    }
  }

  return opts
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shouldSkip(filePath: string): boolean {
  return SKIP_PATTERNS.some(p => p.test(filePath))
}

async function findImages(rootDirs: string[]): Promise<string[]> {
  const results: string[] = []

  async function walk(dir: string): Promise<void> {
    let entries: Dirent[]
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return // directory doesn't exist or can't be read
    }

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (shouldSkip(fullPath)) continue

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase()
        if (IMAGE_EXTENSIONS.has(ext)) {
          results.push(fullPath)
        }
      }
    }
  }

  for (const dir of rootDirs) {
    if (existsSync(dir)) {
      await walk(dir)
    }
  }

  return results.sort()
}

function variantPath(originalPath: string, format: 'webp' | 'avif', width: number | null): string {
  const dir = dirname(originalPath)
  const base = basename(originalPath, extname(originalPath))
  if (width === null) {
    return join(dir, `${base}.${format}`)
  }
  return join(dir, `${base}-${width}w.${format}`)
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

async function processImage(originalPath: string, opts: CliOptions): Promise<Entry | null> {
  const originalBuffer = await fs.readFile(originalPath)
  const originalSize = originalBuffer.length
  const relPath = relative(process.cwd(), originalPath)

  // In dry-run mode, estimate variants without sharp processing
  if (opts.dryRun) {
    return dryRunEstimate(originalPath, originalBuffer, originalSize)
  }

  // Try to process with sharp
  let image: sharp.Sharp
  let metadata: sharp.Metadata
  try {
    image = sharp(originalBuffer)
    metadata = await image.metadata()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`  ❌ ${relPath}: unsupported format — ${msg}`)
    return null
  }

  const originalWidth = metadata.width ?? 0

  if (originalWidth === 0) {
    console.warn(`  ⚠ Skipping ${relPath}: could not determine width`)
    return null
  }

  const variants: Variant[] = []

  // Full-size conversions (WebP + AVIF)
  for (const format of ['webp', 'avif'] as const) {
    const outPath = variantPath(originalPath, format, null)

    if (!opts.force && existsSync(outPath)) {
      const stat = await fs.stat(outPath)
      variants.push({
        path: outPath,
        format,
        width: null,
        sizeBytes: stat.size,
      })
      console.log(`  ⏭ ${relPath} → ${basename(outPath)} (exists)`)
      continue
    }

    try {
      let pipeline = image.clone()
      if (format === 'webp') {
        pipeline = pipeline.webp({ quality: WEBP_QUALITY, effort: 6 })
      } else {
        pipeline = pipeline.avif({ quality: AVIF_QUALITY, effort: 5 })
      }

      const outputBuffer = await pipeline.toBuffer()
      await fs.mkdir(dirname(outPath), { recursive: true })
      await fs.writeFile(outPath, outputBuffer)
      variants.push({
        path: outPath,
        format,
        width: null,
        sizeBytes: outputBuffer.length,
      })
      console.log(`  ✅ ${relPath} → ${basename(outPath)} (${formatBytes(outputBuffer.length)})`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ❌ ${relPath} → ${basename(outPath)}: ${msg}`)
    }
  }

  // Responsive sizes (only if original is wider than the target)
  for (const width of RESPONSIVE_WIDTHS) {
    if (originalWidth <= width) {
      continue
    }

    for (const format of ['webp', 'avif'] as const) {
      const outPath = variantPath(originalPath, format, width)

      if (!opts.force && existsSync(outPath)) {
        const stat = await fs.stat(outPath)
        variants.push({ path: outPath, format, width, sizeBytes: stat.size })
        console.log(`  ⏭ ${relPath} → ${basename(outPath)} (exists)`)
        continue
      }

      try {
        let pipeline = image.clone().resize({ width, withoutEnlargement: true })
        if (format === 'webp') {
          pipeline = pipeline.webp({ quality: WEBP_QUALITY, effort: 6 })
        } else {
          pipeline = pipeline.avif({ quality: AVIF_QUALITY, effort: 5 })
        }

        const outputBuffer = await pipeline.toBuffer()
        await fs.mkdir(dirname(outPath), { recursive: true })
        await fs.writeFile(outPath, outputBuffer)
        variants.push({
          path: outPath,
          format,
          width,
          sizeBytes: outputBuffer.length,
        })
        console.log(
          `  ✅ ${relPath} → ${basename(outPath)} (${width}w, ${formatBytes(outputBuffer.length)})`
        )
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`  ❌ ${relPath} → ${basename(outPath)}: ${msg}`)
      }
    }
  }

  return { original: originalPath, originalSize, variants }
}

/**
 * Dry-run estimation: reads metadata with sharp to estimate variant counts
 * but does not write any files.
 */
async function dryRunEstimate(
  originalPath: string,
  originalBuffer: Buffer,
  originalSize: number
): Promise<Entry | null> {
  const relPath = relative(process.cwd(), originalPath)

  let originalWidth = 0
  try {
    const image = sharp(originalBuffer)
    const metadata = await image.metadata()
    originalWidth = metadata.width ?? 0
  } catch {
    console.error(`  ❌ ${relPath}: unsupported format (dry-run)`)
    return null
  }

  if (originalWidth === 0) {
    console.warn(`  ⚠ Skipping ${relPath}: could not determine width`)
    return null
  }

  const variants: Variant[] = []

  // Full-size
  for (const format of ['webp', 'avif'] as const) {
    const outPath = variantPath(originalPath, format, null)
    console.log(`  🔍 ${relPath} → ${basename(outPath)} (full-size ${format})`)
    variants.push({ path: outPath, format, width: null, sizeBytes: 0 })
  }

  // Responsive
  for (const width of RESPONSIVE_WIDTHS) {
    if (originalWidth <= width) {
      console.log(`  ⏭ ${relPath} → ${width}w (original only ${originalWidth}px)`)
      continue
    }
    for (const format of ['webp', 'avif'] as const) {
      const outPath = variantPath(originalPath, format, width)
      console.log(`  🔍 ${relPath} → ${basename(outPath)} (${width}w ${format})`)
      variants.push({ path: outPath, format, width, sizeBytes: 0 })
    }
  }

  return { original: originalPath, originalSize, variants }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2))

  if (opts.help) {
    console.log(`
UniTeia Image Optimization Pipeline
====================================

Usage:
  bun run optimize:images [options]

Options:
  --source <public|dist>   Target directory (default: public)
  --dry-run                 Preview what would be done without writing files
  --force                   Re-optimize even if output files already exist
  --help, -h                Show this help

Output:
  - WebP (lossy, q=${WEBP_QUALITY}) and AVIF (lossy, q=${AVIF_QUALITY}) for each image
  - Responsive sizes: ${RESPONSIVE_WIDTHS.map(w => `${w}w`).join(', ')}
  - Manifest: public/assets/optimized-manifest.json
`)
    return
  }

  // Determine source directories
  const projectRoot = process.cwd()
  const assetDirs: string[] = []

  if (opts.source === 'public') {
    assetDirs.push(join(projectRoot, 'public', 'assets'))
    // Also scan content/**/assets/
    const contentAssetsDirs = await findContentAssetDirs(projectRoot)
    assetDirs.push(...contentAssetsDirs)
  } else {
    assetDirs.push(join(projectRoot, 'dist', 'assets'))
  }

  const mode = opts.dryRun ? 'DRY RUN' : opts.force ? 'FORCE' : 'NORMAL'
  console.log(`\n🔍 Image Optimization Pipeline — ${mode} mode (source: ${opts.source})`)
  console.log(`   WebP quality: ${WEBP_QUALITY} | AVIF quality: ${AVIF_QUALITY}`)
  console.log(`   Responsive widths: ${RESPONSIVE_WIDTHS.join(', ')}`)
  console.log(`   Scanning: ${assetDirs.length} directories\n`)

  // Find all images
  const images = await findImages(assetDirs)
  console.log(`📸 Found ${images.length} images to process\n`)

  if (images.length === 0) {
    console.log('Nothing to do.')
    return
  }

  // Process each image
  const entries: Entry[] = []
  let processed = 0

  for (const imagePath of images) {
    const entry = await processImage(imagePath, opts)
    if (entry) {
      entries.push(entry)
    }
    processed++
  }

  // Build manifest
  const totalVariants = entries.reduce((sum, e) => sum + e.variants.length, 0)
  const originalBytes = entries.reduce((sum, e) => sum + e.originalSize, 0)
  const optimizedBytes = entries.reduce(
    (sum, e) => sum + e.variants.reduce((s, v) => s + v.sizeBytes, 0),
    0
  )

  const manifest: Manifest = {
    generated: new Date().toISOString(),
    source: opts.source,
    totalOriginals: entries.length,
    totalOptimized: totalVariants,
    originalBytes,
    optimizedBytes: opts.dryRun ? 0 : optimizedBytes,
    entries: entries.map(e => ({
      original: relative(projectRoot, e.original),
      originalSize: e.originalSize,
      variants: e.variants.map(v => ({
        path: relative(projectRoot, v.path),
        format: v.format,
        width: v.width,
        sizeBytes: opts.dryRun ? 0 : v.sizeBytes,
      })),
    })),
  }

  const manifestPath = join(
    projectRoot,
    opts.source === 'public' ? 'public' : 'dist',
    'assets',
    'optimized-manifest.json'
  )

  if (!opts.dryRun) {
    mkdirSync(dirname(manifestPath), { recursive: true })
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))
  }

  // Summary
  console.log(`\n${'═'.repeat(60)}`)
  console.log('📊 SUMMARY')
  console.log(`${'═'.repeat(60)}`)
  console.log(`  Images processed:  ${entries.length}`)
  console.log(`  Variants generated: ${totalVariants}`)
  console.log(`  Original size:     ${formatBytes(originalBytes)}`)
  if (!opts.dryRun) {
    const pct =
      originalBytes > 0
        ? (((originalBytes - optimizedBytes) / originalBytes) * 100).toFixed(1)
        : '0.0'
    console.log(`  Optimized size:    ${formatBytes(optimizedBytes)}`)
    console.log(`  Total reduction:   ${pct}%`)
  }
  console.log(`  Manifest:          ${relative(projectRoot, manifestPath)}`)
  console.log(`${'═'.repeat(60)}\n`)

  if (opts.dryRun) {
    console.log('💡 Dry run complete. Remove --dry-run to execute.\n')
  }
}

async function findContentAssetDirs(projectRoot: string): Promise<string[]> {
  const contentDir = join(projectRoot, 'content')
  const result: string[] = []

  async function walk(dir: string, depth: number): Promise<void> {
    if (depth > 5) return // safety limit
    let entries: Dirent[]
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'assets') {
          result.push(fullPath)
        } else {
          await walk(fullPath, depth + 1)
        }
      }
    }
  }

  if (existsSync(contentDir)) {
    await walk(contentDir, 0)
  }

  return result
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------

await main()
