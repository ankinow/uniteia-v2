import { compileContentGraph } from '../src/content-graph'
import { verifyContentGraph } from '../src/content-graph/compiler/verify-content-graph'

async function main() {
  console.log('[content-graph] Verifying content graph...')

  const { contentRegistry } = await import('../src/content-registry.generated')

  const graph = compileContentGraph({
    registry: contentRegistry,
    locales: ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'],
    defaultLocale: 'en',
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

  console.log(`[content-graph] Nodes: ${graph.metadata.totalNodes}`)
  console.log(`[content-graph] Public: ${graph.collections.public.length}`)

  if (report.ok) {
    console.log('[content-graph] Verification PASSED')
  } else {
    console.error(`[content-graph] Verification FAILED with ${report.errors.length} error(s)`)
    process.exit(1)
  }
}

main().catch(err => {
  console.error('[content-graph] Verification script failed:', err)
  process.exit(1)
})
