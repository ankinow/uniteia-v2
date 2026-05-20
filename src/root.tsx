import { component$, useVisibleTask$ } from '@builder.io/qwik'
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city'
import { RouterHead } from '~/components/router-head'
import './global.css'

/**
 * UniTeia Root Component
 * Optimized for Core Web Vitals:
 * - Font preconnect for faster LCP
 * - Critical resource hints to reduce LCP
 * - CLS-prevention via font-display strategy in CSS
 * - Scroll-driven CSS loaded deferred (non-critical, below-fold)
 */
export default component$(() => {
  // Deferred load of scroll-driven CSS (non-critical, below-fold animations)
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/scroll-driven.css'
    link.media = 'print'
    link.onload = () => {
      link.media = 'all'
    }
    document.head.appendChild(link)
  })

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0B0C15" />
        <meta name="color-scheme" content="dark" />
        <link rel="manifest" href="/manifest.json" />

        {/* CWV: Preload critical fonts to reduce LCP and layout shift */}
        <link
          rel="preload"
          href="/fonts/geist.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body>
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  )
})
