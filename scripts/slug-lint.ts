#!/usr/bin/env bun

import { evaluateSlugCheck, formatSlugCheckReport } from '../src/utils/slug-check'

async function main(): Promise<void> {
  try {
    const report = await evaluateSlugCheck()
    const output = formatSlugCheckReport(report)

    if (report.ok) {
      console.log(output)
      process.exit(0)
    }

    console.error(output)
    process.exit(1)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`❌ Slug check failed before analysis: ${message}`)
    process.exit(1)
  }
}

await main()
