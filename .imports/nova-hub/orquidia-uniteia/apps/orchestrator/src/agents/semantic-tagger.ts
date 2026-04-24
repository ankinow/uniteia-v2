/**
 * Semantic Tagger Agent - SOTA 2026
 * Sistema de tags semânticos para SEO bleeding-edge
 *
 * Gera:
 * - Primary Tags (H1, H2)
 * - Secondary Tags (H3, H4)
 * - Long-tail Keywords
 * - Schema.org tags
 * - Internal linking strategy
 */

import {
  type AgentInput,
  type AgentResult,
  BaseAgent,
  type InternalLink,
  type SchemaTag,
  type SemanticTagsResult,
} from './base'

export class SemanticTaggerAgent extends BaseAgent {
  name = 'SemanticTaggerAgent'

  async execute(input: AgentInput): Promise<AgentResult<SemanticTagsResult>> {
    const startTime = Date.now()

    try {
      const keywords = input.keywords || []
      const niche = input.niche || 'general'

      const primaryTags = this.generatePrimaryTags(niche, keywords)
      const secondaryTags = this.generateSecondaryTags(niche, keywords)
      const longTailKeywords = this.generateLongTailKeywords(niche, keywords)
      const schemaTags = this.generateSchemaTags(niche, keywords)
      const internalLinks = this.generateInternalLinks(niche, keywords)

      await this.log('tags_generated', {
        primary: primaryTags.length,
        secondary: secondaryTags.length,
        longTail: longTailKeywords.length,
        schemas: schemaTags.length,
        links: internalLinks.length,
      })

      return {
        success: true,
        data: {
          primaryTags,
          secondaryTags,
          longTailKeywords,
          schemaTags,
          internalLinks,
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

  private generatePrimaryTags(niche: string, keywords: string[]): string[] {
    const baseTags = [
      niche,
      `melhor ${niche}`,
      `${niche} review`,
      `${niche} comparativo`,
      `guia ${niche}`,
    ]

    return [...new Set([...baseTags, ...keywords.slice(0, 5)])]
  }

  private generateSecondaryTags(niche: string, keywords: string[]): string[] {
    const secondary = [
      `${niche} para iniciantes`,
      `${niche} profissional`,
      `${niche} custo-benefício`,
      `${niche} moderno`,
      `${niche} avançado`,
      `dicas ${niche}`,
      `problemas ${niche}`,
      `soluções ${niche}`,
      `análise ${niche}`,
      `teste ${niche}`,
    ]

    return [...new Set([...secondary, ...keywords.slice(5, 15)])]
  }

  private generateLongTailKeywords(niche: string, keywords: string[]): string[] {
    const patterns = [
      `qual ${niche} comprar em 2026`,
      `${niche} com melhor custo-benefício`,
      `como escolher ${niche} profissional`,
      `${niche} para home office`,
      `diferença entre ${niche} modelos`,
      `${niche} com melhor desempenho`,
      `setup completo com ${niche}`,
      `${niche} para produtividade`,
      `guia definitivo de ${niche}`,
      `${niche} vale a pena`,
    ]

    return [...new Set([...patterns, ...keywords.slice(0, 10)])]
  }

  private generateSchemaTags(niche: string, keywords: string[]): SchemaTag[] {
    const schemas: SchemaTag[] = [
      {
        type: 'FAQPage',
        data: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: keywords.slice(0, 5).map((q, i) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Answer about ${q}`,
            },
          })),
        },
      },
      {
        type: 'BreadcrumbList',
        data: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: '/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: niche,
              item: `/c/${niche.toLowerCase().replace(/\s+/g, '-')}`,
            },
          ],
        },
      },
      {
        type: 'Article',
        data: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `Guia Completo: ${niche}`,
          description: `Análise completa sobre ${niche}`,
          keywords: keywords.join(', '),
        },
      },
    ]

    return schemas
  }

  private generateInternalLinks(niche: string, keywords: string[]): InternalLink[] {
    const links: InternalLink[] = [
      {
        targetSlug: `/c/${niche.toLowerCase().replace(/\s+/g, '-')}`,
        anchor: `Ver todos sobre ${niche}`,
        context: 'Link para categoria principal',
      },
      {
        targetSlug: `/c/${niche.toLowerCase().replace(/\s+/g, '-')}/review`,
        anchor: 'Reviews detalhados',
        context: 'Seção de reviews',
      },
      {
        targetSlug: `/c/${niche.toLowerCase().replace(/\s+/g, '-')}/comparativo`,
        anchor: 'Comparativos completos',
        context: 'Seção de comparativos',
      },
    ]

    // Adiciona links baseados em keywords
    keywords.slice(0, 5).forEach((kw, i) => {
      links.push({
        targetSlug: `/guias/${kw.toLowerCase().replace(/\s+/g, '-')}`,
        anchor: kw,
        context: `Página editorial sobre ${kw}`,
      })
    })

    return links
  }
}
