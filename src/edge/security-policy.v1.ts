/**
 * Security Policy v1
 *
 * Declarative security headers — single source of truth.
 * Applied by edge middleware (functions/[[route]].ts) and Cloudflare Pages (_headers).
 *
 * Contract version: v1 (2026-05-20)
 */

export interface SecurityHeader {
  name: string
  value: string
}

export const SECURITY_HEADERS: SecurityHeader[] = [
  {
    name: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    name: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    name: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    name: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    name: 'Permissions-Policy',
    value:
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  },
  {
    name: 'Content-Security-Policy',
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; worker-src 'self'",
  },
]

/**
 * Apply all security headers to a Response or Headers object.
 * Idempotent — safe to call multiple times.
 */
export function applySecurityHeaders(target: Response | Headers): void {
  const headers = target instanceof Response ? target.headers : target
  for (const { name, value } of SECURITY_HEADERS) {
    headers.set(name, value)
  }
}

/**
 * Generate _headers file content for Cloudflare Pages static deployment.
 * Used by build scripts to keep _headers in sync with the policy.
 */
export function generateHeadersFileContent(): string {
  const headerLines = SECURITY_HEADERS.map(({ name, value }) => `  ${name}: ${value}`).join('\n')
  return `/*\n${headerLines}\n  Cache-Control: public, max-age=60, stale-while-revalidate=300\n\n/sitemap.xml\n  Cache-Control: public, max-age=0, must-revalidate, s-maxage=3600\n\n/robots.txt\n  Cache-Control: public, max-age=0, must-revalidate, s-maxage=3600\n\n/build/*\n  Cache-Control: public, max-age=31536000, immutable\n`
}
