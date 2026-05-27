#!/usr/bin/env bun
/**
 * Visual regression baseline manager.
 * Run with `bun run snapshot:update` to refresh all Playwright visual baselines.
 * Run with `bun run test:visual` to compare current build against stored baselines.
 *
 * This script is the CLI entry point for the W16 Visual Gate.
 */

import { execSync } from 'node:child_process'
import { existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const FLAG_FILE = resolve(ROOT, '.visual-regression-fail')

function fail(msg: string) {
  writeFileSync(FLAG_FILE, msg, 'utf-8')
  console.error('❌ VISUAL REGRESSION ALERT:', msg)
  process.exit(1)
}

function pass(msg: string) {
  if (existsSync(FLAG_FILE)) execSync(`rm -f "${FLAG_FILE}"`)
  console.log('✅', msg)
}

function main() {
  const args = process.argv.slice(2)
  const isUpdate = args.includes('--update') || args.includes('-u')
  const isCi = !!process.env.CI

  if (isUpdate) {
    console.log('📸 Updating visual baselines...')
    execSync('npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots', {
      stdio: 'inherit',
      cwd: ROOT,
      timeout: 300_000,
    })
    pass('Baselines updated')
    return
  }

  const specFile = resolve(ROOT, 'tests/e2e/visual-regression.spec.ts')
  if (!existsSync(specFile)) {
    fail(`visual-regression.spec.ts not found at ${specFile}`)
  }

  console.log('🔍 Running visual regression...')
  execSync(
    `npx playwright test tests/e2e/visual-regression.spec.ts ${isCi ? '--reporter=html,json' : ''}`,
    {
      stdio: 'inherit',
      cwd: ROOT,
      timeout: 300_000,
    }
  )
}
main()
