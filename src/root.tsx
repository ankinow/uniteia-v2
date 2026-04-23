import { component$ } from '@builder.io/qwik'
import { QwikCityProvider, RouterOutlet } from '@builder.io/qwik-city'
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/700.css'
import '@fontsource/geist-sans/900.css'
import '@fontsource-variable/inter'
import '@fontsource/jetbrains-mono'
import 'virtual:uno.css'
import './global.css'

export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>UniTeia v2</title>
      </head>
      <body lang="en">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  )
})
