import { $, Slot, component$, useOnDocument } from '@builder.io/qwik'
import { type RequestHandler, useLocation } from '@builder.io/qwik-city'
import { SiteHeader2D5 } from '~/components/site-header-2d5'
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
      class="site-shell min-h-screen flex flex-col bg-gradient-to-b from-[oklch(0.18_0.02_280)] to-[oklch(0.12_0.03_280)] text-bone grid-signal relative"
      data-dopamine-shell-apex={String(budget.isApexHost)}
      data-dopamine-shell-path={budget.pathname}
      data-dopamine-shell-route-remaining={budget.routeBudget.remaining}
      data-dopamine-shell-session-remaining={budget.sessionBudget.remaining}
      data-dopamine-shell-whisper-state={budget.whisperState}
      data-testid="site-shell"
    >
      <SvgFilters />
      {/* M011 S02: Tactile Warmth — grain 4K + paper fiber overlays */}
      <div
        class="grain-4k fixed inset-0 pointer-events-none z-[var(--z-surface)]"
        aria-hidden="true"
      />
      <div
        class="paper-fiber fixed inset-0 pointer-events-none z-[var(--z-surface)]"
        aria-hidden="true"
      />
      <div class="relative z-[1] flex flex-col min-h-screen">
        <a
          href="#main-content"
          class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[var(--z-overlay)] focus:px-4 focus:py-2 focus:bg-action focus:text-void focus:rounded"
        >
          Skip to main content
        </a>
        <SiteHeader2D5>
          <header class="site-header" data-testid="site-header">
            <Slot name="header" />
          </header>
        </SiteHeader2D5>
        <main id="main-content" class="site-main flex-1" data-testid="site-main">
          <Slot />
        </main>
      </div>
    </div>
  )
})

export type { SiteShellProps, SiteShellLogEvent } from './types'
