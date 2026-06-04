import { component$ } from '@builder.io/qwik'

export interface HubIconProps {
  size?: number
  class?: string
}

/**
 * Central circle with 4 connected nodes around it — hand-drawn kawaii style.
 * Cyan accent for center, gray for satellite nodes.
 */
export const HubIcon = component$<HubIconProps>(({ size = 40, class: className }) => {
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
      {/* connecting lines (slight wobble for hand-drawn feel) */}
      <path d="M 20 14.5 L 20 8" stroke="oklch(60% 0.01 240)" />
      <path d="M 25.6 21.4 L 32 25.8" stroke="oklch(60% 0.01 240)" />
      <path d="M 14.4 21.4 L 8 25.8" stroke="oklch(60% 0.01 240)" />
      <path d="M 20 25.8 L 20 32.2" stroke="oklch(60% 0.01 240)" />
      {/* central hub (cyan accent) */}
      <circle cx="20" cy="20" r="5.6" stroke="oklch(70% 0.18 200)" />
      {/* 4 satellite nodes (gray) */}
      <circle cx="20" cy="6" r="2.2" stroke="oklch(55% 0.01 240)" />
      <circle cx="33.8" cy="27.4" r="2.2" stroke="oklch(55% 0.01 240)" />
      <circle cx="6.2" cy="27.4" r="2.2" stroke="oklch(55% 0.01 240)" />
      <circle cx="20" cy="33.8" r="2.2" stroke="oklch(55% 0.01 240)" />
    </svg>
  )
})
