#!/usr/bin/env bun

import { evaluateRouteSizeGate, formatRouteSizeGateReport } from '../src/utils/size-gate'

interface CliOptions {
  buildDir: string
  thresholdBytes: number | undefined
}

function parseArgv(argv: string[]): CliOptions {
  let buildDir = 'dist'
  let thresholdBytes: number | undefined

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

    if (arg === '--threshold' || arg === '--threshold-bytes') {
      const value = argv[++index]
      if (!value) {
        throw new Error('Missing value for --threshold')
      }
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed < 0) {
        throw new Error(`Invalid threshold value: ${value}`)
      }
      thresholdBytes = parsed
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: bun run scripts/size-gate.ts [--build-dir dist] [--threshold 61440]')
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return { buildDir, thresholdBytes }
}

async function main(): Promise<void> {
  try {
    const options = parseArgv(process.argv.slice(2))
    const report = await evaluateRouteSizeGate(options)
    const output = formatRouteSizeGateReport(report)

    if (report.ok) {
      console.log(output)
      process.exit(0)
    }

    console.error(output)
    process.exit(1)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`❌ Route size gate failed before analysis: ${message}`)
    process.exit(1)
  }
}

await main()
