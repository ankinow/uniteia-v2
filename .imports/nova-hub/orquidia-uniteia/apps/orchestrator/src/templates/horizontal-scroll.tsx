/**
 * Template 4: Horizontal Scroll - SOTA 2026
 * Scroll horizontal com cards compactos
 */

import type { GeneratedPage, SemanticTagsResult } from '../agents/base'

interface HorizontalScrollTemplateProps {
  page: GeneratedPage
  tags: SemanticTagsResult
  niche: string
  cards?: HCard[]
}

interface HCard {
  id: string
  title: string
  description: string
  pros: string[]
  cons: string[]
}

export function HorizontalScrollTemplate({
  page,
  tags,
  niche,
  cards = [],
}: HorizontalScrollTemplateProps) {
  const sampleCards: HCard[] =
    cards.length > 0
      ? cards
      : [
          {
            id: '1',
            title: 'Opção Premium',
            description: 'O top de linha com as melhores especificações.',
            pros: ['30h bateria', 'Conforto alto'],
            cons: ['Preço alto', 'Não dobra'],
          },
          {
            id: '2',
            title: 'Som Premium',
            description: 'Qualidade sonora superior e ANC excelente.',
            pros: ['Som top', 'ANC top'],
            cons: ['24h bateria', 'Case grande'],
          },
          {
            id: '3',
            title: 'Custo-benefício',
            description: 'Som de qualidade por preço justo.',
            pros: ['50h bateria', 'Som claro'],
            cons: ['ANC médio', 'Plástico'],
          },
          {
            id: '4',
            title: 'Estilo Americano',
            description: 'Graves marcantes e app completo.',
            pros: ['Graves', 'Personalização'],
            cons: ['Conforto médio', 'Aperta'],
          },
          {
            id: '5',
            title: 'Entry-level',
            description: 'A entrada com bom custo-benefício.',
            pros: ['Preço', '45h bateria'],
            cons: ['ANC básico', 'Acabamento'],
          },
        ]

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
          <p className="text-gray-600">Opções organizadas do mais ao menos premium</p>
        </div>
      </header>

      {/* Horizontal Scroll */}
      <section className="py-12 overflow-x-auto">
        <div
          className="flex gap-6 px-4 max-w-6xl mx-auto"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {sampleCards.map((card, index) => (
            <div
              key={card.id}
              className="flex-none w-80 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Card Image */}
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-6xl">{index + 1}</span>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{card.description}</p>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <h4 className="text-green-600 font-semibold text-xs mb-2">Prós</h4>
                    <ul className="text-xs space-y-1">
                      {card.pros.map((pro) => (
                        <li key={pro} className="text-gray-600">
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-red-500 font-semibold text-xs mb-2">Contras</h4>
                    <ul className="text-xs space-y-1">
                      {card.cons.map((con) => (
                        <li key={con} className="text-gray-600">
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tags */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {tags.primaryTags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </article>
  )
}
