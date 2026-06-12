import { Slot, component$ } from '@builder.io/qwik'

export interface SunsetSkyProps {
  variant?: 'full' | 'hero' | 'footer' | undefined
  class?: string | undefined
}

export const SunsetSky = component$<SunsetSkyProps>(({ variant = 'full', class: className }) => {
  const variantClasses: Record<string, string> = {
    full: 'sunset-sky min-h-[50vh]',
    hero: 'sunset-sky min-h-[60vh] flex items-center justify-center',
    footer: 'sunset-sky min-h-[30vh]',
  }

  return (
    <div class={[variantClasses[variant], className].filter(Boolean).join(' ')}>
      <Slot />
    </div>
  )
})
