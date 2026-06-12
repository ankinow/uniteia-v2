import { Slot, component$ } from '@builder.io/qwik'

export interface GoldenReflectionProps {
  intensity?: 'subtle' | 'medium' | 'strong' | undefined
  class?: string | undefined
}

export const GoldenReflection = component$<GoldenReflectionProps>(
  ({ intensity = 'subtle', class: className }) => {
    const intensityMap: Record<string, string> = {
      subtle: 'before:from-[oklch(0.82_0.15_85_/_0.06)] before:to-[oklch(0.58_0.22_35_/_0.03)]',
      medium: 'before:from-[oklch(0.82_0.15_85_/_0.12)] before:to-[oklch(0.58_0.22_35_/_0.06)]',
      strong: 'before:from-[oklch(0.82_0.15_85_/_0.18)] before:to-[oklch(0.58_0.22_35_/_0.10)]',
    }

    return (
      <div class={['sunset-sheen', 'relative', className].filter(Boolean).join(' ')}>
        <div
          class="absolute inset-0 pointer-events-none z-10 before:absolute before:inset-0"
          style={{
            background: `linear-gradient(160deg, oklch(0.82 0.15 85 / ${intensity === 'subtle' ? '0.06' : intensity === 'medium' ? '0.12' : '0.18'}) 0%, transparent 30%, oklch(0.58 0.22 35 / ${intensity === 'subtle' ? '0.03' : intensity === 'medium' ? '0.06' : '0.10'}) 100%)`,
          }}
        />
        <Slot />
      </div>
    )
  }
)
