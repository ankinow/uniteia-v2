import { component$ } from '@builder.io/qwik'

export interface HudHeartProps {
  filled?: number | undefined
  total?: number | undefined
  class?: string | undefined
}

export const HudHeart = component$<HudHeartProps>(({ filled = 3, total = 5, class: className }) => {
  const hearts: boolean[] = []
  for (let i = 0; i < total; i++) {
    hearts.push(i < filled)
  }

  return (
    <div
      class={['flex gap-1 items-center', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={`${filled} of ${total} hearts`}
    >
      {hearts.map((isFilled, i) => (
        <div
          key={i}
          class={
            isFilled ? 'pixel-heart' : 'w-2 h-2 bg-[var(--sp-mid)] border border-[var(--sp-ash)]'
          }
          style={{
            imageRendering: 'pixelated',
          }}
        />
      ))}
    </div>
  )
})
