import { component$ } from '@builder.io/qwik'
import { QwikCityProvider, RouterOutlet } from '@builder.io/qwik-city'
import { RouterHead } from '~/components/router-head'
import './global.css'

/**
 * UniTeia Root Component
 * Optimized for Core Web Vitals:
 * - Font preconnect for faster external font loading
 * - Critical resource hints to reduce LCP
 * - CLS-prevention via font-display strategy in CSS
 */
export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>UniTeia v2</title>

        {/* CWV: Preconnect to font CDN to reduce LCP */}
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <RouterHead />
      </head>
      <body>
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  )
})
