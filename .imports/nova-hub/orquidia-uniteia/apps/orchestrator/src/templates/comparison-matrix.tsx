/**
 * Template 2: Comparison Matrix - SOTA 2026
 * Tabela comparativa + seções de insights
 */

import type { GeneratedPage, SemanticTagsResult } from '../agents/base'

interface ComparisonMatrixTemplateProps {
  page: GeneratedPage
  tags: SemanticTagsResult
  niche: string
  products?: ComparisonProduct[]
}

interface ComparisonProduct {
  id: string
  name: string
  image?: string
  ratings: {
    som: string
    anc: string
    bateria: string
    conforto: string
    preco: string
  }
}

export function ComparisonMatrixTemplate({
  page,
  tags,
  niche,
  products = [],
}: ComparisonMatrixTemplateProps) {
  const sampleProducts: ComparisonProduct[] =
    products.length > 0
      ? products
      : [
          {
            id: '1',
            name: 'Opção Premium',
            ratings: {
              som: 'Excelente',
              anc: 'Top',
              bateria: '30h',
              conforto: 'Alto',
              preco: 'R$ 2.499',
            },
          },
          {
            id: '2',
            name: 'Opção Intermediária',
            ratings: {
              som: 'Bom',
              anc: 'Bom',
              bateria: '40h',
              conforto: 'Médio',
              preco: 'R$ 1.599',
            },
          },
          {
            id: '3',
            name: 'Opção Básica',
            ratings: {
              som: 'Regular',
              anc: 'Básico',
              bateria: '50h',
              conforto: 'Médio',
              preco: 'R$ 699',
            },
          },
        ]

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Table',
            about: page.title,
          }),
        }}
      />

      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comparativo técnico das principais opções de {niche}
          </p>
        </div>
      </header>

      {/* Comparison Table */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-6 bg-gray-100 py-4 px-4 font-semibold text-sm">
            <div className="col-span-1">Modelo</div>
            <div className="col-span-1 text-center">Som</div>
            <div className="col-span-1 text-center">ANC</div>
            <div className="col-span-1 text-center">Bateria</div>
            <div className="col-span-1 text-center">Conforto</div>
            <div className="col-span-1 text-center">Preço</div>
          </div>

          {/* Table Rows */}
          {sampleProducts.map((product, index) => (
            <div
              key={product.id}
              className={`grid grid-cols-6 py-4 px-4 items-center border-t border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div className="col-span-1 flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                  📦
                </div>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="col-span-1 text-center text-sm">{product.ratings.som}</div>
              <div className="col-span-1 text-center text-sm">{product.ratings.anc}</div>
              <div className="col-span-1 text-center text-sm">{product.ratings.bateria}</div>
              <div className="col-span-1 text-center text-sm">{product.ratings.conforto}</div>
              <div className="col-span-1 text-center font-medium">{product.ratings.preco}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Insights Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <InsightBox icon="💡" title="O que perguntam" items={tags.longTailKeywords.slice(0, 3)} />
          <InsightBox icon="🎯" title="O que buscar" items={tags.primaryTags.slice(0, 3)} />
          <InsightBox
            icon="⚠️"
            title="O que evitar"
            items={['Reviews superficiais', 'Specs sem contexto', 'Preços desatualizados']}
          />
        </div>
      </section>

      {/* Semantic Footer */}
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

function InsightBox({ icon, title, items }: { icon: string; title: string; items: string[] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="text-sm text-gray-600 border-b border-gray-50 pb-2 last:border-0"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
