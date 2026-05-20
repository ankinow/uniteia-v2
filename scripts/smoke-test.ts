#!/usr/bin/env bun
/**
 * Smoke Test - Verifies key routes return 200 OK
 */
const DEV_SERVER_URL = 'http://localhost:8788'
const TIMEOUT_MS = 30000

const KEY_ROUTES = [
  { url: '/', name: 'root' },
  { url: '/en/signals/', name: 'en-signals-index' },
  { url: '/pt/signals/', name: 'pt-signals-index' },
  { url: '/es/signals/', name: 'es-signals-index' },
  { url: '/en/signals/ai-agents/', name: 'en-niche-landing' },
]

interface CheckResult {
  name: string
  url: string
  expectedStatus: number
  actualStatus: number
  passed: boolean
  durationMs: number
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: 'follow' })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

async function main(): Promise<void> {
  const customBaseUrl = process.argv[2]
  const baseUrl = customBaseUrl || DEV_SERVER_URL

  console.log(`▶ [ship-check] smoke:200s: Testing key routes at ${baseUrl}\n`)
  const checks: CheckResult[] = []
  for (const route of KEY_ROUTES) {
    const fullUrl = `${baseUrl}${route.url}`
    const start = Date.now()
    try {
      const response = await fetchWithTimeout(fullUrl, TIMEOUT_MS)
      const result = {
        name: route.name,
        url: fullUrl,
        expectedStatus: 200,
        actualStatus: response.status,
        passed: response.status === 200,
        durationMs: Date.now() - start,
      }
      checks.push(result)
      console.log(
        `${result.passed ? '✅' : '❌'} ${result.name}: ${result.url} → ${result.actualStatus} (${result.durationMs}ms)`
      )
    } catch (_error) {
      const result = {
        name: route.name,
        url: fullUrl,
        expectedStatus: 200,
        actualStatus: 0,
        passed: false,
        durationMs: Date.now() - start,
      }
      checks.push(result)
      console.log(
        `${result.passed ? '✅' : '❌'} ${result.name}: ${result.url} → FAIL (${result.durationMs}ms)`
      )
    }
  }
  console.log('')
  const allPassed = checks.every(c => c.passed)
  if (allPassed) {
    console.log(`✅ smoke:200s check passed (${checks.length} routes)`)
    process.exit(0)
  } else {
    console.error(`❌ smoke:200s check failed: ${checks.filter(c => !c.passed).length} route(s)`)
    process.exit(1)
  }
}

await main()
