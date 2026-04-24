import { BaseAgent, AgentOutput } from '../base/Agent.js'
import type { SeoInput, SeoOutput } from '../types.js'

/**
 * SeoAgent — analyzes content for SEO optimization.
 * Checks meta tags, keyword density, readability, and technical SEO factors.
 */
export class SeoAgent extends BaseAgent {
  readonly name = 'SeoAgent'
  readonly description = 'Analyzes content for SEO optimization and provides actionable suggestions'

  async process(input: unknown): Promise<AgentOutput> {
    return this.run(async () => {
      const { content, targetKeywords = [], locale = 'pt-BR' } = input as SeoInput

      const titleTag = content.substring(0, 60)
      const metaDescription = content.substring(0, 155)
      const wordCount = content.split(/\s+/).length

      const keywordDensity: Record<string, number> = {}
      for (const kw of targetKeywords) {
        const regex = new RegExp(kw, 'gi')
        const matches = content.match(regex)?.length ?? 0
        keywordDensity[kw] = wordCount > 0 ? (matches / wordCount) * 100 : 0
      }

      const suggestions: string[] = []
      const issues: string[] = []

      if (titleTag.length > 60) issues.push('Title tag excede 60 caracteres')
      if (metaDescription.length > 155) issues.push('Meta description excede 155 caracteres')
      if (wordCount < 300) issues.push('Conteúdo muito curto (mínimo recomendado: 300 palavras)')
      if (Object.keys(keywordDensity).length === 0) suggestions.push('Adicione palavras-chave alvo para análise de densidade')
      for (const [kw, density] of Object.entries(keywordDensity)) {
        if (density > 3) issues.push(`Densidade da keyword "${kw}" muito alta: ${density.toFixed(1)}%`)
        if (density < 0.5 && density > 0) suggestions.push(`Densidade da keyword "${kw}" baixa: ${density.toFixed(1)}%`)
      }

      const score = Math.max(0, 100 - issues.length * 15 - suggestions.length * 5)

      const output: SeoOutput = {
        score,
        titleTag,
        metaDescription,
        keywordDensity,
        suggestions: suggestions.length ? suggestions : ['Conteúdo bem otimizado'],
        issues,
      }

      return output
    })
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.process({ content: 'ping test content', targetKeywords: ['test'] })
      return (result as any).data?.score !== undefined
    } catch {
      return false
    }
  }
}
