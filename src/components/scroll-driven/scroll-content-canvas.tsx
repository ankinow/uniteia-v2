import { Slot, component$ } from '@builder.io/qwik'

/**
 * ScrollContentCanvas — Light canvas reativo ao scroll.
 *
 * Conforme o usuário faz scroll, o grain intensifica (grain-scroll-aware),
 * sketchnotes animam com scroll-reveal, e LivingCharacterMini "acordam"
 * via living-character-wake.
 *
 * Uso:
 * ```tsx
 * <ScrollContentCanvas>
 *   <h2 class="scroll-reveal" data-step="1">Título</h2>
 *   <p class="scroll-reveal" data-step="2">Conteúdo</p>
 *   <div class="living-character-wake">🧬</div>
 * </ScrollContentCanvas>
 * ```
 *
 * Mixed UI directive: light canvas (#f2f0e9) com textura de papel,
 * parte do sistema dual light-canvas/dark-compact.
 */
export interface ScrollContentCanvasProps {
  class?: string
}

export const ScrollContentCanvas = component$<ScrollContentCanvasProps>(({ class: classList }) => {
  return (
    <section
      class={[
        'scroll-content-root relative overflow-hidden rounded-3xl p-6 md:p-8 bg-[#131820] border border-white/5',
        classList,
      ]}
      style={{
        scrollTimelineName: '--content',
        scrollTimelineAxis: 'block',
      }}
    >
      {/* Paper fiber base layer */}
      <div class="grain-4k opacity-30" />

      <div class="relative z-[var(--z-raised)]">
        <Slot />
      </div>
    </section>
  )
})
