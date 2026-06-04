import { component$ } from '@builder.io/qwik'

export interface RobotIconProps {
  size?: number
  class?: string
}

/**
 * Friendly robot mascot — head + body + antenna + smile.
 * Slightly larger 60x60 viewBox for presence.
 * Cyan body, amber cheeks, dark eyes.
 */
export const RobotIcon = component$<RobotIconProps>(({ size = 60, class: className }) => {
  return (
    <svg
      viewBox="0 0 60 60"
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
      {/* antenna stalk */}
      <path d="M 30 6.6 L 30 12" />
      {/* antenna bulb (amber accent) */}
      <circle cx="30" cy="4.6" r="1.6" fill="oklch(72% 0.165 80)" stroke="oklch(72% 0.165 80)" />
      {/* head outline (cyan body) */}
      <rect x="14" y="12" width="32" height="26" rx="4.2" stroke="oklch(70% 0.18 200)" />
      {/* inner face screen */}
      <rect x="18" y="16" width="24" height="18" rx="2" />
      {/* left eye (dark) */}
      <circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="currentColor" />
      {/* right eye (dark) */}
      <circle cx="36" cy="24" r="1.6" fill="currentColor" stroke="currentColor" />
      {/* smile */}
      <path d="M 26 29.4 C 27.6 31.4 32.4 31.4 34 29.4" />
      {/* left cheek (amber accent) */}
      <circle cx="20.5" cy="28" r="1.2" fill="oklch(72% 0.165 80)" stroke="oklch(72% 0.165 80)" />
      {/* right cheek (amber accent) */}
      <circle cx="39.5" cy="28" r="1.2" fill="oklch(72% 0.165 80)" stroke="oklch(72% 0.165 80)" />
      {/* ear knobs left */}
      <path d="M 14 21 L 11 21" stroke="oklch(70% 0.18 200)" />
      <path d="M 14 28 L 11 28" stroke="oklch(70% 0.18 200)" />
      {/* ear knobs right */}
      <path d="M 46 21 L 49 21" stroke="oklch(70% 0.18 200)" />
      <path d="M 46 28 L 49 28" stroke="oklch(70% 0.18 200)" />
      {/* neck */}
      <path d="M 26 38 L 26 42" stroke="oklch(70% 0.18 200)" />
      <path d="M 34 38 L 34 42" stroke="oklch(70% 0.18 200)" />
      {/* body outline (cyan body) */}
      <path d="M 18 53 C 18 47 22 42 30 42 C 38 42 42 47 42 53" stroke="oklch(70% 0.18 200)" />
      {/* body bottom edge */}
      <path d="M 18 53 L 42 53" stroke="oklch(70% 0.18 200)" />
      {/* chest indicator dot (amber) */}
      <circle cx="30" cy="48" r="1.2" fill="oklch(72% 0.165 80)" stroke="oklch(72% 0.165 80)" />
    </svg>
  )
})
