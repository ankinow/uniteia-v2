import { Slot, component$ } from '@builder.io/qwik'
import { type RequestHandler, useLocation } from '@builder.io/qwik-city'
import { onLanguageNegotiation } from '~/i18n/middleware'
import { useDopamineBudgetProvider } from '~/stores/dopamine-budget'

export const onRequest: RequestHandler = onLanguageNegotiation

export const SiteShell = component$(() => {
  const loc = useLocation()
  useDopamineBudgetProvider({ isApexHost: false, location: loc })

  return (
    <div class="site-shell min-h-screen flex flex-col bg-void text-bone" data-testid="site-shell">
      <a href="#main-content" class="skip-link">
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
