import { BaseAgent, AgentOutput } from '../base/Agent.js'
import type { LearningInput, LearningOutput } from '../types.js'

/**
 * LearningAgent — extracts patterns from interactions and feedback.
 * Improves future content generation by tracking what works.
 */
export class LearningAgent extends BaseAgent {
  readonly name = 'LearningAgent'
  readonly description = 'Extracts patterns from interactions to improve future content generation'

  async process(input: unknown): Promise<AgentOutput> {
    return this.run(async () => {
      const { interaction, feedback: fb, context } = input as LearningInput

      const patternsLearned: string[] = []

      if (fb?.includes('bom') || fb?.includes('good')) {
        patternsLearned.push('Positive reception detected — reinforce current approach')
      }
      if (fb?.includes('ruim') || fb?.includes('bad') || fb?.includes('error')) {
        patternsLearned.push('Negative feedback detected — review and adjust approach')
      }
      if (context?.tone) {
        patternsLearned.push(`Tone "${context.tone}" used in interaction`)
      }
      if (context?.topic) {
        patternsLearned.push(`Topic "${context.topic}" was the focus`)
      }
      if (patternsLearned.length === 0) {
        patternsLearned.push('No clear pattern detected — more data needed')
      }

      const confidence = Math.min(1, patternsLearned.length * 0.25)

      const output: LearningOutput = {
        patternsLearned,
        confidence,
        nextAction: confidence > 0.5 ? 'Apply learned patterns to next content' : 'Collect more feedback',
      }

      return output
    })
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.process({
        interaction: 'ping',
        feedback: 'test feedback',
      })
      return ((result as any).data?.patternsLearned?.length ?? 0) > 0
    } catch {
      return false
    }
  }
}
