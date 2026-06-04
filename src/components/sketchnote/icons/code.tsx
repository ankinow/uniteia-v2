import { component$ } from '@builder.io/qwik'

export interface CodeIconProps {
  size?: number
  class?: string
}

/**
 * </> code brackets icon — hand-drawn kawaii style.
 * Cyan accent on the brackets.
 */
export const CodeIcon = component$<CodeIconProps>(({ size = 40, class: className }) => {
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
      {/* left bracket "<" (cyan accent) */}
      <path d="M 15 12.6 L 7 20 L 15 27.4" stroke="oklch(70% 0.18 200)" />
      {/* right bracket ">" (cyan accent) */}
      <path d="M 25 12.6 L 33 20 L 25 27.4" stroke="oklch(70% 0.18 200)" />
      {/* slash "/" */}
      <path d="M 22.4 11.2 L 17.6 28.8" />
    </svg>
  )
})
