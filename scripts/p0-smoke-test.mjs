#!/usr/bin/env node
/**
 * P0 smoke test — verifies built static site and source code
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const DIST = '/root/projects/uniteia-multirepo/uniteia-v2/dist'
const SRC = '/root/projects/uniteia-multirepo/uniteia-v2/src'
let failures = 0

function check(label, pass, detail) {
  const status = pass ? 'OK' : 'FAIL'
  console.log('  ' + status + ' ' + label + (detail ? ' -- ' + detail : ''))
  if (!pass) failures++
}

// Phase 1: Article HTML audit
console.log('\n=== PHASE 1: Article HTML URL audit ===')
let checked = 0
for (const lang of ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh']) {
  const langDir = join(DIST, lang)
  if (!existsSync(langDir)) continue
  for (const article of readdirSync(langDir).filter(f => existsSync(join(langDir, f, 'index.html')))) {
    checked++
    const html = readFileSync(join(langDir, article, 'index.html'), 'utf-8')
    if (html.includes('github.com/uniteia/uniteia-v2'))
      check('/' + lang + '/' + article + ': old GitHub', false)
    if (html.includes('tencentcloud.com/free'))
      check('/' + lang + '/' + article + ': old Tencent', false)
  }
}
console.log('  (scanned ' + checked + ' articles)')

// Phase 2: Source code audit
console.log('\n=== PHASE 2: Source code audit ===')

// Redirect route
const rp = join(SRC, 'routes', '[lang]', 'index.tsx')
check('Redirect route exists', existsSync(rp))
if (existsSync(rp)) {
  const c = readFileSync(rp, 'utf-8')
  check('Uses buildNicheLocaleRedirectPath', c.includes('buildNicheLocaleRedirectPath'))
  check('Uses event.redirect', c.includes('redirect'))
}

// Footer
const fp = join(SRC, 'components', 'footer', 'index.tsx')
check('Footer exists', existsSync(fp))
if (existsSync(fp)) {
  const c = readFileSync(fp, 'utf-8')
  check('Footer: ankinow URL', c.includes('github.com/ankinow/uniteia-v2'))
  check('Footer: no old URL', !c.includes('github.com/uniteia/uniteia-v2'))
}

// Lang-switcher
const lp = join(SRC, 'components', 'lang-switcher', 'compact.tsx')
check('Lang-switcher exists', existsSync(lp))
if (existsSync(lp)) {
  const c = readFileSync(lp, 'utf-8')
  check('Switcher: links to /{code}/n', c.includes('/${langInfo.code}/n'))
  check('Switcher: no bare /{code}', !c.includes('href={`/${langInfo.code}`}'))
}

// Phase 3: URL grep audit  
console.log('\n=== PHASE 3: URL grep audit ===')
for (const [label, pattern, dirs] of [
  ['Old GitHub URL in src/', 'github.com/uniteia/uniteia-v2', SRC + ' --include=*.ts --include=*.tsx'],
  ['Old Tencent URL in src/', 'tencentcloud.com/free', SRC + ' --include=*.ts --include=*.tsx'],
]) {
  const out = execSync('grep -rn "' + pattern.replace(/"/g,'\\"') + '" ' + dirs + ' 2>/dev/null || true', { encoding: 'utf-8', maxBuffer: 102400 })
  check(label + '= 0', out.trim() === '', out.trim() || 'clean')
}

// Summary
console.log('\n=== RESULTS: ' + (failures === 0 ? 'ALL PASSED' : failures + ' FAILURES') + ' ===')
process.exit(failures > 0 ? 1 : 0)
