import { component$ } from '@builder.io/qwik'

export interface FlagIconProps {
  size?: number
  class?: string
}

/**
 * Warning flag on pole — hand-drawn kawaii style.
 * Amber accent on the flag fabric.
 */
export const FlagIcon = component$<FlagIconProps>(({ size = 40, class: className }) => {
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
      <title>Flag icon</title>
      <path d="M 10 5.2 L 10.2 35" />
      {/* pole base nub */}
      <path d="M 7.6 35 L 12.8 35" />
      {/* flag fabric (amber accent) — waving edge */}
      <path
        d="M 10.2 6.6 L 30 6.4 C 28.4 9 28.6 12.2 30.2 15 C 30.2 17 28 19 26 19 L 10.2 19.2"
        stroke="oklch(72% 0.165 80)"
      />
      {/* small wavy notch detail on flag */}
      <path d="M 16 9.6 L 18.4 11 L 20.8 9.4" stroke="oklch(72% 0.165 80)" />
    </svg>
  )
})
