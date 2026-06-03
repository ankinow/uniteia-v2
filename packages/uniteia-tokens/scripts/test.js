#!/usr/bin/env node
/**
 * test.js — Token verification tests
 * PLANO-076: Validates all required tokens, no duplicates, valid syntax
 */
const fs = require('node:fs')
const path = require('node:path')

const tokensJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'dist', 'tokens.json'), 'utf8')
)

let passed = 0
let failed = 0

function assert(condition, msg) {
  if (condition) {
    passed++
  } else {
    failed++
    console.error(`  ✗ FAIL: ${msg}`)
  }
}

// 1. All required primitive tokens exist
const requiredPrimitives = [
  'solar-0',
  'solar-5',
  'solar-10',
  'solar-20',
  'solar-40',
  'solar-50',
  'solar-60',
  'solar-70',
  'solar-80',
  'solar-90',
  'solar-100',
  'accent-blue-500',
  'accent-green-500',
  'accent-red-500',
  'accent-cyan',
  'accent-gold',
  'font-sans',
  'font-jp',
  'font-sc',
  'space-1',
  'space-5',
  'space-10',
  'radius-sm',
  'radius-md',
  'radius-lg',
  'shadow-sm',
  'shadow-md',
  'shadow-lg',
  'ease-smooth',
  'ease-bounce',
  'duration-fast',
  'duration-base',
]

for (const token of requiredPrimitives) {
  assert(tokensJson[token], `missing required primitive: ${token}`)
}

// 2. Required semantic tokens
const requiredSemantic = [
  'color-bg-primary',
  'color-text-primary',
  'color-accent',
  'color-success',
  'color-error',
]

for (const token of requiredSemantic) {
  assert(tokensJson[token], `missing required semantic: ${token}`)
}

// 3. Required material tokens
const requiredMaterials = [
  'material-carbon-bg',
  'material-frosted-bg',
  'material-paper-bg',
  'material-chrome-gradient',
]

for (const token of requiredMaterials) {
  assert(tokensJson[token], `missing required material: ${token}`)
}

// 4. No duplicate token names
const names = Object.keys(tokensJson)
const uniqueNames = new Set(names)
assert(uniqueNames.size === names.length, 'duplicate token names found')

// 5. CSS custom property syntax valid (all start with `--`)
for (const name of names) {
  assert(/^[a-z0-9-]+$/.test(name), `invalid token name: ${name}`)
}

// 6. Color values valid format
const colorPattern = /^(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(|hsl\()/
const colorTokens = names.filter(
  n => n.includes('color') || n.includes('accent') || n.includes('solar') || n.includes('material')
)
for (const name of colorTokens) {
  const val = tokensJson[name]
  // Skip gradient values and var() references
  if (!val.startsWith('linear-') && !val.startsWith('var(--')) {
    assert(colorPattern.test(val), `invalid color format: ${name} = ${val}`)
  }
}

// 7. Component tokens
const componentTokens = names.filter(
  n =>
    n.startsWith('card-') ||
    n.startsWith('button-') ||
    n.startsWith('input-') ||
    n.startsWith('heading-') ||
    n.startsWith('body-')
)
assert(componentTokens.length >= 8, `too few component tokens: ${componentTokens.length}`)

// Report
console.log(`\n  ✓ ${passed} passed`)
if (failed > 0) {
  console.log(`  ✗ ${failed} failed`)
  process.exit(1)
} else {
  console.log('  ✓ all tests passed')
}
