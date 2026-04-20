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
  void: 'oklch(8% 0.01 260)', // #0a0a0b equivalent
  deep: 'oklch(12% 0.015 260)', // Elevated backgrounds
  mid: 'oklch(18% 0.02 260)', // Cards, panels
  raised: 'oklch(25% 0.025 260)', // Inputs, hover states

  // Action colors
  action: 'oklch(75% 0.15 195)', // Cyan - primary CTAs
  'action-hover': 'oklch(80% 0.16 195)',

  // Semantic colors
  verified: 'oklch(65% 0.2 145)', // Vine green - success
  'verified-hover': 'oklch(70% 0.22 145)',

  curation: 'oklch(70% 0.12 55)', // Bronze - highlights
  'curation-hover': 'oklch(75% 0.14 55)',

  // Text colors
  bone: 'oklch(92% 0.01 80)', // Primary text
  'bone-secondary': 'oklch(70% 0.02 80)', // Secondary text
  'bone-muted': 'oklch(50% 0.02 80)', // Muted text
}

/**
 * Motion tokens for animations
 * Using CSS custom properties for flexibility
 */
const motion = {
  fast: '150ms',
  base: '250ms',
  slow: '400ms',
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
          hover: colors['action-hover'],
        },

        // Verified (green)
        verified: {
          DEFAULT: colors.verified,
          hover: colors['verified-hover'],
        },

        // Curation (bronze)
        curation: {
          DEFAULT: colors.curation,
          hover: colors['curation-hover'],
        },

        // Bone text hierarchy
        bone: {
          DEFAULT: colors.bone,
          secondary: colors['bone-secondary'],
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
      ['text-bone-secondary', { color: colors['bone-secondary'] }],
      ['text-bone-muted', { color: colors['bone-muted'] }],

      // Motion timing utilities
      ['duration-fast', { 'transition-duration': motion.fast }],
      ['duration-base', { 'transition-duration': motion.base }],
      ['duration-slow', { 'transition-duration': motion.slow }],
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
        'px-4 py-2 rounded-lg bg-action text-void font-medium transition-colors duration-base hover:bg-action-hover',

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
