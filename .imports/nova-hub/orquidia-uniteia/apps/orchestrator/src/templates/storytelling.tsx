/**
 * Template 3: Storytelling - SOTA 2026
 * Cards narrativos com descrição, meta e pros/cons
 */

import type { GeneratedPage, SemanticTagsResult } from '../agents/base'

interface StorytellingTemplateProps {
  page: GeneratedPage
  tags: SemanticTagsResult
  niche: string
  stories?: StoryCard[]
}

interface StoryCard {
  id: string
  title: string
  meta: string
  excerpt: string
  pros: string[]
  cons: string[]
}

export function StorytellingTemplate({
  page,
  tags,
  niche,
  stories = [],
}: StorytellingTemplateProps) {
  const sampleStories: StoryCard[] =
    stories.length > 0
      ? stories
      : [
          {
            id: '1',
            title: 'Opção Premium',
            meta: '⭐ 4.7 • 30h bateria • ANC Top',
            excerpt: 'O referência do mercado. Cancelamento de ruído sutil mas eficaz.',
            pros: ['Conforto para dia todo', 'App completo', 'Pausa automática'],
            cons: ['Não dobra', 'Preço alto'],
          },
          {
            id: '2',
            title: 'Custo-benefício',
            meta: '⭐ 4.4 • 50h bateria • Som claro',
            excerpt: 'A surpresa positiva. Som de qualidade por menos da metade.',
            pros: ['Bateria absurda', 'Qualidade premium', 'Preço justo'],
            cons: ['ANC médio', 'Material plástico'],
          },
          {
            id: '3',
            title: 'Entry-level',
            meta: '⭐ 4.3 • 45h bateria • Básico',
            excerpt: 'Para quem quer começar sem gastar muito. Faz o básico bem.',
            pros: ['Preço justo', 'Bateria longa', 'Simples de usar'],
            cons: ['ANC básico', 'Acabamento simples'],
          },
        ]

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Intro */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
        <p className="text-xl text-gray-600">
          Análise baseada em uso real e dúvidas de quem já testou
        </p>
      </section>

      {/* Story Cards */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="space-y-8">
          {sampleStories.map((story) => (
            <StoryCardComponent key={story.id} story={story} />
          ))}
        </div>
      </section>

      {/* Tags Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-4xl mx-auto px-4">
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

function StoryCardComponent({ story }: { story: StoryCard }) {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="w-full md:w-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center min-h-[200px] md:min-h-auto">
          <span className="text-6xl">📦</span>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-2">{story.title}</h2>
          <div className="flex gap-4 text-sm text-gray-500 mb-4">
            {story.meta.split('•').map((item) => (
              <span key={item.trim()}>{item.trim()}</span>
            ))}
          </div>
          <p className="text-gray-600 mb-6">{story.excerpt}</p>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-green-600 font-semibold text-sm mb-2">Prós</h4>
              <ul className="text-sm space-y-1">
                {story.pros.map((pro) => (
                  <li key={pro} className="text-gray-600">
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-red-500 font-semibold text-sm mb-2">Contras</h4>
              <ul className="text-sm space-y-1">
                {story.cons.map((con) => (
                  <li key={con} className="text-gray-600">
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
