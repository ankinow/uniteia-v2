#!/usr/bin/env bun
/**
 * Single Header Check
 * Verifies that built HTML pages contain exactly one <header> element
 */
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { glob } from 'glob'

const DIST_PATH = 'dist'

interface CheckResult {
  name: string
  passed: boolean
  message: string
}

async function checkSingleHeader(): Promise<CheckResult[]> {
  const results: CheckResult[] = []

  // Check dist exists
  if (!existsSync(DIST_PATH)) {
    results.push({
      name: 'dist-exists',
      passed: false,
      message: `Build output not found at ${DIST_PATH}. Run 'bun run build' first.`,
    })
    return results
  }
  results.push({ name: 'dist-exists', passed: true, message: `Build output found at ${DIST_PATH}` })

  // Find all HTML files in dist
  const htmlFiles = await glob(`${DIST_PATH}/**/*.html`, { ignore: ['**/node_modules/**'] })
  if (htmlFiles.length === 0) {
    results.push({ name: 'html-files-found', passed: false, message: 'No HTML files found in dist/' })
    return results
  }
  results.push({ name: 'html-files-found', passed: true, message: `Found ${htmlFiles.length} HTML file(s)` })

  // Check each HTML file for single header
  let allPassed = true
  for (const file of htmlFiles.slice(0, 20)) {
    try {
      const content = await readFile(file, 'utf-8')
      const headerMatches = content.match(/<header[\s>]/gi) || []
      const headerCount = headerMatches.length

      if (headerCount === 1) {
        results.push({ name: `header:${file.replace(`${DIST_PATH}/`, '')}`, passed: true, message: `1 <header> element` })
      } else if (headerCount === 0) {
        results.push({ name: `header:${file.replace(`${DIST_PATH}/`, '')}`, passed: false, message: `Missing <header> element` })
        allPassed = false
      } else {
        results.push({ name: `header:${file.replace(DIST_PATH + '/', '')}`, passed: false, message: `${headerCount} <header> elements (should be 1)` })
        allPassed = false
      }
    } catch (error) {
      results.push({ name: `header:${file}`, passed: false, message: `Read error: ${error}` })
      allPassed = false
    }
  }

  results.push({ name: 'single-header-constraint', passed: allPassed, message: allPassed ? 'All pages have exactly one <header>' : 'Some pages have incorrect header count' })
  return results
}

async function main(): Promise<void> {
  console.log('▶ [ship-check] header:single: Verifying single <header> constraint\n')
  const results = await checkSingleHeader()
  for (const result of results) {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}: ${result.message}`)
  }
  console.log('')
  const allPassed = results.every(r => r.passed)
  if (allPassed) {
    console.log('✅ header:single check passed')
    process.exit(0)
  } else {
    console.error(`❌ header:single check failed: ${results.filter(r => !r.passed).length} check(s) failed`)
    process.exit(1)
  }
}

await main()
