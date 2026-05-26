/**
 * Avatar — SVG sprite icon wrapper
 *
 * Uses united-avatars.svg sprite (loaded in root component).
 * Provides accessible icon display with variant colors.
 *
 * Variants: robot, human, builder, thinker, neon, badge, star, bulb
 */
import { component$ } from '@builder.io/qwik'
import type { ClassList } from '@builder.io/qwik'

export type AvatarVariant =
  | 'robot'
  | 'human'
  | 'builder'
  | 'thinker'
  | 'neon'
  | 'badge'
  | 'star'
  | 'bulb'

export interface AvatarProps {
  variant?: AvatarVariant
  size?: 'sm' | 'md' | 'lg' | 'xl'
  class?: ClassList
  label?: string
}

const SIZE_MAP: Record<string, string> = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-14 h-14',
}

export const Avatar = component$<AvatarProps>(
  ({ variant = 'robot', size = 'md', class: className, label }) => {
    return (
      <svg
        class={['avatar', SIZE_MAP[size], className].filter(Boolean).join(' ')}
        role="img"
        aria-label={label ?? `Avatar: ${variant}`}
        data-testid="avatar"
      >
        <use href={`/assets/uniteia-avatars.svg#avatar-${variant}`} />
      </svg>
    )
  }
)
