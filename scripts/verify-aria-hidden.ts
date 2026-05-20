#!/usr/bin/env bun
import { readFileSync } from 'node:fs'

const FILES = [
  'src/components/topic-card/index.tsx',
  'src/components/niche-card/index.tsx',
  'src/components/depth-card/index.tsx',
  'src/components/article-frame/index.tsx',
  'src/components/scroll-driven/scroll-depth-card-enhancer.tsx',
  'src/components/scroll-driven/sidebar-scroll-glow.tsx',
  'src/components/sidebar/index.tsx',
  'src/components/niche-landing/index.tsx',
  'src/components/cinematic-depth/CinematicDepthCard.tsx',
]

let violations = 0
for (const path of FILES) {
  const content = readFileSync(path, 'utf-8')
  const lines = content.split('\n')
  lines.forEach((line, i) => {
    // Skip comments and non-tag lines
    const trimmed = line.trim()
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('*/')
    ) {
      return
    }
    // Only check decorative div elements (empty decorative overlays)
    if (!trimmed.startsWith('<div')) {
      return
    }
    const isDecorative =
      line.includes('grain-4k') ||
      line.includes('scanlines') ||
      line.includes('paper-fiber') ||
      line.includes('bg-gradient-to-r from-transparent via-[var(--color-cyan)]') ||
      line.includes('neural glow')
    const hasAriaHidden = line.includes('aria-hidden="true"')
    if (isDecorative && !hasAriaHidden) {
      console.log(`❌ ${path}:${i + 1}: missing aria-hidden`)
      violations++
    }
  })
}
if (violations > 0) {
  console.error(`\nFound ${violations} missing aria-hidden violation(s)`)
  process.exit(1)
}
console.log('✅ All decorative overlays have aria-hidden')
