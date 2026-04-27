#!/usr/bin/env bun
/**
 * Invalid Locale 404 Verification
 * Tests that invalid locale URLs return 404 and valid locales return 200
 */

const DEV_SERVER_URL = 'http://localhost:5173'
const TIMEOUT_MS = 30000

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

async function checkStatus(url: string, expectedStatus: number): Promise<CheckResult> {
  const start = Date.now()

  try {
    const response = await fetchWithTimeout(url, TIMEOUT_MS)
    const duration = Date.now() - start

    return {
      name: expectedStatus === 404 ? 'invalid-locale-404' : 'valid-locale-200',
      url,
      expectedStatus,
      actualStatus: response.status,
      passed: response.status === expectedStatus,
      durationMs: duration,
    }
  } catch (error) {
    const duration = Date.now() - start
    const errorCode = error instanceof Error && error.name === 'AbortError' ? 0 : -1

    return {
      name: expectedStatus === 404 ? 'invalid-locale-404' : 'valid-locale-200',
      url,
      expectedStatus,
      actualStatus: errorCode,
      passed: false,
      durationMs: duration,
    }
  }
}

async function main(): Promise<void> {
  console.log('▶ [ship-check] invalid-locale-404: Verifying locale-based 404 behavior\n')

  const checks: CheckResult[] = []

  // Test invalid locale returns 404
  const invalidCheck = await checkStatus(`${DEV_SERVER_URL}/xx/test`, 404)
  checks.push(invalidCheck)

  // Test valid locale returns 200
  const validCheck = await checkStatus(`${DEV_SERVER_URL}/en/test`, 200)
  checks.push(validCheck)

  // Report results
  for (const check of checks) {
    const status = check.passed ? '✅' : '❌'
    console.log(
      `${status} ${check.name}: ${check.url} expected ${check.expectedStatus}, got ${check.actualStatus} (${check.durationMs}ms)`
    )
  }

  console.log('')

  const allPassed = checks.every(c => c.passed)

  if (allPassed) {
    console.log('✅ invalid-locale-404 check passed')
    process.exit(0)
  } else {
    const failed = checks.filter(c => !c.passed)
    console.error(`❌ invalid-locale-404 check failed: ${failed.length} test(s) failed`)
    process.exit(1)
  }
}

await main()
