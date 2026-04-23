import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
} from 'unocss'
import { presetSolarLanso } from './uno-presets/solarlanso'

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetTypography(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter:400,500,600,700',
        mono: 'JetBrains Mono:400,500',
      },
    }),
    presetSolarLanso(),
  ],
  theme: {
    colors: {
      void: 'oklch(8% 0.01 260)',
    },
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'JetBrains Mono, Menlo, monospace',
    },
  },
  shortcuts: {
    btn: 'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
    'btn-primary': 'btn bg-action text-void hover:bg-action-hover',
    'btn-outline': 'btn border border-current hover:bg-white/10',
  },
  content: {
    pipeline: {
      include: [/\.(js|ts|jsx|tsx|mdx|qwik)($|\?)/, 'src/**/*.{js,ts,jsx,tsx,mdx,qwik}'],
    },
  },
})
