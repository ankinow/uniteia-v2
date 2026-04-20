import autoprefixer from 'autoprefixer'
import customMedia from 'postcss-custom-media'
import nesting from 'postcss-nesting'
import presetEnv from 'postcss-preset-env'

export default {
  plugins: [
    nesting(),
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
