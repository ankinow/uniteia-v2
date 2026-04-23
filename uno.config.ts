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
      provider: 'fontshare',
      fonts: {
        sans: 'Satoshi:400,500,700',
        display: 'Satoshi:700,900',
        mono: {
          name: 'JetBrains Mono',
          provider: 'google',
        },
      },
    }),
    presetSolarLanso(),
  ],
  theme: {
    fontFamily: {
      sans: 'Satoshi, Inter, sans-serif',
      display: 'Satoshi, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
  },
  shortcuts: {
    btn: 'px-4 py-2 rounded-lg font-medium transition-all duration-base ease-solar',
    'btn-primary': 'btn bg-action text-void hover:bg-action-hi',
    'btn-outline': 'btn border border-current hover:bg-white/5',
  },
  content: {
    pipeline: {
      include: [/\.(js|ts|jsx|tsx|mdx|qwik)($|\?)/, 'src/**/*.{js,ts,jsx,tsx,mdx,qwik}'],
    },
  },
})
