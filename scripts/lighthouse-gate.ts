#!/usr/bin/env bun

import { formatLighthouseGateReport, runLighthouseGate } from '../src/utils/lighthouse-gate'

interface CliOptions {
  buildDir: string
  auditedPath: string
  performanceThreshold: number | undefined
  accessibilityThreshold: number | undefined
  bestPracticesThreshold: number | undefined
  seoThreshold: number | undefined
  previewTimeoutMs: number | undefined
  browserTimeoutMs: number | undefined
}

function parseArgv(argv: string[]): CliOptions {
  let buildDir = 'dist'
  let auditedPath = '/en'
  let performanceThreshold: number | undefined
  let accessibilityThreshold: number | undefined
  let bestPracticesThreshold: number | undefined
  let seoThreshold: number | undefined
  let previewTimeoutMs: number | undefined
  let browserTimeoutMs: number | undefined

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--build-dir' || arg === '--buildDir') {
      const value = argv[++index]
      if (!value) {
        throw new Error('Missing value for --build-dir')
      }
      buildDir = value
      continue
    }

    if (arg === '--audit-path' || arg === '--auditPath') {
      const value = argv[++index]
      if (!value) {
        throw new Error('Missing value for --audit-path')
      }
      auditedPath = value
      continue
    }

    if (arg === '--performance-threshold') {
      const value = argv[++index]
      if (!value) {
        throw new Error('Missing value for --performance-threshold')
      }
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
        throw new Error(`Invalid performance threshold value: ${value}`)
      }
      performanceThreshold = parsed
      continue
    }

    if (arg === '--accessibility-threshold') {
      const value = argv[++index]
      if (!value) {
        throw new Error('Missing value for --accessibility-threshold')
      }
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
        throw new Error(`Invalid accessibility threshold value: ${value}`)
      }
      accessibilityThreshold = parsed
      continue
    }

    if (arg === '--best-practices-threshold') {
      const value = argv[++index]
      if (!value) {
        throw new Error('Missing value for --best-practices-threshold')
      }
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
        throw new Error(`Invalid best-practices threshold value: ${value}`)
      }
      bestPracticesThreshold = parsed
      continue
    }

    if (arg === '--seo-threshold') {
      const value = argv[++index]
      if (!value) {
        throw new Error('Missing value for --seo-threshold')
      }
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
        throw new Error(`Invalid seo threshold value: ${value}`)
      }
      seoThreshold = parsed
      continue
    }

    if (arg === '--preview-timeout' || arg === '--preview-timeout-ms') {
      const value = argv[++index]
      if (!value) {
        throw new Error('Missing value for --preview-timeout')
      }
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed < 0) {
        throw new Error(`Invalid preview timeout value: ${value}`)
      }
      previewTimeoutMs = parsed
      continue
    }

    if (arg === '--browser-timeout' || arg === '--browser-timeout-ms') {
      const value = argv[++index]
      if (!value) {
        throw new Error('Missing value for --browser-timeout')
      }
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed < 0) {
        throw new Error(`Invalid browser timeout value: ${value}`)
      }
      browserTimeoutMs = parsed
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: bun run scripts/lighthouse-gate.ts [--build-dir dist] [--audit-path /en] [--performance-threshold 90] [--accessibility-threshold 95] [--best-practices-threshold 95] [--seo-threshold 95] [--preview-timeout 30000] [--browser-timeout 30000]'
      )
      process.exit(0)
    }

    // Ignore verification scaffolding and other unknown arguments
  }

  return {
    buildDir,
    auditedPath,
    performanceThreshold,
    accessibilityThreshold,
    bestPracticesThreshold,
    seoThreshold,
    previewTimeoutMs,
    browserTimeoutMs,
  }
}

async function main(): Promise<void> {
  try {
    const options = parseArgv(process.argv.slice(2))
    const categoryThresholds = {
      performance: options.performanceThreshold,
      accessibility: options.accessibilityThreshold,
      bestPractices: options.bestPracticesThreshold,
      seo: options.seoThreshold,
    }
    const report = await runLighthouseGate({
      buildDir: options.buildDir,
      auditedPath: options.auditedPath,
      categoryThresholds,
      previewTimeoutMs: options.previewTimeoutMs,
      browserTimeoutMs: options.browserTimeoutMs,
    })
    const output = formatLighthouseGateReport(report)
    if (report.ok) {
      console.log(output)
      process.exit(0)
    }
    console.error(output)
    process.exit(1)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`❌ Lighthouse gate failed before analysis: ${message}`)
    process.exit(1)
  }
}

await main()
