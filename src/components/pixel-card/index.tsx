import { Slot, component$ } from '@builder.io/qwik'

/**
 * PixelCard — Card com borda pixelada estilo Sunset Saga
 * Variants: default, parchment, gold-rim, sunset, flat
 */
export interface PixelCardProps {
  variant?: 'default' | 'parchment' | 'gold-rim' | 'sunset' | 'flat' | undefined
  href?: string | undefined
  class?: string | undefined
}

export const PixelCard = component$<PixelCardProps>(
  ({ variant = 'default', href, class: className }) => {
    const baseClasses = 'block transition-all duration-150 ease-pixel'

    const variantClasses: Record<string, string> = {
      default:
        'bg-[var(--sp-deep)] border-2 border-[var(--sp-ash)] shadow-[var(--pixel-shadow-sm)] hover:border-[var(--sp-gold)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[var(--pixel-shadow-md)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
      parchment: 'parchment',
      'gold-rim': 'pixel-gold-rim',
      sunset: 'sunset-sheen bg-[var(--sp-deep)] border-2 border-[var(--sp-ash)]',
      flat: 'bg-[var(--sp-deep)] border-2 border-[var(--sp-ash)]',
    }

    const combinedClasses = [baseClasses, variantClasses[variant], className]
      .filter(Boolean)
      .join(' ')

    if (href) {
      return (
        <a href={href} class={combinedClasses}>
          <Slot />
        </a>
      )
    }

    return (
      <div class={combinedClasses}>
        <Slot />
      </div>
    )
  }
)
