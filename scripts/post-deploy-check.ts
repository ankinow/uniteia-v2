import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const DEPLOY_URL = 'https://uniteia-v2.pages.dev'

async function checkUrl(url: string) {
  console.log(`Checking ${url}...`)
  try {
    const headers = execSync(`curl -ILs ${url}`).toString()
    const csp = headers.match(/Content-Security-Policy: (.*)/i)?.[1]
    const hsts = headers.match(/Strict-Transport-Security: (.*)/i)?.[1]

    console.log(`CSP: ${csp ? '✅ Found' : '❌ Missing'}`)
    if (csp) console.log(`     ${csp}`)
    console.log(`HSTS: ${hsts ? '✅ Found' : '❌ Missing'}`)

    if (csp?.includes('unsafe-eval')) {
      console.log('⚠️ Warning: CSP still contains unsafe-eval')
    } else {
      console.log('✅ CSP is hardened (no unsafe-eval)')
    }
  } catch (_e) {
    console.error(`Failed to check ${url}`)
  }
}

async function runLighthouse(url: string) {
  console.log(`Running Lighthouse on ${url}...`)
  try {
    // Note: this requires lighthouse installed globally or available via bunx
    execSync(
      `bunx lighthouse ${url} --output json --output-path ./report.json --chrome-flags="--headless"`,
      { stdio: 'inherit' }
    )
    const report = JSON.parse(readFileSync('./report.json', 'utf-8'))
    console.log(`Performance: ${report.categories.performance.score * 100}`)
    console.log(`Accessibility: ${report.categories.accessibility.score * 100}`)
    console.log(`Best Practices: ${report.categories['best-practices'].score * 100}`)
    console.log(`SEO: ${report.categories.seo.score * 100}`)
  } catch (_e) {
    console.error('Lighthouse failed')
  }
}

async function main() {
  await checkUrl(`${DEPLOY_URL}/en/signals/`)
  await runLighthouse(`${DEPLOY_URL}/en/signals/`)
}

main()
