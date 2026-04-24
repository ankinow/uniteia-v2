import { $, Slot, component$, useOnDocument } from '@builder.io/qwik'
import type { RequestHandler } from '@builder.io/qwik-city'
import { useI18n } from '~/i18n/context'
import { onLanguageNegotiation } from '~/i18n/middleware'
import type { SiteShellLogEvent } from './types'

/**
 * Middleware: Language negotiation
 * Runs on every request to determine user's preferred language
 */
export const onRequest: RequestHandler = onLanguageNegotiation

/**
 * SiteShell - Root layout component
 * Provides consistent page structure
 */
export const SiteShell = component$(() => {
  const { lang } = useI18n()

  useOnDocument(
    'qinit',
    $(() => {
      const logEvent: SiteShellLogEvent = {
        type: 'render',
        timestamp: new Date().toISOString(),
        lang: lang.value,
        path: window.location.pathname,
      }
      console.log('[SiteShell]', logEvent)
    })
  )

  return (
    <div class="site-shell min-h-screen flex flex-col bg-void text-bone">
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-action focus:text-void focus:rounded"
      >
        Skip to main content
      </a>
      <header class="site-header" data-testid="site-header">
        <Slot name="header" />
      </header>
      <main id="main-content" class="site-main flex-1" data-testid="site-main">
        <Slot />
      </main>
      <footer class="site-footer" data-testid="site-footer">
        <Slot name="footer" />
      </footer>
    </div>
  )
})

export type { SiteShellProps, SiteShellLogEvent } from './types'
