import { $, Slot, component$, useOnDocument } from '@builder.io/qwik'
import { type RequestHandler, useLocation } from '@builder.io/qwik-city'
import { useI18n } from '~/i18n/context'
import { onLanguageNegotiation } from '~/i18n/middleware'
import { useDopamineBudgetProvider } from '~/stores/dopamine-budget'
import { SvgFilters } from './svg-filters'
import type { SiteShellLogEvent, SiteShellProps } from './types'

/**
 * Middleware: Language negotiation
 * Runs on every request to determine user's preferred language
 */
export const onRequest: RequestHandler = onLanguageNegotiation

/**
 * SiteShell - Root layout component
 * Provides consistent page structure
 */
export const SiteShell = component$<SiteShellProps>(({ isApexHost }) => {
  const { lang } = useI18n()
  const location = useLocation()
  const budget = useDopamineBudgetProvider({ isApexHost, location })

  useOnDocument(
    'qinit',
    $(() => {
      const logEvent: SiteShellLogEvent = {
        type: 'render',
        timestamp: new Date().toISOString(),
        lang: lang.value,
        path: window.location.pathname,
      }
      if (import.meta.env.DEV) {
        console.log('[SiteShell]', {
          ...logEvent,
          budget: {
            pathname: budget.pathname,
            routeRemaining: budget.routeBudget.remaining,
            sessionRemaining: budget.sessionBudget.remaining,
            whisperState: budget.whisperState,
            isApexHost: budget.isApexHost,
          },
        })
      }
    })
  )

  return (
    <div
      class="site-shell min-h-screen flex flex-col bg-void text-bone grid-signal"
      data-dopamine-shell-apex={String(budget.isApexHost)}
      data-dopamine-shell-path={budget.pathname}
      data-dopamine-shell-route-remaining={budget.routeBudget.remaining}
      data-dopamine-shell-session-remaining={budget.sessionBudget.remaining}
      data-dopamine-shell-whisper-state={budget.whisperState}
      data-testid="site-shell"
    >
      <SvgFilters />
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
