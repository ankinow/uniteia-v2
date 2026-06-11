import { compileContentGraph } from '../src/content-graph'
import { verifyContentGraph } from '../src/content-graph/compiler/verify-content-graph'

async function main() {
  const buildLocale = process.env.LOCALE || 'en'
  console.log(`[content-graph] Verifying content graph for locale: ${buildLocale}...`)

  const { contentRegistry } = await import('../src/content-registry.generated')

  // Filter registry to only include entries for the build locale
  const filteredRegistry: Record<string, string> = {}
  let totalEntries = 0
  for (const [key, value] of Object.entries(contentRegistry)) {
    totalEntries++
    const localeMatch = key.match(/\/content\/apex\/([a-z]{2})\//)
    if (localeMatch && localeMatch[1] === buildLocale) {
      filteredRegistry[key] = value
    }
  }
  console.log(
    `[content-graph] Filtered registry: ${Object.keys(filteredRegistry).length} entries (from ${totalEntries})`
  )

  const graph = compileContentGraph({
    registry: filteredRegistry,
    locales: [buildLocale],
    defaultLocale: buildLocale,
  })

  const report = verifyContentGraph(graph)

  if (report.errors.length > 0) {
    console.log('[content-graph] Verification FAILED')
    for (const issue of report.errors) {
      console.log(
        `  error ${issue.code}${issue.nodeId ? ` [${issue.nodeId}]` : ''}: ${issue.message}`
      )
    }
  }

  if (report.warnings.length > 0) {
    console.log(`[content-graph] Warnings: ${report.warnings.length}`)
    for (const issue of report.warnings) {
      console.log(
        `  warning ${issue.code}${issue.nodeId ? ` [${issue.nodeId}]` : ''}: ${issue.message}`
      )
    }
  }

  console.log(`[content-graph] Nodes: ${graph.nodes.length}`)
  const publicCount = graph.nodes.filter(n => n.visibility === 'published').length
  console.log(`[content-graph] Public: ${publicCount}`)

  if (report.ok) {
    console.log('[content-graph] Verification PASSED')
  } else {
    console.error(`[content-graph] Verification FAILED with ${report.errors.length} error(s)`)
    process.exit(1)
  }
}

main().catch(err => {
  console.error('[content-graph] Verification failed:', err)
  process.exit(1)
})
