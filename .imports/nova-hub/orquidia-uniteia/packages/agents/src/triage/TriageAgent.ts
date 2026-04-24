import { BaseAgent, AgentOutput } from '../base/Agent.js'
import type { TriageInput, TriageOutput } from '../types.js'

/**
 * TriageAgent — prioritizes content items and assigns them to agents.
 * Analyzes urgency, complexity, and resource requirements.
 */
export class TriageAgent extends BaseAgent {
  readonly name = 'TriageAgent'
  readonly description = 'Prioritizes content items and assigns them to appropriate agents'

  async process(input: unknown): Promise<AgentOutput> {
    return this.run(async () => {
      const { content, priority } = input as TriageInput

      const title = typeof content === 'string' ? content : content.title
      const wordCount = title.split(/\s+/).length

      // Priority determination
      let determinedPriority: 'low' | 'medium' | 'high' = priority ?? 'medium'
      if (wordCount > 50 || (typeof content !== 'string' && content.tags.length > 5)) {
        determinedPriority = 'high'
      }

      // Agent assignment based on priority
      const assignedAgents =
        determinedPriority === 'high'
          ? ['ResearchAgent', 'WritingAgent', 'SeoAgent', 'ValidationAgent']
          : determinedPriority === 'medium'
            ? ['WritingAgent', 'SeoAgent']
            : ['WritingAgent']

      const output: TriageOutput = {
        priority: determinedPriority,
        assignedAgents,
        reason: `Assigned based on content length (${wordCount} words) and tags`,
      }

      return output
    })
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.process({ content: 'ping' })
      return (result as any).data?.priority !== undefined
    } catch {
      return false
    }
  }
}
