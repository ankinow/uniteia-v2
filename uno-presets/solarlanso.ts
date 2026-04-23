import type { Preset } from 'unocss'

/**
 * SolarLanso Design Tokens Preset for UnoCSS
 *
 * A dark-first design system with OKLCH colors for modern displays.
 * Named after the interplay of solar (action) and lanso (language/structure).
 */

export interface SolarLansoTheme {
  colors: {
    // Surface hierarchy (dark-first)
    void: string // Deepest background
    deep: string // Elevated surfaces
    mid: string // Cards, panels
    raised: string // Hover states, inputs

    // Semantic colors
    action: string // Primary CTAs (cyan)
    verified: string // Success states (vine green)
    curation: string // Highlights, edits (bronze)

    // Text colors
    text: {
      primary: string
      secondary: string
      muted: string
    }
  }

  motion: {
    fast: string
    base: string
    slow: string
  }

  typography: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
    '5xl': string
  }
}

/**
 * OKLCH color values for SolarLanso palette
 * Using OKLCH for perceptually uniform color distribution
 */
const colors = {
  // Surface hierarchy - progressively lighter
  void: '#0D1117',
  deep: '#161B22',
  mid: '#21262D',
  raised: '#30363D',

  // Action colors (cyan)
  action: 'oklch(0.85 0.18 210)',
  'action-hi': 'oklch(0.90 0.18 210)',

  // Semantic colors
  verified: 'oklch(0.78 0.18 145)', // Vine green
  'verified-hi': 'oklch(0.83 0.18 145)',

  curation: 'oklch(0.72 0.09 75)', // Bronze
  'curation-hi': 'oklch(0.77 0.09 75)',

  // Text colors (bone)
  bone: '#F0E8D8',
  'bone-muted': '#8B949E',
}

/**
 * Motion tokens for animations
 * Following SolarLanso 2100 v1.2 spec
 */
const motion = {
  fast: '120ms',
  base: '200ms',
  slow: '250ms',
  ease: 'cubic-bezier(.2,.8,.2,1)',
}

/**
 * Typography scale following modular rhythm
 * Using em-based sizing for better accessibility
 */
const typography = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem', // 48px
}

export const presetSolarLanso = (): Preset<SolarLansoTheme> => {
  return {
    name: 'preset-solarlanso',

    theme: {
      // Color tokens
      colors: {
        // Surface hierarchy
        void: colors.void,
        deep: colors.deep,
        mid: colors.mid,
        raised: colors.raised,

        // Action (cyan)
        action: {
          DEFAULT: colors.action,
          hi: colors['action-hi'],
        },

        // Verified (green)
        verified: {
          DEFAULT: colors.verified,
          hi: colors['verified-hi'],
        },

        // Curation (bronze)
        curation: {
          DEFAULT: colors.curation,
          hi: colors['curation-hi'],
        },

        // Bone text hierarchy
        bone: {
          DEFAULT: colors.bone,
          muted: colors['bone-muted'],
        },
      },

      // Animation/transition timing
      animation: {
        timing: {
          fast: motion.fast,
          base: motion.base,
          slow: motion.slow,
        },
        easing: {
          DEFAULT: motion.ease,
        },
      },

      // Transition durations
      durations: {
        fast: motion.fast,
        base: motion.base,
        slow: motion.slow,
      },

      // Font sizes
      fontSize: typography,
    },

    // Rules for custom utilities
    rules: [
      // Surface background utilities
      ['bg-void', { 'background-color': colors.void }],
      ['bg-deep', { 'background-color': colors.deep }],
      ['bg-mid', { 'background-color': colors.mid }],
      ['bg-raised', { 'background-color': colors.raised }],

      // Text color utilities
      ['text-bone', { color: colors.bone }],
      ['text-bone-muted', { color: colors['bone-muted'] }],

      // Motion timing utilities
      ['duration-fast', { 'transition-duration': motion.fast }],
      ['duration-base', { 'transition-duration': motion.base }],
      ['duration-slow', { 'transition-duration': motion.slow }],
      ['ease-solar', { 'transition-timing-function': motion.ease }],
    ],

    // Shortcuts for common patterns
    shortcuts: {
      // Surface hierarchy
      'surface-void': 'bg-void text-bone',
      'surface-deep': 'bg-deep text-bone',
      'surface-mid': 'bg-mid text-bone',
      'surface-raised': 'bg-raised text-bone',

      // Action button
      'btn-action':
        'px-4 py-2 rounded-lg bg-action text-void font-medium transition-all duration-base ease-solar hover:bg-action-hi',

      // Verified state
      'text-verified': 'text-verified',
      'bg-verified': 'bg-verified',

      // Curation highlights
      'text-curation': 'text-curation',
      'bg-curation': 'bg-curation',
    },
  }
}

// Export types for consumers
export type { Preset }
