#!/usr/bin/env bun
/**
 * Sitemap Validation Script
 * Checks sitemap.xml exists, validates structure, counts URLs
 */

import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

const SITEMAP_PATH = 'dist/sitemap.xml'

interface CheckResult {
  name: string
  passed: boolean
  message: string
}

async function validateSitemap(): Promise<CheckResult[]> {
  const results: CheckResult[] = []

  // Check file exists
  if (!existsSync(SITEMAP_PATH)) {
    results.push({
      name: 'sitemap-exists',
      passed: false,
      message: `Sitemap not found at ${SITEMAP_PATH}`,
    })
    return results
  }

  results.push({
    name: 'sitemap-exists',
    passed: true,
    message: `Sitemap found at ${SITEMAP_PATH}`,
  })

  const content = await readFile(SITEMAP_PATH, 'utf-8')

  // Check has XML declaration
  if (content.includes('<?xml')) {
    results.push({
      name: 'xml-declaration',
      passed: true,
      message: 'XML declaration present',
    })
  } else {
    results.push({
      name: 'xml-declaration',
      passed: false,
      message: 'Missing XML declaration',
    })
  }

  // Check has urlset element
  if (content.includes('<urlset')) {
    results.push({
      name: 'urlset-element',
      passed: true,
      message: 'urlset element present',
    })
  } else {
    results.push({
      name: 'urlset-element',
      passed: false,
      message: 'Missing urlset element',
    })
  }

  // Check has xmlns schema
  if (content.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    results.push({
      name: 'xmlns-schema',
      passed: true,
      message: 'Sitemap namespace declared',
    })
  } else {
    results.push({
      name: 'xmlns-schema',
      passed: false,
      message: 'Missing sitemap namespace',
    })
  }

  // Count URLs
  const urlMatches = content.match(/<url[\s>]/g)
  const urlCount = urlMatches ? urlMatches.length : 0

  if (urlCount >= 3) {
    results.push({
      name: 'url-count',
      passed: true,
      message: `Found ${urlCount} URLs in sitemap (minimum: 3)`,
    })
  } else {
    results.push({
      name: 'url-count',
      passed: false,
      message: `Found ${urlCount} URLs (minimum: 3 required)`,
    })
  }

  // Check hreflang support
  if (content.includes('xhtml:link')) {
    results.push({
      name: 'hreflang-support',
      passed: true,
      message: 'hreflang links present in sitemap',
    })
  } else {
    results.push({
      name: 'hreflang-support',
      passed: false,
      message: 'No hreflang links found',
    })
  }

  // Check x-default
  if (content.includes('x-default')) {
    results.push({
      name: 'x-default',
      passed: true,
      message: 'x-default hreflang defined',
    })
  } else {
    results.push({
      name: 'x-default',
      passed: false,
      message: 'Missing x-default hreflang',
    })
  }

  return results
}

async function main(): Promise<void> {
  console.log('▶ [ship-check] sitemap:check: Validating sitemap.xml\n')

  const results = await validateSitemap()

  for (const result of results) {
    const icon = result.passed ? '✅' : '❌'
    console.log(`${icon} ${result.name}: ${result.message}`)
  }

  console.log('')

  const allPassed = results.every(r => r.passed)

  if (allPassed) {
    console.log('✅ sitemap:check passed')
    process.exit(0)
  } else {
    const failed = results.filter(r => !r.passed)
    console.error(`❌ sitemap:check failed: ${failed.length} check(s) failed`)
    process.exit(1)
  }
}

await main()
