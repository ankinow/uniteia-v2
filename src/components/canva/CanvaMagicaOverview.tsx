/**
 * CanvaMagicaOverview — Production-Grade Animated Component
 * PLANO-075: pixel-perfect, 4 materials, SVG paths, stagger animations, a11y
 *
 * Usage:
 *   <CanvaMagicaOverview qualityScore={84} languages={8} features={[...]} />
 *
 * Integrates with existing i18n system via useCanvaI18n() hook.
 * All text is localized across 8 languages (en/pt/es/fr/de/it/ja/zh).
 */
import { component$, useSignal, useStylesScoped$, useVisibleTask$ } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import { useCanvaMagicaT } from '~/hooks/useCanvaI18n'
import styles from './canva.module.css?inline'

interface CanvaCard {
  id: string
  title: string
  description: string
  icon: string
  material: 'carbon-glass' | 'frosted-glass' | 'torn-paper' | 'chrome-cyan-gold'
  isCta?: boolean
}

interface CanvaMagicaProps {
  qualityScore?: number
  languages?: number
  features?: string[]
}

export const CanvaMagicaOverview = component$<CanvaMagicaProps>(
  ({ qualityScore = 84, languages = 8, features = [] }) => {
    const loc = useLocation()
    const lang = loc.params.lang || 'en'
    useStylesScoped$(styles)

    const t = useCanvaMagicaT(lang)
    const isVisible = useSignal(false)
    const hoveredCard = useSignal<number | null>(null)

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      // Trigger stagger entrance after mount
      const timer = setTimeout(() => {
        isVisible.value = true
      }, 50)
      return () => clearTimeout(timer)
    })

    const cards: CanvaCard[] = [
      {
        id: 'command-center',
        title: t.magicaCommandCenter,
        description: t.magicaDescription,
        icon: '⚡',
        material: 'carbon-glass',
      },
      {
        id: 'ai-processing',
        title: t.aiProcessing,
        description: features.length > 0 ? features.join(' • ') : t.nodeBasedPromptChaining,
        icon: '🧠',
        material: 'frosted-glass',
      },
      {
        id: 'architecture',
        title: t.architecture,
        description: t.multiModelFallback,
        icon: '🏗️',
        material: 'torn-paper',
      },
      {
        id: 'start-building',
        title: t.startBuilding,
        description: t.tryMagicaFree,
        icon: '🚀',
        material: 'chrome-cyan-gold',
        isCta: true,
      },
    ]

    return (
      <section
        class={`canva-container ${isVisible.value ? 'visible' : ''}`}
        aria-label={t.workflowVisualization}
        data-lang={lang}
      >
        {/* Ambient background orbs */}
        <div class="ambient-bg" aria-hidden="true">
          <div class="ambient-orb orb-1" />
          <div class="ambient-orb orb-2" />
        </div>

        {/* Header */}
        <header class="canva-header">
          <h1 class="canva-title">{t.magicaWorkflowBuilder}</h1>
          <p class="canva-subtitle">{t.unifiedPromptEngineering}</p>
        </header>

        {/* Stats bar */}
        <div class="stats-bar" role="region" aria-label={t.keyMetrics}>
          <div class="stat-pill" style={{ '--stagger-delay': '0ms' }}>
            <span class="stat-value">{qualityScore}</span>
            <span class="stat-label">{t.qualityScore}</span>
          </div>
          <div class="stat-pill" style={{ '--stagger-delay': '150ms' }}>
            <span class="stat-value">{languages}</span>
            <span class="stat-label">{t.languages}</span>
          </div>
        </div>

        {/* Desktop: grid with SVG connection paths */}
        <div class="canva-grid" role="main">
          <svg
            class="connection-svg"
            viewBox="0 0 800 600"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.8" />
                <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Command Center → AI Processing */}
            <path
              class="connection-path"
              d="M 200 150 C 300 150, 350 150, 400 150"
              stroke="url(#pathGradient)"
              filter="url(#glow)"
              style={{ '--path-delay': '0ms' }}
            />
            {/* AI Processing → output (curve down) */}
            <path
              class="connection-path"
              d="M 600 150 C 650 150, 650 300, 600 300"
              stroke="url(#pathGradient)"
              filter="url(#glow)"
              style={{ '--path-delay': '200ms' }}
            />
            {/* Command Center → Architecture (curve down) */}
            <path
              class="connection-path"
              d="M 200 150 C 150 150, 150 300, 200 300"
              stroke="url(#pathGradient)"
              filter="url(#glow)"
              style={{ '--path-delay': '400ms' }}
            />
            {/* Architecture → Start Building */}
            <path
              class="connection-path"
              d="M 400 300 C 450 300, 450 300, 500 300"
              stroke="url(#pathGradient)"
              filter="url(#glow)"
              style={{ '--path-delay': '600ms' }}
            />
            {/* Diagonal: Architecture → AI Processing */}
            <path
              class="connection-path diagonal"
              d="M 400 300 C 450 250, 450 200, 500 150"
              stroke="url(#pathGradient)"
              stroke-dasharray="8 4"
              opacity="0.4"
              style={{ '--path-delay': '800ms' }}
            />
          </svg>

          {/* Cards */}
          {cards.map((card, i) => (
            <article
              key={card.id}
              class={`depth-card material-${card.material} ${
                card.isCta ? 'cta-card' : ''
              } ${hoveredCard.value === i ? 'hovered' : ''}`}
              style={{ '--stagger-delay': `${i * 200}ms` }}
              onMouseEnter$={() => (hoveredCard.value = i)}
              onMouseLeave$={() => (hoveredCard.value = null)}
              onFocusIn$={() => (hoveredCard.value = i)}
              onFocusOut$={() => (hoveredCard.value = null)}
              aria-label={`${card.title}: ${card.description}`}
            >
              <div class="card-glow" aria-hidden="true" />
              <div class="card-content">
                <span class="card-icon" aria-hidden="true">
                  {card.icon}
                </span>
                <h2 class="card-title">{card.title}</h2>
                <p class="card-description">{card.description}</p>
                {card.isCta && (
                  <a
                    href="https://try.magica.com/clique-serio"
                    class="cta-button"
                    aria-label={t.visitMagica}
                  >
                    {t.visitMagica}
                    <svg class="cta-arrow" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                      />
                    </svg>
                  </a>
                )}
              </div>
              <div class="card-border" aria-hidden="true" />
            </article>
          ))}
        </div>

        {/* Mobile: linear flow */}
        <div class="mobile-flow" role="main" aria-label={t.workflowSteps}>
          {cards.map((card, i) => (
            <div key={card.id} class="mobile-step" style={{ '--stagger-delay': `${i * 100}ms` }}>
              <div class={`mobile-dot material-${card.material}`} />
              <div class="mobile-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                {card.isCta && (
                  <a
                    href="https://try.magica.com/clique-serio"
                    class="mobile-cta"
                    aria-label={t.visitMagica}
                  >
                    {t.visitMagica} →
                  </a>
                )}
              </div>
              {i < cards.length - 1 && <div class="mobile-connector" />}
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer class="canva-footer">
          <p>
            {t.poweredBy} <span class="brand">UniTeia</span> × <span class="brand">Hermes</span>
          </p>
        </footer>
      </section>
    )
  }
)
