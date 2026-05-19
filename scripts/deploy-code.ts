#!/usr/bin/env bun

import { execSync } from 'node:child_process'

function run(label: string, command: string): void {
  console.log(`\n▶ ${label}`)
  console.log(`  $ ${command}`)
  execSync(command, { stdio: 'inherit', cwd: import.meta.dirname + '/..' })
}

function main(): void {
  console.log('='.repeat(60))
  console.log('DEPLOY:CODE — ship:check + wrangler deploy')
  console.log('='.repeat(60))

  run('ship:check (lint → typecheck → test → build → e2e → ...)', 'bun run ship:check')
  run('deploy to Cloudflare Pages', 'bunx wrangler pages deploy dist --project-name=uniteia-v2')

  console.log('\n✅ Deploy:CODE complete.')
}

main()
