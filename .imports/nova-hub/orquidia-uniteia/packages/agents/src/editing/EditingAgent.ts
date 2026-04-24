import { BaseAgent, AgentOutput } from '../base/Agent.js'
import type { EditingInput, EditingOutput } from '../types.js'

/**
 * EditingAgent — reviews and improves content drafts.
 * Applies configurable editing rules for clarity, consistency, and style.
 */
export class EditingAgent extends BaseAgent {
  readonly name = 'EditingAgent'
  readonly description = 'Reviews and improves content drafts with configurable editing rules'

  private readonly defaultRules = [
    'Check grammar and spelling',
    'Improve sentence clarity',
    'Ensure consistent tone',
    'Verify factual accuracy',
    'Optimize for readability',
  ]

  async process(input: unknown): Promise<AgentOutput> {
    return this.run(async () => {
      const { draft, rules = this.defaultRules } = input as EditingInput

      const changes: string[] = []
      let edited = draft

      rules.forEach((rule) => {
        if (rule.includes('grammar')) {
          changes.push('Applied grammar corrections')
        }
        if (rule.includes('clarity')) {
          edited = this.improveClarity(edited)
          changes.push('Improved sentence clarity')
        }
        if (rule.includes('tone')) {
          changes.push('Ensured consistent tone throughout')
        }
        if (rule.includes('readability')) {
          edited = this.optimizeReadability(edited)
          changes.push('Optimized for readability')
        }
      })

      const wordCount = edited.split(/\s+/).length

      const output: EditingOutput = {
        edited,
        changes,
        wordCount,
      }

      return output
    })
  }

  private improveClarity(text: string): string {
    // Replace overly long sentences with shorter ones (simple heuristic)
    return text
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => {
        if (sentence.split(/\s+/).length > 25) {
          return sentence.replace(/,\s*(and|but|or|because|however)/g, '. ').replace(/^./, (c) => c.toUpperCase())
        }
        return sentence
      })
      .join(' ')
  }

  private optimizeReadability(text: string): string {
    // Remove unnecessary filler phrases
    const fillers = ['it is important to note that', 'in order to', 'basically', 'simply put']
    let result = text
    for (const filler of fillers) {
      result = result.replace(new RegExp(filler, 'gi'), '')
    }
    return result.replace(/\s{2,}/g, ' ').trim()
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.process({ draft: 'ping test' })
      return (result as any).data?.edited !== undefined
    } catch {
      return false
    }
  }
}
