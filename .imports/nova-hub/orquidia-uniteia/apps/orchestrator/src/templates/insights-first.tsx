/**
 * Template 1: Insights First - SOTA 2026
 * Hero com insights + grid de dúvidas + lista de produtos com pros/cons
 */

import type { GeneratedPage, SemanticTagsResult } from '../agents/base'

interface InsightsFirstTemplateProps {
  page: GeneratedPage
  tags: SemanticTagsResult
  niche: string
  products?: ProductCard[]
}

interface ProductCard {
  id: string
  name: string
  description: string
  pros: string[]
  cons: string[]
  details: string
}

export function InsightsFirstTemplate({
  page,
  tags,
  niche,
  products = [],
}: InsightsFirstTemplateProps) {
  return (
    <article className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(tags.schemaTags.find((t) => t.type === 'FAQPage')?.data || {}),
        }}
      />

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Insights baseados nas dúvidas mais comuns e tendências de {niche}
          </p>
        </div>
      </header>

      {/* Insights Grid */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">O que você precisa saber</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <InsightCard
            icon="💡"
            title="O que mais perguntam"
            description={tags.primaryTags[0] || 'Dúvidas comuns sobre o tema'}
          />
          <InsightCard
            icon="🎯"
            title="O que buscar"
            description="Características importantes para considerar na escolha"
          />
          <InsightCard
            icon="⚠️"
            title="O que evitar"
            description="Erros comuns e armadilhas na escolha"
          />
        </div>
      </section>

      {/* Products List */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Análise dos principais opções</h2>
        <div className="space-y-4">
          {products.length > 0 ? (
            products.map((product) => <ProductCardComponent key={product.id} product={product} />)
          ) : (
            <ProductCardComponent
              product={{
                id: '1',
                name: 'Opção Principal',
                description: 'A melhor opção para a maioria dos casos',
                pros: ['Qualidade superior', 'Custo-benefício', 'Suporte completo'],
                cons: ['Preço elevado', 'Disponibilidade limitada'],
                details: 'Análise completa da opção principal no mercado atual.',
              }}
            />
          )}
        </div>
      </section>

      {/* Semantic Tags Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {tags.primaryTags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          {tags.internalLinks.length > 0 && (
            <nav className="mt-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Ver também:</h3>
              <div className="flex flex-wrap gap-4">
                {tags.internalLinks.map((link) => (
                  <a
                    key={link.anchor}
                    href={link.targetSlug}
                    className="text-indigo-600 hover:underline"
                  >
                    {link.anchor}
                  </a>
                ))}
              </div>
            </nav>
          )}
        </div>
      </footer>
    </article>
  )
}

function InsightCard({
  icon,
  title,
  description,
}: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function ProductCardComponent({ product }: { product: ProductCard }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image Placeholder */}
        <div className="w-full md:w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-400">
          <span className="text-4xl">📦</span>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-4">{product.description}</p>

          {/* Pros & Cons */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-green-600 font-semibold text-sm mb-2 flex items-center gap-1">
                <span>✓</span> Prós
              </h4>
              <ul className="text-sm space-y-1">
                {product.pros.map((pro) => (
                  <li key={pro} className="text-gray-600">
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-red-500 font-semibold text-sm mb-2 flex items-center gap-1">
                <span>✗</span> Contras
              </h4>
              <ul className="text-sm space-y-1">
                {product.cons.map((con) => (
                  <li key={con} className="text-gray-600">
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="md:w-40 flex items-center">
          <button
            type="button"
            className="w-full text-center py-3 px-4 bg-gray-100 text-indigo-600 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  )
}
