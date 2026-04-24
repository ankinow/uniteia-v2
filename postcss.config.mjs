import autoprefixer from 'autoprefixer'
import customMedia from 'postcss-custom-media'
import presetEnv from 'postcss-preset-env'
import tailwindcss from 'tailwindcss'
import nesting from 'tailwindcss/nesting/index.js'

export default {
  plugins: [
    nesting(),
    tailwindcss(),
    customMedia(),
    presetEnv({
      stage: 2,
      features: {
        'nesting-rules': false,
      },
    }),
    autoprefixer(),
  ],
}
