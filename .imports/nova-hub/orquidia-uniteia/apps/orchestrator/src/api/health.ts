/**
 * Health Check API Routes
 * SOTA 2026: Binding validation and service status
 */

import { quickHealthCheck, runHealthCheck } from '../lib/health-check'

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url)
  const detailed = url.searchParams.get('detailed') === 'true'

  if (detailed) {
    const health = await runHealthCheck()
    return new Response(JSON.stringify(health), {
      status: health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Quick health check for load balancers
  const quick = await quickHealthCheck()
  return new Response(
    JSON.stringify({ status: quick.ok ? 'ok' : 'error', message: quick.message }),
    { status: quick.ok ? 200 : 503, headers: { 'Content-Type': 'application/json' } },
  )
}
