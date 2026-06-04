import { component$ } from '@builder.io/qwik'

export interface MagnetIconProps {
  size?: number
  class?: string
}

/**
 * Magnet (horseshoe) icon — hand-drawn kawaii style.
 * Cyan accent on pole tips.
 */
export const MagnetIcon = component$<MagnetIconProps>(({ size = 40, class: className }) => {
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
      {/* horseshoe outer curve */}
      <path d="M 9 32 L 9 17 C 9 11.5 13.6 7 19.2 6.8 C 25 6.7 30.1 11 30.2 16.9 L 30.2 32" />
      {/* horseshoe inner curve */}
      <path d="M 14 32 L 14 17.2 C 14.1 13.6 17 10.9 20.4 11 C 24.1 11.1 26.3 14 26.2 17.4 L 26.2 32" />
      {/* left pole cap (cyan accent) */}
      <path d="M 8.8 26.4 L 14.2 26.2" stroke="oklch(70% 0.18 200)" />
      <path d="M 9 32 L 14 31.8" stroke="oklch(70% 0.18 200)" />
      {/* right pole cap (cyan accent) */}
      <path d="M 26.1 26.3 L 30.4 26.4" stroke="oklch(70% 0.18 200)" />
      <path d="M 26.2 32 L 30.2 31.9" stroke="oklch(70% 0.18 200)" />
      {/* N/S markers */}
      <path d="M 11 28.4 L 11 29.4" />
      <path d="M 28.2 28.4 L 28.2 29.4" />
    </svg>
  )
})
