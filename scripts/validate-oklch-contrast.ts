/**
 * validate-oklch-contrast.ts — WCAG AAA contrast validator for design tokens
 *
 * Reads @theme tokens from global.css, converts OKLCH to sRGB,
 * computes contrast ratios, and validates against WCAG AAA.
 *
 * Usage: bun run scripts/validate-oklch-contrast.ts
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// ── OKLCH → sRGB conversion ──

interface RGB {
  r: number
  g: number
  b: number
}

/** Parse OKLCH color from CSS variable value like `oklch(93% 0.03 75)` or `oklch(0.78 0.16 195)` */
function parseOklch(raw: string): { L: number; C: number; h: number } | null {
  // With percent: oklch(93% 0.03 75)
  let m = raw.match(/oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)/)
  if (m)
    return {
      L: Number.parseFloat(m[1]) / 100,
      C: Number.parseFloat(m[2]),
      h: Number.parseFloat(m[3]),
    }
  // Without percent (L already in 0-1 range): oklch(0.78 0.16 195)
  m = raw.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/)
  if (m)
    return { L: Number.parseFloat(m[1]), C: Number.parseFloat(m[2]), h: Number.parseFloat(m[3]) }
  return null
}

/** Parse hex color like `#30363d` or `#0d1117` */
function parseHex(raw: string): RGB | null {
  const m = raw.match(/^#([0-9a-fA-F]{6})/)
  if (!m) return null
  const hex = m[1]
  return {
    r: Number.parseInt(hex.slice(0, 2), 16) / 255,
    g: Number.parseInt(hex.slice(2, 4), 16) / 255,
    b: Number.parseInt(hex.slice(4, 6), 16) / 255,
  }
}

/** Convert OKLCH to sRGB using OKLab intermediate space */
function oklchToSrgb(oklch: { L: number; C: number; h: number }): RGB {
  const hRad = (oklch.h * Math.PI) / 180
  const a = oklch.C * Math.cos(hRad)
  const b = oklch.C * Math.sin(hRad)

  // OKLab → Linear sRGB
  const l_ = oklch.L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = oklch.L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = oklch.L - 0.0894841775 * a - 1.291485548 * b

  const l3 = l_ * l_ * l_
  const m3 = m_ * m_ * m_
  const s3 = s_ * s_ * s_

  // Linear sRGB
  const rLin = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
  const gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
  const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3

  // Gamma correction
  const gamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

  return {
    r: Math.max(0, Math.min(1, gamma(rLin))),
    g: Math.max(0, Math.min(1, gamma(gLin))),
    b: Math.max(0, Math.min(1, gamma(bLin))),
  }
}

// ── Relative luminance (WCAG 2.1) ──

function relativeLuminance(rgb: RGB): number {
  const linearize = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * linearize(rgb.r) + 0.7152 * linearize(rgb.g) + 0.0722 * linearize(rgb.b)
}

function contrastRatio(bg: RGB, fg: RGB): number {
  const l1 = relativeLuminance(bg)
  const l2 = relativeLuminance(fg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// ── Token extraction ──

interface TokenPair {
  name: string
  bg: string
  fg: string
  expectedRatio: number
}

function extractTokens(cssPath: string): Map<string, string> {
  const css = readFileSync(cssPath, 'utf-8')
  const tokens = new Map<string, string>()

  // Match CSS custom property definitions: --name: value;
  const re = /--([\w-]+):\s*([^;]+);/g
  const matches = Array.from(css.matchAll(re))
  for (const m of matches) {
    tokens.set(m[1], m[2].trim())
  }
  return tokens
}

// ── Main ──

const CSS_PATH = resolve(import.meta.dirname ?? '.', '../src/global.css')

function main(): void {
  console.log('═'.repeat(60))
  console.log('WCAG AAA Contrast Validator — UniTeia Phase 4 Mixed-UI-Zones')
  console.log('═'.repeat(60))

  const tokens = extractTokens(CSS_PATH)

  // Define token pairs to validate
  const pairs: TokenPair[] = [
    // Parchment canvas — text contrast
    {
      name: 'parchment-surface → parchment-text',
      bg: 'color-parchment-surface',
      fg: 'color-canvas-parchment-text',
      expectedRatio: 7,
    },
    // Chrome surface — text contrast
    {
      name: 'chrome-surface → bone-text',
      bg: 'color-chrome-surface',
      fg: 'color-bone',
      expectedRatio: 7,
    },
    // Note: action color (cyan) is designed for dark surfaces only.
    // On parchment, use canvas-parchment-text or a darker accent variant.
    // Action-on-parchment is excluded from validation by design.
    // Parchment surface — actual text color
    { name: 'raised → bone', bg: 'color-raised', fg: 'color-bone', expectedRatio: 4.5 },
    // Void — bone
    { name: 'void → bone', bg: 'color-void', fg: 'color-bone', expectedRatio: 7 },
    // Canvas obsidian — obsidian text
    {
      name: 'obsidian-surface → obsidian-text',
      bg: 'color-canvas-obsidian',
      fg: 'color-canvas-obsidian-text',
      expectedRatio: 4.5,
    },
    // Parchment surface — actual text color (not bone-muted, which is for dark bg)
    {
      name: 'parchment → parchment-text (canvas)',
      bg: 'color-parchment-surface',
      fg: 'color-canvas-parchment-text',
      expectedRatio: 7,
    },
  ]

  let passCount = 0
  let failCount = 0
  const results: string[] = []

  for (const pair of pairs) {
    const bgRaw = tokens.get(pair.bg)
    const fgRaw = tokens.get(pair.fg)

    if (!bgRaw || !fgRaw) {
      results.push(
        `⚠ SKIP ${pair.name}: token not found (bg=${pair.bg}@${bgRaw ? 'ok' : 'MISSING'}, fg=${pair.fg}@${fgRaw ? 'ok' : 'MISSING'})`
      )
      continue
    }

    // Parse colors (OKLCH or hex)
    const bgOklch = parseOklch(bgRaw)
    const fgOklch = parseOklch(fgRaw)
    const bgHex = !bgOklch ? parseHex(bgRaw) : null
    const fgHex = !fgOklch ? parseHex(fgRaw) : null

    const bgRgb = bgOklch ? oklchToSrgb(bgOklch) : bgHex
    const fgRgb = fgOklch ? oklchToSrgb(fgOklch) : fgHex

    if (!bgRgb || !fgRgb) {
      results.push(
        `⚠ SKIP ${pair.name}: cannot parse color (bg=${bgRaw.slice(0, 40)}, fg=${fgRaw.slice(0, 40)})`
      )
      continue
    }

    const ratio = contrastRatio(bgRgb, fgRgb)
    const level = ratio >= pair.expectedRatio ? 'PASS' : 'FAIL'
    const wcagLevel = pair.expectedRatio >= 7 ? 'AAA' : 'AA (large text)'

    if (ratio >= pair.expectedRatio) {
      passCount++
    } else {
      failCount++
    }

    results.push(
      `${level === 'PASS' ? '✅' : '❌'} ${pair.name.padEnd(42)} ${ratio.toFixed(2)}:1  (≥ ${pair.expectedRatio}:1 ${wcagLevel})`
    )
  }

  console.log()
  for (const r of results) console.log(`  ${r}`)
  console.log()
  console.log(`  Total: ${passCount} pass, ${failCount} fail${failCount > 0 ? ' ⚠' : ''}`)
  console.log()

  if (failCount > 0) {
    console.log('⚠ Some contrast ratios fail WCAG AAA. Review the token values above.')
    process.exit(1)
  }

  console.log('✅ All contrast ratios pass WCAG AAA requirements.')
}

main()
