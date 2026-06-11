import { component$ } from '@builder.io/qwik'

export interface StarIconProps {
  size?: number
  class?: string
}

/**
 * 5-point star with sparkle — hand-drawn kawaii style.
 * Amber accent on the star fill.
 */
export const StarIcon = component$<StarIconProps>(({ size = 40, class: className }) => {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      class={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <title>Star icon</title>
      <path
        d="M 17 6.6 L 20.2 13.6 L 27.8 14.4 C 28.4 14.5 28.6 15.2 28.2 15.6 L 22.6 20.8 L 24.4 28.2 C 24.6 28.8 24 29.2 23.5 28.9 L 17 25.2 L 10.4 29 C 9.9 29.3 9.4 28.9 9.5 28.3 L 11.3 20.8 L 5.7 15.7 C 5.3 15.3 5.5 14.6 6.1 14.5 L 13.7 13.7 L 16.4 6.6 C 16.6 6 17.4 6 17 6.6 Z"
        fill="oklch(72% 0.165 80)"
        stroke="oklch(72% 0.165 80)"
      />
      {/* sparkle 1 (top right) */}
      <path d="M 32 8 L 32 13" stroke="oklch(72% 0.165 80)" />
      <path d="M 29.5 10.5 L 34.5 10.5" stroke="oklch(72% 0.165 80)" />
      {/* sparkle 2 (bottom left) */}
      <path d="M 6 32 L 6 35.5" />
      <path d="M 4.2 33.7 L 7.7 33.7" />
    </svg>
  )
})
