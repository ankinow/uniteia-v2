import { Slot, component$ } from '@builder.io/qwik'

/**
 * ScrollDepthCardEnhancer — Wrapper que injeta scroll-driven depth + foliage growth + neural glow.
 *
 * Envolva qualquer card (TopicCard, DepthCard, DopamineCard) para adicionar
 * animação de profundidade reativa ao scroll. O card "cresce" da profundidade
 * conforme entra no viewport — UE5 illusion em movimento.
 *
 * Uso:
 * ```tsx
 * <ScrollDepthCardEnhancer>
 *   <TopicCard title="..." summary="..." />
 * </ScrollDepthCardEnhancer>
 * ```
 *
 * Suporta prefers-reduced-motion via CSS (global.css .card-scroll-depth @media).
 */
export interface ScrollDepthCardEnhancerProps {
  class?: string
}

export const ScrollDepthCardEnhancer = component$<ScrollDepthCardEnhancerProps>(
  ({ class: classList }) => {
    return (
      <div
        class={['card-scroll-depth ue5-illusion preserve-3d relative', classList]}
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        <Slot />
        {/* Neural glow ring — aparece no scroll */}
        <div
          class="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-700"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(100,220,255,0.08) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />
      </div>
    )
  }
)
