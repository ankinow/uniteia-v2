#!/usr/bin/env node
/**
 * build.js — @hermes/uniteia-tokens build script
 * PLANO-076: Extracts CSS custom properties → JSON → YAML → .d.ts
 */
const fs = require('node:fs')
const path = require('node:path')
const yaml = require('yaml')

const cssPath = path.join(__dirname, '..', 'tokens.css')
const css = fs.readFileSync(cssPath, 'utf8')

// Extract all CSS custom properties
const tokens = {}
const regex = /^\s{2}--([a-z0-9-]+):\s*([^;]+);/gm
let match

while ((match = regex.exec(css)) !== null) {
  const [, name, value] = match
  tokens[name] = value.trim()
}

// Build output
const distDir = path.join(__dirname, '..', 'dist')
fs.mkdirSync(distDir, { recursive: true })
fs.writeFileSync(path.join(distDir, 'tokens.json'), JSON.stringify(tokens, null, 2))
fs.writeFileSync(path.join(distDir, 'tokens.yaml'), yaml.stringify(tokens))
fs.copyFileSync(cssPath, path.join(distDir, 'tokens.css'))

// Generate TypeScript declarations
const tsLines = Object.keys(tokens).map(n => `  export const ${n.replace(/-/g, '_')}: string`)
fs.writeFileSync(
  path.join(distDir, 'tokens.d.ts'),
  `declare module '@hermes/uniteia-tokens' {\n${tsLines.join(';\n')};\n}\n`
)

// Write a summary
const summary = {
  totalTokens: Object.keys(tokens).length,
  primitive: Object.keys(tokens).filter(
    k =>
      !k.includes('-bg-') &&
      !k.includes('-text-') &&
      !k.includes('-border-') &&
      !k.includes('-accent-') &&
      !k.startsWith('material-') &&
      !k.startsWith('card-') &&
      !k.startsWith('button-') &&
      !k.startsWith('input-') &&
      !k.startsWith('heading-') &&
      !k.startsWith('body-')
  ).length,
  semantic: Object.keys(tokens).filter(k => k.startsWith('color-') || k.startsWith('material-'))
    .length,
  component: Object.keys(tokens).filter(
    k =>
      k.startsWith('card-') ||
      k.startsWith('button-') ||
      k.startsWith('input-') ||
      k.startsWith('heading-') ||
      k.startsWith('body-')
  ).length,
}

console.log('✓ @hermes/uniteia-tokens built')
console.log(`  ${summary.totalTokens} total tokens`)
console.log(`  ${summary.primitive} primitive`)
console.log(`  ${summary.semantic} semantic`)
console.log(`  ${summary.component} component`)
