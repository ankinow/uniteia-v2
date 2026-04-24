import { OrchestratorAgent, type OrchestratorConfig } from './orchestrator.js'
import { AGENT_ROLES } from './roles'

export class TeamOrchestrator {
  private config: OrchestratorConfig
  private scout: OrchestratorAgent
  private analyst: OrchestratorAgent
  private curator: OrchestratorAgent
  private sentinel: OrchestratorAgent

  constructor(config: OrchestratorConfig) {
    this.config = config
    this.scout = new OrchestratorAgent(config)
    this.analyst = new OrchestratorAgent(config)
    this.curator = new OrchestratorAgent(config)
    this.sentinel = new OrchestratorAgent(config)
  }

  initialize() {
    this.scout.initialize()
    this.analyst.initialize()
    this.curator.initialize()
    this.sentinel.initialize()
  }

  async generateAggregateContent(inputs: { url: string; rawData?: unknown }[]) {
    console.log(`[TEAM] Starting aggregation for ${inputs.length} products`)

    // 1. Scout processes raw data or provides context
    const productsContext = await Promise.all(
      inputs.map(async (input) => {
        const result = await this.scout.process(
          `Extract technical summary for this product: ${JSON.stringify(input.rawData || input.url)}`,
          { additionalContext: AGENT_ROLES.SCOUT.systemPrompt, skipHistory: true },
        )
        return result.content
      }),
    )

    // 2. Analyst evaluates the collection
    const analysis = await this.analyst.process(
      `Evaluate these products technically: \n${productsContext.join('\n---\n')}`,
      { additionalContext: AGENT_ROLES.ANALYST.systemPrompt, skipHistory: true },
    )

    // 3. Curator writes the honest guide
    const content = await this.curator.process(
      `Write an honest guide for these products based on this analysis: \n${analysis.content}`,
      { additionalContext: AGENT_ROLES.CURATOR.systemPrompt, skipHistory: true },
    )

    // 4. Sentinel audits everything
    const finalAudit = await this.sentinel.process(
      `Audit this content for honesty and compliance: \n${content.content}`,
      { additionalContext: AGENT_ROLES.SENTINEL.systemPrompt, skipHistory: true },
    )

    return {
      finalContent: finalAudit.content,
      analysis: analysis.content,
      metadata: {
        productsCount: inputs.length,
        agentsUsed: ['scout', 'analyst', 'curator', 'sentinel'],
        timestamp: Date.now(),
      },
    }
  }
}
