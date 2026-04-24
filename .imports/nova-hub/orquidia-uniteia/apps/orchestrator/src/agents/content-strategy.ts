/**
 * Content Strategy Agent - SOTA 2026
 * Define estratégia de conteúdo baseada em nichos e tendências
 */

import {
  type AgentInput,
  type AgentResult,
  BaseAgent,
  type ContentPlanItem,
  type ContentStrategyResult,
  type NicheInsight,
} from './base'

export class ContentStrategyAgent extends BaseAgent {
  name = 'ContentStrategyAgent'

  async execute(input: AgentInput): Promise<AgentResult<ContentStrategyResult>> {
    const startTime = Date.now()

    try {
      const insights = input.keywords || []
      const strategy = this.generateStrategy(insights)
      const contentPlan = this.generateContentPlan(input.niche || 'general', insights)
      const targetKeywords = this.selectTargetKeywords(insights)
      const competitors = this.identifyCompetitors(input.niche || 'general')

      await this.log('strategy_defined', {
        strategy,
        planItems: contentPlan.length,
        keywords: targetKeywords.length,
      })

      return {
        success: true,
        data: {
          strategy,
          contentPlan,
          targetKeywords,
          competitors,
        },
        metadata: {
          agent: this.name,
          duration: Date.now() - startTime,
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      await this.log('error', { error: errorMessage })

      return {
        success: false,
        error: errorMessage,
        metadata: {
          agent: this.name,
          duration: Date.now() - startTime,
        },
      }
    }
  }

  private generateStrategy(keywords: string[]): string {
    const strategies = [
      'Autoridade Técnica - Profundidade sobre tendências',
      'Comparativo Prático - Análise objetiva de opções',
      'Guia Completo - Do iniciante ao avançado',
      'Resolução de Problemas - Foco em dúvidas avançadas',
      'Análise de Tendências - Futuro do mercado',
    ]

    // Seleciona estratégia baseada em palavras-chave
    const hasComparison = keywords.some((k) => k.includes('comparação') || k.includes('x'))
    const hasProblem = keywords.some((k) => k.includes('problema') || k.includes('solução'))
    const hasTrend = keywords.some((k) => k.includes('tendência') || k.includes('2026'))

    if (hasComparison) return strategies[1]
    if (hasProblem) return strategies[3]
    if (hasTrend) return strategies[4]

    return strategies[0]
  }

  private generateContentPlan(niche: string, keywords: string[]): ContentPlanItem[] {
    const templates = [
      'insights-first',
      'comparison-matrix',
      'storytelling',
      'horizontal-scroll',
      'minimalist',
    ]

    const plan: ContentPlanItem[] = [
      {
        title: `Guia Completo: ${niche} em 2026`,
        template: 'insights-first',
        keywords: [...keywords, 'guia', '2026'],
        priority: 1,
      },
      {
        title: `Comparativo: ${niche} - Qual escolher?`,
        template: 'comparison-matrix',
        keywords: [...keywords, 'comparação', 'qual'],
        priority: 2,
      },
      {
        title: `Review: ${niche} na prática`,
        template: 'storytelling',
        keywords: [...keywords, 'review', 'teste'],
        priority: 3,
      },
      {
        title: `Top ${niche}: Os melhores do mercado`,
        template: 'horizontal-scroll',
        keywords: [...keywords, 'top', 'melhores'],
        priority: 4,
      },
      {
        title: `${niche}: Análise técnica detalhada`,
        template: 'minimalist',
        keywords: [...keywords, 'técnico', 'análise'],
        priority: 5,
      },
    ]

    return plan
  }

  private selectTargetKeywords(keywords: string[]): string[] {
    const priorityKeywords = [
      'como escolher',
      'qual o melhor',
      'problemas e soluções',
      'comparativo',
      'guia completo',
      'review',
      'dicas',
      'tendências',
      '2026',
    ]

    const combined = [...keywords, ...priorityKeywords]
    return [...new Set(combined)].slice(0, 15)
  }

  private identifyCompetitors(niche: string): string[] {
    return [
      `sites de review sobre ${niche}`,
      `blogs especializados em ${niche}`,
      `comparadores de ${niche}`,
      `fóruns de discussão sobre ${niche}`,
      `canais no YouTube sobre ${niche}`,
    ]
  }
}
