/**
 * CLI: SEO Auditor
 * Standalone entry point that invokes SEOOptimizerAgent from CLI
 *
 * Usage:
 *   bun run src/cli/seo-auditor.ts --niche "fitness" --keywords "treino dieta saude"
 *   bun run src/cli/seo-auditor.ts --help
 */

import { SEOOptimizerAgent } from '../agents/seo-optimizer'
import { type AgentContext, type AgentInput } from '../agents/base'

// ============================================================================
// CLI Argument Parsing
// ============================================================================

interface CLIArgs {
  niche?: string
  keywords: string[]
  help: boolean
  json: boolean
}

function parseArgs(argv: string[]): CLIArgs {
  const args: CLIArgs = {
    keywords: [],
    help: false,
    json: false,
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    switch (arg) {
      case '--help':
      case '-h':
        args.help = true
        break
      case '--json':
        args.json = true
        break
      case '--niche':
        args.niche = argv[++i]
        break
      case '--keywords':
        args.keywords = (argv[++i] || '').split(',').map((k) => k.trim()).filter(Boolean)
        break
    }
  }

  return args
}

function printHelp(): void {
  console.log(`
SEO Auditor CLI - Orquidia Uniteia

Usage:
  bun run src/cli/seo-auditor.ts [options]

Options:
  --niche, -n        Niche/topic for SEO analysis
  --keywords, -k     Comma-separated keywords to audit
  --json             Output as JSON instead of formatted text
  --help, -h         Show this help message

Examples:
  bun run src/cli/seo-auditor.ts --niche "fitness" --keywords "treino,dieta,saude"
  bun run src/cli/seo-auditor.ts -n "crypto" -k "bitcoin,defi,trading" --json
`)
}

// ============================================================================
// Mock Context for CLI
// ============================================================================

function createMockContext(): AgentContext {
  return {
    db: {} as unknown as D1Database,
    auth: { userId: 'cli-user', role: 'admin' } as unknown as AgentContext['auth'],
    sessionId: `cli-seo-${Date.now()}`,
  }
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    printHelp()
    process.exit(0)
  }

  if (!args.niche && args.keywords.length === 0) {
    console.error('Error: Provide at least --niche or --keywords')
    printHelp()
    process.exit(1)
  }

  const input: AgentInput = {
    niche: args.niche,
    keywords: args.keywords,
  }

  const agent = new SEOOptimizerAgent()
  const context = createMockContext()
  await agent.initialize(context)

  console.error(`\n[CLI] Running SEOOptimizerAgent...`)
  console.error(`[CLI] Niche: ${args.niche || '(not set)'}`)
  console.error(`[CLI] Keywords: ${args.keywords.join(', ') || '(none)'}\n`)

  const startTime = Date.now()
  const result = await agent.execute(input)
  const duration = Date.now() - startTime

  if (args.json) {
    console.log(JSON.stringify({
      success: result.success,
      duration,
      data: result.data,
      error: result.error,
    }, null, 2))
  } else if (result.success && result.data) {
    console.log('═'.repeat(60))
    console.log('  SEO AUDIT RESULT')
    console.log('═'.repeat(60))
    console.log(`  Status:   SUCCESS`)
    console.log(`  Duration: ${duration}ms`)
    console.log(`  SEO Score: ${result.data.seoScore}/100`)
    console.log(`  Issues:   ${result.data.improvements.length}`)
    console.log('═'.repeat(60))

    console.log('\n  Improvements Needed:')
    for (const imp of result.data.improvements) {
      const icon = imp.impact === 'high' ? '🔴' : imp.impact === 'medium' ? '🟡' : '🟢'
      console.log(`    ${icon} [${imp.impact.toUpperCase()}] ${imp.type}`)
      console.log(`       ${imp.description}`)
    }

    console.log('\n  Structured Data:')
    console.log(`    Type: ${(result.data.structuredData as Record<string, unknown>)?.['@type'] || 'N/A'}`)
    console.log(`    Headline: ${(result.data.structuredData as Record<string, unknown>)?.headline || 'N/A'}`)
    console.log()
  } else {
    console.error(`\n[CLI] Error: ${result.error || 'Unknown error'}`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(`[CLI] Fatal error: ${err}`)
  process.exit(1)
})
