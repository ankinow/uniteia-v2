import { component$ } from '@builder.io/qwik'
import type { FrontmatterSlotsProps } from './types'

/**
 * Language display labels for the lang indicator pill
 * Maps ISO 639-1 codes to native script labels
 */
const LANG_LABELS: Record<string, string> = {
  en: 'EN',
  pt: 'PT',
  es: 'ES',
  ja: '日本語',
  zh: '中文',
}

/**
 * Default English labels when i18n context is not available
 */
const DEFAULT_LABELS = {
  subjectsLabel: 'Subjects',
  published: 'Published',
  updated: 'Updated',
  byAuthor: 'by {author}',
  version: 'v{version}',
  readInLang: 'Read in {lang}',
}

/**
 * FrontmatterSlots - Article metadata display component
 *
 * Renders three metadata sections below the article header:
 * 1. Subjects as colored tag pills (curation/bronze theme)
 * 2. Timestamps in monospace format with optional author/version
 * 3. Language indicator pill
 *
 * Follows S01 isolation pattern with types.ts + index.tsx.
 */
export const FrontmatterSlots = component$<FrontmatterSlotsProps>(props => {
  const labels = props.labels ?? DEFAULT_LABELS

  return (
    <div
      data-testid="frontmatter-slots"
      class={['frontmatter-slots', 'mt-6 flex flex-col gap-4', props.class]}
    >
      {/* Subject tag pills */}
      {props.subjects.length > 0 && (
        <div class="flex flex-wrap items-center gap-2" aria-label={labels.subjectsLabel}>
          {props.subjects.map(subject => (
            <span
              key={subject}
              class={[
                'inline-flex items-center',
                'rounded-full px-3 py-0.5',
                'text-xs font-medium',
                'bg-curation/15 text-curation',
                'border border-curation/25',
                'transition-colors duration-base',
              ]}
            >
              {subject}
            </span>
          ))}
        </div>
      )}

      {/* Timestamps row */}
      {props.metadata && (
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-bone-muted">
          {props.metadata.created_at && (
            <time dateTime={props.metadata.created_at} class="font-mono text-xs text-bone-muted">
              {labels.published}: {props.metadata.created_at}
            </time>
          )}
          {props.metadata.updated_at && (
            <time dateTime={props.metadata.updated_at} class="font-mono text-xs text-bone-muted">
              {labels.updated}: {props.metadata.updated_at}
            </time>
          )}
          {props.metadata.author && (
            <span class="text-xs text-bone-muted">
              {labels.byAuthor.replace('{author}', props.metadata.author)}
            </span>
          )}
          {props.metadata.version != null && (
            <span class="font-mono text-xs text-bone-muted">
              {labels.version.replace('{version}', String(props.metadata.version))}
            </span>
          )}
        </div>
      )}

      {/* Language indicator pill */}
      <div class="flex items-center">
        <span
          class={[
            'inline-flex items-center',
            'rounded px-2 py-0.5',
            'text-xs font-mono font-medium uppercase tracking-wider',
            'bg-action/15 text-action',
            'border border-action/25',
          ]}
          aria-label={`Language: ${props.lang}`}
        >
          {LANG_LABELS[props.lang] ?? props.lang.toUpperCase()}
        </span>
      </div>
    </div>
  )
})

export type { FrontmatterSlotsProps, FrontmatterLabels, ArticleMetadataSlots } from './types'
