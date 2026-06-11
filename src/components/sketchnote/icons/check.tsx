import { component$ } from '@builder.io/qwik'

export interface CheckIconProps {
  size?: number
  class?: string
}

/**
 * Checkmark + x-mark pair (do / don't style) — hand-drawn kawaii style.
 * Green check, rose x.
 */
export const CheckIcon = component$<CheckIconProps>(({ size = 40, class: className }) => {
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
      <title>Check icon</title>
      <circle cx="12" cy="20" r="7" />
      {/* checkmark inside (green) */}
      <path d="M 8.8 20.2 L 11 22.4 L 15.2 17.6" stroke="oklch(70% 0.20 145)" />
      {/* right circle (don't) */}
      <circle cx="28" cy="20" r="7" />
      {/* x-mark inside (rose) */}
      <path d="M 25 17 L 31 23" stroke="oklch(68% 0.18 25)" />
      <path d="M 31 17 L 25 23" stroke="oklch(68% 0.18 25)" />
    </svg>
  )
})
