import { BaseAgent, AgentOutput } from '../base/Agent.js'
import type { WritingInput, WritingOutput } from '../types.js'

/**
 * WritingAgent — generates content drafts from research and templates.
 * Supports configurable tone, target length, and template formats.
 */
export class WritingAgent extends BaseAgent {
  readonly name = 'WritingAgent'
  readonly description = 'Generates content drafts from research data and configurable templates'

  async process(input: unknown): Promise<AgentOutput> {
    return this.run(async () => {
      const { research, template, tone = 'professional', targetLength } = input as WritingInput

      // Generate draft based on template or default structure
      let draft = ''
      if (template) {
        draft = this.applyTemplate(template, research, tone)
      } else {
        draft = this.generateDefaultDraft(research, tone)
      }

      // Truncate to target length
      const wordCount = draft.split(/\s+/).length
      if (targetLength > 0 && wordCount > targetLength) {
        draft = draft.split(/\s+/).slice(0, targetLength).join(' ') + '...'
      }

      const finalWordCount = draft.split(/\s+/).length

      const output: WritingOutput = {
        draft,
        wordCount: finalWordCount,
        tone,
      }

      return output
    })
  }

  private applyTemplate(template: string, research: WritingInput['research'], tone: string): string {
    return template
      .replace('{{tone}}', tone)
      .replace('{{keyFacts}}', research.keyFacts.join(', '))
      .replace('{{sources}}', research.sources.join(', '))
  }

  private generateDefaultDraft(research: WritingInput['research'], tone: string): string {
    const facts = research.keyFacts.map((f, i) => `${i + 1}. ${f}`).join('\n')
    return `Title: Content Draft\n\nTone: ${tone}\n\nKey Findings:\n${facts}\n\nSources: ${research.sources.length} references analyzed.`
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.process({
        research: {
          sources: ['source1'],
          keyFacts: ['fact1'],
          statistics: {},
          trendingTopics: [],
          competitorAnalysis: [],
          visualElements: [],
        },
        targetLength: 500,
      })
      return (result as any).data?.draft !== undefined
    } catch {
      return false
    }
  }
}
