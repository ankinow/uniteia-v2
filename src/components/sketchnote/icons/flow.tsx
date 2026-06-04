import { component$ } from '@builder.io/qwik'

export interface FlowIconProps {
  size?: number
  class?: string
}

/**
 * 3 connected boxes with arrows between them — hand-drawn kawaii style.
 * Green accent on arrows.
 */
export const FlowIcon = component$<FlowIconProps>(({ size = 40, class: className }) => {
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
      {/* box 1 */}
      <rect x="4" y="14" width="8" height="12" rx="1.4" />
      {/* box 2 */}
      <rect x="16" y="14" width="8" height="12" rx="1.4" />
      {/* box 3 */}
      <rect x="28" y="14" width="8" height="12" rx="1.4" />
      {/* arrow 1: box1 -> box2 (green) */}
      <path d="M 12.2 19.8 L 15.6 20" stroke="oklch(70% 0.20 145)" />
      <path d="M 14.2 18.4 L 15.7 20 L 14.2 21.6" stroke="oklch(70% 0.20 145)" />
      {/* arrow 2: box2 -> box3 (green) */}
      <path d="M 24.2 19.8 L 27.6 20" stroke="oklch(70% 0.20 145)" />
      <path d="M 26.2 18.4 L 27.7 20 L 26.2 21.6" stroke="oklch(70% 0.20 145)" />
    </svg>
  )
})
