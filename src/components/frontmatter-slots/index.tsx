import { component$ } from '@builder.io/qwik'
import { HudLabel } from '~/components/hud-label'
import { ScratchDivider } from '~/components/scratch-divider'
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
  const langLabel = LANG_LABELS[props.lang] ?? props.lang.toUpperCase()
  const hasSubjects = props.subjects.length > 0
  const hasMetadata = Boolean(props.metadata)

  return (
    <div
      data-testid="frontmatter-slots"
      class={['frontmatter-slots', 'hud-panel', 'mt-6 flex flex-col gap-4 p-4', props.class]}
    >
      {/* Subject tag pills */}
      {hasSubjects && (
        <div class="flex flex-wrap items-center gap-2" aria-label={labels.subjectsLabel}>
          <HudLabel label={labels.subjectsLabel} tone="curation" surface="frontmatter" />
          {props.subjects.map(subject => (
            <span
              key={subject}
              class={[
                'inline-flex items-center',
                'border border-curation/25 bg-curation/15 px-3 py-0.5',
                'text-xs font-medium text-curation',
              ]}
            >
              {subject}
            </span>
          ))}
        </div>
      )}

      {(hasSubjects || hasMetadata) && (
        <ScratchDivider tone="curation" surface="frontmatter" class="opacity-80" />
      )}

      {/* Timestamps row */}
      {props.metadata && (
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-bone-muted">
          {props.metadata.created_at && (
            <div class="flex items-center gap-2">
              <HudLabel label={labels.published} tone="muted" surface="frontmatter" />
              <time dateTime={props.metadata.created_at} class="font-mono text-xs text-bone-muted">
                {props.metadata.created_at}
              </time>
            </div>
          )}
          {props.metadata.updated_at && (
            <div class="flex items-center gap-2">
              <HudLabel label={labels.updated} tone="muted" surface="frontmatter" />
              <time dateTime={props.metadata.updated_at} class="font-mono text-xs text-bone-muted">
                {props.metadata.updated_at}
              </time>
            </div>
          )}
          {props.metadata.author && (
            <div class="flex items-center gap-2 text-xs text-bone-muted">
              <HudLabel
                label={labels.byAuthor.replace('{author}', props.metadata.author)}
                tone="muted"
                surface="frontmatter"
              />
            </div>
          )}
          {props.metadata.version != null && (
            <div class="flex items-center gap-2">
              <HudLabel
                label={labels.version.replace('{version}', String(props.metadata.version))}
                tone="action"
                surface="frontmatter"
              />
            </div>
          )}
        </div>
      )}

      {/* Language indicator */}
      <div class="flex items-center gap-2">
        <HudLabel
          label={labels.readInLang.replace('{lang}', langLabel)}
          tone="action"
          surface="frontmatter"
        />
        <span class="text-xs text-bone-muted">{langLabel}</span>
      </div>
    </div>
  )
})

export type { FrontmatterSlotsProps, FrontmatterLabels, ArticleMetadataSlots } from './types'
