import { component$ } from '@builder.io/qwik'

export interface AlertIconProps {
  size?: number
  class?: string
}

/**
 * Triangle warning sign with exclamation — hand-drawn kawaii style.
 * Amber accent on the exclamation dot.
 */
export const AlertIcon = component$<AlertIconProps>(({ size = 40, class: className }) => {
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
      {/* rounded warning triangle */}
      <path d="M 19.6 6.8 C 20.6 5 23 5 24 6.9 L 36 28.6 C 36.9 30.4 35.6 32.4 33.6 32.4 L 6.4 32.6 C 4.4 32.6 3.1 30.5 4 28.7 L 15.8 7 C 16.6 5.6 18.6 5.6 19.6 6.8 Z" />
      {/* exclamation bar (amber) */}
      <path d="M 20 13.8 L 19.6 22.4" stroke="oklch(72% 0.165 80)" />
      {/* exclamation dot (amber filled) */}
      <circle cx="19.8" cy="27" r="1.1" fill="oklch(72% 0.165 80)" stroke="oklch(72% 0.165 80)" />
    </svg>
  )
})
