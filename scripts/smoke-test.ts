#!/usr/bin/env bun
/**
 * Smoke Test - Verifies key routes return 200 OK
 */
const DEV_SERVER_URL = 'http://localhost:5173'
const TIMEOUT_MS = 30000

const KEY_ROUTES = [
  { url: '/', name: 'root' },
  { url: '/en', name: 'en-landing' },
  { url: '/en/n', name: 'en-niche' },
  { url: '/pt', name: 'pt-landing' },
  { url: '/es', name: 'es-landing' },
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
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

async function checkRoute(route: { url: string; name: string }): Promise<CheckResult> {
  const start = Date.now()
  const fullUrl = `${DEV_SERVER_URL}${route.url}`
  try {
    const response = await fetchWithTimeout(fullUrl, TIMEOUT_MS)
    return { name: route.name, url: fullUrl, expectedStatus: 200, actualStatus: response.status, passed: response.status === 200, durationMs: Date.now() - start }
  } catch (error) {
    return { name: route.name, url: fullUrl, expectedStatus: 200, actualStatus: 0, passed: false, durationMs: Date.now() - start }
  }
}

async function main(): Promise<void> {
  console.log('▶ [ship-check] smoke:200s: Testing key routes\n')
  const checks: CheckResult[] = []
  for (const route of KEY_ROUTES) {
    const result = await checkRoute(route)
    checks.push(result)
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}: ${result.url} → ${result.actualStatus} (${result.durationMs}ms)`)
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
