import { Slot, component$ } from '@builder.io/qwik'

export interface PixelButtonProps {
  variant?: 'primary' | 'ghost' | 'gold' | undefined
  size?: 'sm' | 'md' | 'lg' | undefined
  href?: string | undefined
  disabled?: boolean | undefined
  class?: string | undefined
  type?: 'button' | 'submit' | 'reset' | undefined
}

export const PixelButton = component$<PixelButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    href,
    disabled = false,
    class: className,
    type = 'button',
  }) => {
    const baseClasses =
      'inline-flex items-center gap-2 font-[var(--font-family-pixel)] border-2 rounded-none cursor-pointer touch-manipulation transition-all duration-100 ease-pixel select-none image-rendering-pixel'

    const sizeClasses: Record<string, string> = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    const variantClasses: Record<string, string> = {
      primary:
        'bg-[var(--sp-gold)] text-[var(--sp-void)] border-[var(--sp-gold)] shadow-[var(--pixel-shadow-sm)] hover:bg-[var(--sp-amber)] hover:border-[var(--sp-amber)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[var(--pixel-shadow-md)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
      ghost:
        'bg-transparent text-[var(--sp-muted)] border-[var(--sp-ash)] hover:text-[var(--sp-bone)] hover:border-[var(--sp-gold)]',
      gold: 'bg-[var(--sp-gold)] text-[var(--sp-void)] border-[var(--sp-gold)] shadow-[0_0_12px_var(--sp-gold-glow)] hover:bg-[var(--sp-amber)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5',
    }

    const disabledClasses =
      'opacity-50 cursor-not-allowed hover:translate-x-0 hover:translate-y-0 hover:shadow-[var(--pixel-shadow-sm)] active:translate-x-0 active:translate-y-0'

    const combinedClasses = [
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      disabled ? disabledClasses : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    if (href && !disabled) {
      return (
        <a href={href} class={combinedClasses}>
          <Slot />
        </a>
      )
    }

    return (
      <button type={type} disabled={disabled} class={combinedClasses}>
        <Slot />
      </button>
    )
  }
)
