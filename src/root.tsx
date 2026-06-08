import { component$, useVisibleTask$ } from '@builder.io/qwik'
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city'
import { RouterHead } from '~/components/router-head'
import './global.css'
import '~/assets/uniteia-core.css'
import '~/assets/aether-assets-glow.css'
import '~/assets/aether-assets-textures.css'
import '~/assets/aether-assets-animations.css'
import '~/assets/living-brief.css'

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

        {/* CWV: Google Fonts CDN — Zen Maru Gothic (JRPG/Anime display) + Inter (body) + JetBrains Mono (code) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
          rel="stylesheet"
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
