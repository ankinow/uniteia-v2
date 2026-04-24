import { defineConfig, presetAttributify, presetIcons, presetTypography, presetWind3 } from 'unocss'
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
    presetSolarLanso(),
  ],
  theme: {
    fontFamily: {
      sans: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
      display: '"Geist Sans", Geist, ui-sans-serif, system-ui, sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
  },
  shortcuts: {
    btn: 'px-4 py-2 rounded-none font-medium transition-all duration-base ease-solar',
    'btn-primary': 'btn bg-action text-void hover:bg-action-hi',
    'btn-outline': 'btn border border-current hover:bg-white/5',
    'hud-panel': 'surface-hud',
    'hud-label': 'hud-label-base',
    'scratch-divider': 'scratch-divider',
  },
  content: {
    pipeline: {
      include: [/\.(js|ts|jsx|tsx|mdx|qwik)($|\?)/, 'src/**/*.{js,ts,jsx,tsx,mdx,qwik}'],
    },
  },
})
