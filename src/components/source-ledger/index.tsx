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
      class={['source-ledger', 'mt-12 border-t border-mid pt-8', props.class]}
      aria-label={sourcesLabel}
    >
      <h2 class="mb-6 font-display text-xs font-medium uppercase tracking-[0.2em] text-bone-muted">
        {sourcesLabel}
      </h2>
      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {props.referralLinks.map(link => (
          <li key={link.url} class="group">
            <a
              href={link.url}
              rel="noopener noreferrer nofollow"
              target="_blank"
              class={[
                'flex h-full flex-col justify-between gap-2',
                'px-4 py-4',
                'bg-deep/30',
                'border border-mid/30',
                'transition-colors duration-base ease-solar',
                'hover:border-action/40 hover:bg-deep/60 whisper-hover',
              ]}
            >
              <div class="flex flex-col gap-1">
                <span class="font-display text-base font-normal leading-tight text-bone group-hover:text-action transition-colors duration-base">
                  {link.title}
                </span>
                {link.description && (
                  <span class="text-xs text-bone-muted leading-relaxed line-clamp-2">
                    {link.description}
                  </span>
                )}
              </div>
              <span class="truncate font-mono text-[10px] uppercase tracking-wider text-bone-muted opacity-40">
                {new URL(link.url).hostname}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
})

export type { SourceLedgerProps, ReferralLinkSlot } from './types'
