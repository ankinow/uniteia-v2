import { component$ } from '@builder.io/qwik'
import type { SourceLedgerProps } from './types'

const DEFAULT_SOURCES_LABEL = 'Sources'

export const SourceLedger = component$<SourceLedgerProps>(props => {
  if (props.referralLinks.length === 0) {
    return null
  }

  const sourcesLabel = props.sourcesLabel ?? DEFAULT_SOURCES_LABEL

  return (
    <nav
      data-testid="source-ledger"
      class={['source-ledger', 'mt-8 border-t border-mid pt-6', props.class]}
      aria-label={sourcesLabel}
    >
      <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-bone-muted">
        {sourcesLabel}
      </h2>
      <ul class="flex flex-col gap-3">
        {props.referralLinks.map(link => (
          <li key={link.url} class="group">
            <a
              href={link.url}
              rel="noopener noreferrer nofollow"
              target="_blank"
              class={[
                'flex flex-col gap-0.5',
                'rounded-md px-3 py-2',
                'bg-deep/50',
                'border border-mid/50',
                'transition-colors duration-base',
                'hover:border-action/40 hover:bg-deep',
              ]}
            >
              <span class="text-sm font-medium text-action group-hover:text-action-hover transition-colors duration-base">
                {link.title}
              </span>
              {link.description && (
                <span class="text-xs text-bone-muted leading-relaxed">{link.description}</span>
              )}
              <span class="mt-0.5 truncate font-mono text-xs text-bone-muted opacity-60">
                {link.url}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
})

export type { SourceLedgerProps, ReferralLinkSlot } from './types'
