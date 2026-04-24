import { addDynamicIconSelectors } from '@iconify/tailwind'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx,qwik}'],
  theme: {
    extend: {
      colors: {
        // Surface hierarchy
        void: '#0D1117',
        deep: '#161B22',
        mid: '#21262D',
        raised: '#30363D',

        // Action (cyan)
        action: {
          DEFAULT: 'oklch(0.85 0.18 210)',
          hi: 'oklch(0.90 0.18 210)',
        },

        // Verified (green)
        verified: {
          DEFAULT: 'oklch(0.78 0.18 145)',
          hi: 'oklch(0.83 0.18 145)',
        },

        // Curation (bronze)
        curation: {
          DEFAULT: 'oklch(0.72 0.09 75)',
          hi: 'oklch(0.77 0.09 75)',
        },

        // Bone text hierarchy
        bone: {
          DEFAULT: '#F0E8D8',
          muted: '#8B949E',
          primary: '#F0E8D8', // matching text-bone-primary
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Geist Sans"', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      transitionDuration: {
        fast: '120ms',
        base: '200ms',
        slow: '250ms',
      },
      transitionTimingFunction: {
        solar: 'cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [typography, addDynamicIconSelectors()],
  safelist: [
    'icon-[lucide--bot]',
    'icon-[lucide--message-square-text]',
    'icon-[lucide--pen-tool]',
    'icon-[lucide--check-circle-2]',
    'icon-[lucide--zap]',
  ],
}
