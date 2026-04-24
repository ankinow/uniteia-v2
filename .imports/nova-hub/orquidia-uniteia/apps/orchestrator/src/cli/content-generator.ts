/**
 * CLI: Content Generator
 * Standalone entry point that invokes ContentGeneratorAgent from CLI
 *
 * Usage:
 *   bun run src/cli/content-generator.ts --niche "fitness" --keywords "treino dieta saude"
 *   bun run src/cli/content-generator.ts --help
 */

import { ContentGeneratorAgent } from '../agents/content-generator'
import { type AgentContext, type AgentInput } from '../agents/base'

// ============================================================================
// CLI Argument Parsing
// ============================================================================

interface CLIArgs {
  niche?: string
  category?: string
  keywords: string[]
  tone?: 'professional' | 'casual' | 'enthusiastic' | 'informative'
  maxPages?: number
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
      case '--category':
        args.category = argv[++i]
        break
      case '--keywords':
        args.keywords = (argv[++i] || '').split(',').map((k) => k.trim()).filter(Boolean)
        break
      case '--tone':
        args.tone = argv[++i] as CLIArgs['tone']
        break
      case '--max-pages':
        args.maxPages = parseInt(argv[++i] || '7', 10)
        break
    }
  }

  return args
}

function printHelp(): void {
  console.log(`
Content Generator CLI - Orquidia Uniteia

Usage:
  bun run src/cli/content-generator.ts [options]

Options:
  --niche, -n        Niche/topic for content generation
  --category, -c     Category classification
  --keywords, -k     Comma-separated keywords
  --tone, -t         Content tone: professional | casual | enthusiastic | informative
                     (default: professional)
  --max-pages, -m    Number of pages/products to generate (default: 7)
  --json             Output as JSON instead of formatted text
  --help, -h         Show this help message

Examples:
  bun run src/cli/content-generator.ts --niche "fitness" --keywords "treino,dieta,saude"
  bun run src/cli/content-generator.ts -n "crypto" -k "bitcoin,defi" -t enthusiastic --json
`)
}

// ============================================================================
// Mock Context for CLI (no Cloudflare Workers needed)
// ============================================================================

function createMockContext(): AgentContext {
  const auditLog: Array<{ action: string; details: Record<string, unknown> }> = []

  return {
    db: {} as unknown as D1Database, // Mock — agent doesn't hit DB in content generation
    auth: { userId: 'cli-user', role: 'admin' } as unknown as AgentContext['auth'],
    sessionId: `cli-${Date.now()}`,
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
    category: args.category,
    keywords: args.keywords,
    tone: args.tone || 'professional',
    maxPages: args.maxPages || 7,
  }

  const agent = new ContentGeneratorAgent()
  const context = createMockContext()
  await agent.initialize(context)

  console.error(`\n[CLI] Running ContentGeneratorAgent...`)
  console.error(`[CLI] Niche: ${args.niche || '(not set)'}`)
  console.error(`[CLI] Keywords: ${args.keywords.join(', ') || '(none)'}`)
  console.error(`[CLI] Tone: ${args.tone || 'professional'}`)
  console.error(`[CLI] Max Pages: ${args.maxPages || 7}\n`)

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
    console.log('  CONTENT GENERATION RESULT')
    console.log('═'.repeat(60))
    console.log(`  Status:   SUCCESS`)
    console.log(`  Duration: ${duration}ms`)
    console.log(`  Pages:    ${result.data.pages?.length || 0}`)
    console.log(`  Tokens:   ~${result.data.totalTokens}`)
    console.log('═'.repeat(60))

    for (const page of result.data.pages || []) {
      console.log(`\n  ┌─ Page: ${page.title}`)
      console.log(`  │  Slug: ${page.slug}`)
      console.log(`  │  Meta: ${page.metaDescription}`)
      console.log(`  │  Keywords: ${page.keywords.join(', ')}`)
      console.log(`  │`)
      console.log(`  │  Content Preview:`)
      console.log(`  │  ${page.content.substring(0, 300)}...`)
      console.log(`  └─`)
    }
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
