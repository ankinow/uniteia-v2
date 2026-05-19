import { Slot, component$ } from '@builder.io/qwik'

/**
 * SidebarScrollGlow — Dark compact sidebar com scanline + glow progressivo.
 *
 * Envolva a sidebar existente para adicionar:
 * - border-color que pulsa conforme progresso do scroll
 * - box-shadow inset que intensifica no meio da página
 * - scanlines sutis que reagem ao scroll (CSS animation-timeline)
 *
 * Uso:
 * ```tsx
 * <SidebarScrollGlow>
 *   <Sidebar navigationItems={items} />
 * </SidebarScrollGlow>
 * ```
 *
 * Mixed UI directive: mantém interface-dark (compact dark) +
 * adiciona camada de glow JRPG reativa ao scroll.
 */
export interface SidebarScrollGlowProps {
  class?: string
}

export const SidebarScrollGlow = component$<SidebarScrollGlowProps>(({ class: classList }) => {
  return (
    <div
      class={['sidebar-scroll-glow interface-dark relative', classList]}
      style={{
        scrollTimelineName: '--narrative',
        scrollTimelineAxis: 'block',
      }}
    >
      {/* Scanline overlay — CSS animation-timeline scroll-driven */}
      <div
        class="scanlines absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(100, 220, 255, 0.04) 2px,
              rgba(100, 220, 255, 0.04) 4px
            )
          `,
        }}
      />
      <div class="relative z-10">
        <Slot />
      </div>
    </div>
  )
})
