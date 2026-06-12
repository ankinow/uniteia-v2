import { Slot, component$ } from '@builder.io/qwik'

export interface PixelFrameProps {
  variant?: 'gold' | 'ember' | 'double' | undefined
  class?: string | undefined
}

export const PixelFrame = component$<PixelFrameProps>(({ variant = 'gold', class: className }) => {
  const variantClasses: Record<string, string> = {
    gold: 'pixel-frame',
    ember:
      'border-3 border-[var(--sp-ember)] rounded-none outline-1 outline-[var(--sp-gold)] -outline-offset-5 shadow-[0_0_0_2px_var(--sp-void),0_0_0_5px_var(--sp-ash)]',
    double:
      'border-2 border-[var(--sp-gold)] rounded-none outline-1 outline-[var(--sp-ash)] -outline-offset-3',
  }

  return (
    <div class={[variantClasses[variant], 'p-6', className].filter(Boolean).join(' ')}>
      <Slot />
    </div>
  )
})
