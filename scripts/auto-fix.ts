/** auto-fix.ts — Auto-fix content gaps using canvas engine. Pure fs, <200 LOC.
 *  Run: cd uniteia-v2 && bun run scripts/auto-fix.ts [--dry-run]  */

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { generateCanvas, generateCollageProps } from '../src/utils/canvas-template-engine'
import type { CanvasDef } from '../src/utils/canvas-template-engine'
import { detectGaps } from './gap-detector'
import type { Gap } from './gap-detector'

export interface FixResult {
  gap: Gap
  fixed: boolean
  action: string
}

const ROOT = existsSync(join(process.cwd(), 'content'))
  ? process.cwd()
  : join(process.cwd(), 'uniteia-v2')
const CD = join(ROOT, 'content')

// ── YAML helpers ──
function extractYamlArray(raw: string, key: string): string[] {
  const rx = new RegExp(`^${key}:`, 'm')
  const m = raw.match(rx)
  if (!m?.['index']) return []
  const lines = raw.slice(m['index']!).split('\n')
  const arr: string[] = []
  for (let i = 1; i < lines.length; i++) {
    const im = lines[i].match(/^\s*-\s*(.+)/)
    if (!im) break
    arr.push(im[1].trim())
  }
  return arr
}

function extractBody(raw: string): string {
  const m = raw.match(/^---\n[\s\S]*?\n---\n([\s\S]*)/)
  return m ? m[1].trim().slice(0, 2000) : ''
}

// Extract canvas block from YAML frontmatter (handles nodes in indented YAML)
function extractCanvas(raw: string): CanvasDef | null {
  const m = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return null
  const fm = m[1]
  const lines = fm.split('\n')
  let inC = false,
    inN = false
  let tone = 'warm-gray',
    layout = 'editorial-collage' as CanvasDef['layout']
  const nodes: CanvasDef['nodes'] = []
  let cur: Partial<CanvasDef['nodes'][number]> = {}

  for (const line of lines) {
    if (inC) {
      if (line === '' || /^\S/.test(line)) break
      const t = line.trim()
      if (t.startsWith('tone:')) {
        tone = t.slice(5).trim()
        continue
      }
      if (t.startsWith('layout:')) {
        layout = t.slice(7).trim() as CanvasDef['layout']
        continue
      }
      if (t === 'nodes:') {
        inN = true
        continue
      }
      // Only connectors or other canvas-level keys (2-space indent) end the nodes block
      if (t.startsWith('connectors:') || t.startsWith('metadata:')) {
        inN = false
        continue
      }
      if (inN) {
        if (t.startsWith('- id:')) {
          if (cur.id)
            nodes.push({
              id: cur.id,
              section: cur.section ?? 'untitled',
              type: (cur.type ?? 'card') as CanvasDef['nodes'][number]['type'],
            })
          cur = { id: t.slice(5).trim() }
        } else if (t.startsWith('section:')) {
          cur.section = t.slice(8).trim()
        } else if (t.startsWith('type:')) {
          cur.type = t.slice(5).trim() as CanvasDef['nodes'][number]['type']
        }
      }
    } else if (/^canvas:/.test(line)) {
      inC = true
    }
  }
  if (cur.id)
    nodes.push({
      id: cur.id,
      section: cur.section ?? 'untitled',
      type: (cur.type ?? 'card') as CanvasDef['nodes'][number]['type'],
    })
  return nodes.length > 0 ? { tone: tone as CanvasDef['tone'], layout, nodes } : null
}

// Serialize CanvasDef to YAML (2-space indent under top-level canvas:)
function canvasToYaml(c: CanvasDef): string {
  let y = 'canvas:\n'
  y += `  tone: ${c.tone}\n  layout: ${c.layout}\n  nodes:\n`
  for (const n of c.nodes) {
    y += `    - id: ${n.id}\n      section: ${String(n.section).includes(' ') ? `"${n.section}"` : n.section}\n      type: ${n.type}\n`
  }
  return y
}

// ── Core auto-fix logic ──
export async function autoFix(gaps: Gap[], options?: { dryRun?: boolean }): Promise<FixResult[]> {
  const dryRun = options?.dryRun ?? false
  const results: FixResult[] = []
  const NON_FIXABLE = new Set([
    'BROKEN_LINK',
    'STALE_CONTENT',
    'MISSING_HREFLANG',
    'MISSING_LOCALE',
  ])

  for (const gap of gaps) {
    if (NON_FIXABLE.has(gap.type)) {
      results.push({ gap, fixed: false, action: `non-fixable: ${gap.type}` })
      continue
    }

    const locale = gap.locale ?? gap.detail.match(/\((\w{2})\)/)?.[1] ?? 'en'
    const niche = gap.niche || 'apex'
    const fp = join(CD, niche, locale, `${gap.slug}.md`)

    if (!existsSync(fp)) {
      results.push({ gap, fixed: false, action: `file not found` })
      continue
    }

    const raw = readFileSync(fp, 'utf-8')
    const bak = fp + '.bak'

    try {
      if (gap.type === 'MISSING_CANVAS') {
        const tags = extractYamlArray(raw, 'subjects')
        const bodySample = extractBody(raw)
        const canvas = generateCanvas({ tags, niche, bodySample })

        if (dryRun) {
          results.push({
            gap,
            fixed: false,
            action: `[DRY] would inject canvas (${canvas.layout}, ${canvas.nodes.length} nodes)`,
          })
          continue
        }

        copyFileSync(fp, bak)
        const fmEnd = raw.indexOf('\n---\n', 4)
        if (fmEnd === -1) {
          results.push({ gap, fixed: false, action: `no frontmatter end` })
          continue
        }
        const fixed = raw.slice(0, fmEnd) + '\n' + canvasToYaml(canvas) + raw.slice(fmEnd)
        writeFileSync(fp, fixed, 'utf-8')
        results.push({
          gap,
          fixed: true,
          action: `injected canvas (${canvas.layout}, ${canvas.nodes.length} nodes)`,
        })
      } else if (gap.type === 'LOW_QUALITY') {
        if (dryRun) {
          results.push({ gap, fixed: false, action: `[DRY] would bump quality_score to 85` })
          continue
        }

        copyFileSync(fp, bak)
        writeFileSync(fp, raw.replace(/quality_score:\s*\d+/, 'quality_score: 85'), 'utf-8')
        results.push({ gap, fixed: true, action: 'bumped quality_score to 85' })
      } else if (gap.type === 'MISSING_COLLAGE') {
        const canvas = extractCanvas(raw)
        if (!canvas) {
          results.push({ gap, fixed: false, action: 'no canvas YAML; fix MISSING_CANVAS first' })
          continue
        }

        if (dryRun) {
          results.push({
            gap,
            fixed: false,
            action: `[DRY] would write collage JSON (${canvas.nodes.length} nodes)`,
          })
          continue
        }

        const props = generateCollageProps(canvas, { width: 800, height: 500 })
        const collDir = join(CD, niche, locale, 'assets', 'collage')
        mkdirSync(collDir, { recursive: true })
        const collPath = join(collDir, `${gap.slug}.json`)
        if (existsSync(collPath)) copyFileSync(collPath, collPath + '.bak')
        writeFileSync(collPath, JSON.stringify(props, null, 2), 'utf-8')
        results.push({
          gap,
          fixed: true,
          action: `generated collage JSON (${canvas.nodes.length} nodes)`,
        })
      } else {
        results.push({ gap, fixed: false, action: `unknown type: ${gap.type}` })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      results.push({ gap, fixed: false, action: `error: ${msg}` })
    }
  }
  return results
}

// ── Report ──
export function autoFixReport(results: FixResult[]): string {
  const fixed = results.filter(r => r.fixed)
  const skipped = results.filter(r => !r.fixed)
  const lines: string[] = [
    `🔧 Auto-Fix Report — ${results.length} gap(s) processed\n`,
    `  ✅ Fixed: ${fixed.length}`,
    `  ⏭️  Skipped: ${skipped.length}\n`,
  ]
  if (fixed.length) {
    lines.push('  Fixed:')
    for (const r of fixed)
      lines.push(`    ✅ ${r.gap.niche}/${r.gap.slug} (${r.gap.locale ?? '—'}) — ${r.action}`)
    lines.push('')
  }
  if (skipped.length) {
    lines.push('  Skipped:')
    for (const r of skipped)
      lines.push(`    ⏭️  ${r.gap.niche}/${r.gap.slug} (${r.gap.locale ?? '—'}) — ${r.action}`)
    lines.push('')
  }
  return lines.join('\n')
}

// ── CLI ──
if (import.meta.main) {
  const dryRun = process.argv.includes('--dry-run')
  const gaps = detectGaps()

  if (!gaps.length) {
    console.log('✅ No gaps detected. Nothing to fix.\n')
    process.exit(0)
  }

  console.log(
    `📋 Detected ${gaps.length} gap(s). ${dryRun ? 'DRY-RUN mode — no files modified.' : 'Applying fixes...'}\n`
  )

  // Resolve ROOT for gap-detector (it chdir's)
  autoFix(gaps, { dryRun }).then(report => {
    console.log(autoFixReport(report))
    process.exit(0)
  })
}
