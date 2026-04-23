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
        sans: 'Inter:400,500,700',
        display: 'Geist:400,700,900',
        mono: 'JetBrains Mono',
      },
    }),
    presetSolarLanso(),
  ],
  theme: {
    fontFamily: {
      sans: 'Inter, sans-serif',
      display: 'Geist, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
  },
  shortcuts: {
    btn: 'px-4 py-2 rounded-none font-medium transition-all duration-base ease-solar',
    'btn-primary': 'btn bg-action text-void hover:bg-action-hi',
    'btn-outline': 'btn border border-current hover:bg-white/5',
  },
  content: {
    pipeline: {
      include: [/\.(js|ts|jsx|tsx|mdx|qwik)($|\?)/, 'src/**/*.{js,ts,jsx,tsx,mdx,qwik}'],
    },
  },
})
