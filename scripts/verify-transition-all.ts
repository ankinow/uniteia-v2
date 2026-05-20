#!/usr/bin/env bun
import { readFileSync } from 'node:fs'
import { glob } from 'node:fs/promises'

const files = await Array.fromAsync(glob('src/**/*.{tsx,css}'))
let violations = 0
for (const file of files) {
  const content = readFileSync(file, 'utf-8')
  const lines = content.split('\n')
  lines.forEach((line, i) => {
    if (line.includes('transition-all') && !line.includes('/*')) {
      console.log(`❌ ${file}:${i + 1}: ${line.trim()}`)
      violations++
    }
  })
}
if (violations > 0) {
  console.error(`\nFound ${violations} transition-all violation(s)`)
  process.exit(1)
}
console.log('✅ No transition-all violations found')
