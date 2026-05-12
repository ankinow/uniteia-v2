#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const DIST = join(ROOT, 'dist')
const SRC = join(ROOT, 'src')
const CONTENT = join(ROOT, 'content')

const OLD_GITHUB = 'github.com/uniteia/uniteia-v2'
const OLD_TENCENT = 'tencentcloud.com/free'

let failures = 0

function check(label, pass, detail = '') {
  const status = pass ? 'OK' : 'FAIL'
  console.log(`  ${status} ${label}${detail ? ` -- ${detail}` : ''}`)
  if (!pass) failures += 1
}

function readText(path) {
  return readFileSync(path, 'utf-8')
}

function scanTextFiles(dir, matcher, extensions = ['.ts', '.tsx', '.md', '.json', '.mjs']) {
  const hits = []

  function walk(current) {
    if (!existsSync(current)) return
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist')
          continue
        walk(path)
        continue
      }

      if (!extensions.some(ext => entry.name.endsWith(ext))) continue

      const text = readText(path)
      if (matcher(text)) hits.push(path)
    }
  }

  walk(dir)
  return hits
}

console.log('=== PHASE 1: built HTML audit ===')
check('dist exists', existsSync(DIST), DIST)

if (existsSync(DIST)) {
  let checked = 0
  for (const lang of ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh']) {
    const articlePath = join(DIST, lang, 'tencent-cloud-deal-stack-builders', 'index.html')
    if (!existsSync(articlePath)) continue

    checked += 1
    const html = readText(articlePath)
    check(`/${lang}/tencent-cloud-deal-stack-builders: old GitHub`, !html.includes(OLD_GITHUB))
    check(`/${lang}/tencent-cloud-deal-stack-builders: old Tencent`, !html.includes(OLD_TENCENT))
  }
  console.log(`  (scanned ${checked} articles)`)
}

console.log('\n=== PHASE 2: source/content URL audit ===')
const oldGithubHits = scanTextFiles(SRC, text => text.includes(OLD_GITHUB))
const oldTencentSourceHits = scanTextFiles(SRC, text => text.includes(OLD_TENCENT))
const oldTencentContentHits = scanTextFiles(CONTENT, text => text.includes(OLD_TENCENT), ['.md'])

check('Old GitHub URL in src = 0', oldGithubHits.length === 0, oldGithubHits.join(', ') || 'clean')
check(
  'Old Tencent URL in src = 0',
  oldTencentSourceHits.length === 0,
  oldTencentSourceHits.join(', ') || 'clean'
)
check(
  'Old Tencent URL in content = 0',
  oldTencentContentHits.length === 0,
  oldTencentContentHits.join(', ') || 'clean'
)

console.log(`\n=== RESULTS: ${failures === 0 ? 'ALL PASSED' : `${failures} FAILURES`} ===`)
process.exit(failures > 0 ? 1 : 0)
