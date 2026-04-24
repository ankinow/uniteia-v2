import { BaseAgent, AgentOutput } from '../base/Agent.js'
import type { FeedbackInput, FeedbackOutput } from '../types.js'

/**
 * FeedbackAgent — analyzes content performance and user feedback.
 * Generates summary reports with action items for improvement.
 */
export class FeedbackAgent extends BaseAgent {
  readonly name = 'FeedbackAgent'
  readonly description = 'Analyzes content performance and user feedback to generate improvement reports'

  async process(input: unknown): Promise<AgentOutput> {
    return this.run(async () => {
      const { content, userFeedback, metrics } = input as FeedbackInput

      const actionItems: string[] = []
      let score = 50

      if (userFeedback) {
        if (userFeedback.length > 20) {
          score += 15
          actionItems.push('Detailed feedback received — review for patterns')
        }
        if (userFeedback.includes('excelente') || userFeedback.includes('great')) {
          score += 20
          actionItems.push('Maintain current quality standards')
        }
      }

      if (metrics) {
        const { views = 0, engagement = 0, shares = 0 } = metrics
        if (views > 1000) score += 5
        if (engagement > 0.05) {
          score += 10
          actionItems.push('High engagement rate detected — analyze what worked')
        }
        if (shares > 10) {
          score += 10
          actionItems.push('Content is being shared — consider similar topics')
        }
        if (engagement < 0.01 && views > 100) {
          actionItems.push('Low engagement despite views — review content relevance')
        }
      }

      score = Math.min(100, Math.max(0, score))

      const summary = `Feedback analysis complete — Score: ${score}/100. ${actionItems.length} action items identified.`

      const output: FeedbackOutput = {
        summary,
        score,
        actionItems: actionItems.length ? actionItems : ['No specific action items — continue monitoring'],
      }

      return output
    })
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.process({
        content: 'ping',
        metrics: { views: 100, engagement: 0.05, shares: 5 },
      })
      return (result as any).data?.score !== undefined
    } catch {
      return false
    }
  }
}
