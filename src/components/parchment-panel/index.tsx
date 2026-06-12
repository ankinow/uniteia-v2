import { Slot, component$ } from '@builder.io/qwik'

export interface ParchmentPanelProps {
  variant?: 'default' | 'torn' | 'scroll' | undefined
  class?: string | undefined
}

export const ParchmentPanel = component$<ParchmentPanelProps>(
  ({ variant = 'default', class: className }) => {
    const variantClasses: Record<string, string> = {
      default: 'parchment p-6',
      torn: 'torn-paper parchment p-6',
      scroll: 'parchment p-6 rounded-tl-lg rounded-br-lg',
    }

    return (
      <div class={[variantClasses[variant], className].filter(Boolean).join(' ')}>
        <Slot />
      </div>
    )
  }
)
