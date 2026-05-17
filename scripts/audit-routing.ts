#!/usr/bin/env bun
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { routes } from '../src/routing/routes'

console.log('[audit-routing] Starting routing and hardcoded link audit...')

const SRC_DIR = resolve(import.meta.dirname, '..', 'src')
const filesToAudit: string[] = []

function collectFiles(dir: string) {
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) {
      if (
        entry !== 'node_modules' &&
        entry !== 'dist' &&
        entry !== '.git' &&
        entry !== 'generated'
      ) {
        collectFiles(path)
      }
    } else if (/\.(tsx|ts|js|jsx)$/.test(entry)) {
      filesToAudit.push(path)
    }
  }
}

collectFiles(SRC_DIR)
console.log(`[audit-routing] Found ${filesToAudit.length} files to scan.`)

let hardcodedLinksCount = 0
const findings: Array<{ file: string; line: number; text: string }> = []

for (const file of filesToAudit) {
  // Skip routes.ts itself and generated files
  if (file.includes('routing/routes.ts') || file.includes('.generated.')) continue

  const content = readFileSync(file, 'utf-8')
  const lines = content.split('\n')

  lines.forEach((lineText, index) => {
    // Regex to find hardcoded signals/home links like href="/en/..." or href="/pt/signals..."
    const hrefRegex = /href=["']\/(en|pt|es|fr|de|it|ja|zh)\/([^"']+)["']/g
    let match: RegExpExecArray | null
    // biome-ignore lint/suspicious/noAssignInExpressions: standard regex matching loop
    while ((match = hrefRegex.exec(lineText)) !== null) {
      hardcodedLinksCount++
      findings.push({
        file: file.replace(SRC_DIR, 'src'),
        line: index + 1,
        text: match[0],
      })
    }
  })
}

console.log(`[audit-routing] Found ${hardcodedLinksCount} hardcoded localized links.`)
if (findings.length > 0) {
  console.log('[audit-routing] Detailed findings:')
  for (const f of findings) {
    console.log(`  - ${f.file}:${f.line} -> ${f.text}`)
  }
} else {
  console.log('[audit-routing] ✅ Zero hardcoded localized links found outside routes.ts!')
}

// Perform test matrix verification for routes.localized()
console.log('[audit-routing] Verifying RouteContract.localized() matrix...')
const testLocales = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const
const testPaths = [
  '/',
  '/en',
  '/pt/signals/ai-agents/agregadores-llm',
  '/en/signals/ai-agents/llm-aggregators-compared?q=test#hash',
]

let matrixChecksPassed = 0
let matrixChecksFailed = 0

for (const path of testPaths) {
  for (const target of testLocales) {
    const result = routes.localized(path, target)
    if (result.startsWith(`/${target}`)) {
      matrixChecksPassed++
    } else {
      matrixChecksFailed++
      console.error(`❌ Matrix failure: localized(${path}, ${target}) -> ${result}`)
    }
  }
}

console.log(
  `[audit-routing] Matrix verification complete. Passed: ${matrixChecksPassed}, Failed: ${matrixChecksFailed}`
)
if (matrixChecksFailed > 0) {
  process.exit(1)
} else {
  console.log('[audit-routing] ✅ All localized matrix tests passed successfully!')
}
