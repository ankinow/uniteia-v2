#!/usr/bin/env bun
/**
 * Invalid Locale Check
 * Verifies that invalid locales return 404 Not Found
 */
const BASE_URL = 'http://localhost:8788'
const INVALID_LOCALES = ['/xx', '/yy', '/zz']

async function main() {
  const customBaseUrl = process.argv[2]
  const baseUrl = customBaseUrl || BASE_URL

  console.log(`▶ [ship-check] locale:404: Verifying invalid locale handling at ${baseUrl}\n`)

  let allPassed = true
  for (const locale of INVALID_LOCALES) {
    const url = `${baseUrl}${locale}`
    try {
      const response = await fetch(url, { redirect: 'follow' })
      if (response.status === 404) {
        console.log(`✅ ${locale} → 404 OK`)
      } else {
        console.error(`❌ ${locale} → ${response.status} (expected 404)`)
        allPassed = false
      }
    } catch (err) {
      console.error(`❌ ${locale} → Fetch error: ${err}`)
      allPassed = false
    }
  }

  console.log('')
  if (allPassed) {
    console.log('✅ locale:404 check passed')
    process.exit(0)
  } else {
    console.error('❌ locale:404 check failed')
    process.exit(1)
  }
}

await main()
