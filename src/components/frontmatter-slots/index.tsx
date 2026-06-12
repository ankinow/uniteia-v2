import { component$ } from '@builder.io/qwik'
import { HudLabel } from '~/components/hud-label'
import { ScratchDivider } from '~/components/scratch-divider'
import { formatRelativeTime } from '~/utils/time-utils'
import type { FrontmatterSlotsProps } from './types'

const LANG_LABELS: Record<string, string> = {
  en: 'EN',
  pt: 'PT',
  es: 'ES',
  ja: '日本語',
  zh: '中文',
}

const DEFAULT_LABELS = {
  subjectsLabel: 'Subjects',
  byAuthor: 'by {author}',
  version: 'v{version}',
  readInLang: 'Read in {lang}',
}

export const FrontmatterSlots = component$<FrontmatterSlotsProps>(props => {
  const labels = props.labels ?? DEFAULT_LABELS
  const langLabel = LANG_LABELS[props.lang] ?? props.lang.toUpperCase()
  const hasSubjects = props.subjects.length > 0
  const hasMetadata = Boolean(props.metadata)

  return (
    <div
      data-testid="frontmatter-slots"
      class={[
        'frontmatter-slots',
        'hud-panel',
        'surface-pixel',
        'mt-6 flex flex-col gap-4 p-4',
        props.class,
      ]}
    >
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

      {props.metadata && (
        <div class="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-bone-muted">
          {props.metadata.author && (
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-neon-cyan/20 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan font-bold text-xs overflow-hidden">
                {props.metadata.author?.[0]?.toUpperCase?.() ?? 'U'}
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] uppercase tracking-wider opacity-50 font-mono">
                  Author
                </span>
                <span class="text-bone font-medium">{props.metadata.author}</span>
              </div>
            </div>
          )}

          {props.metadata.created_at && (
            <div class="flex flex-col">
              <span class="text-[10px] uppercase tracking-wider opacity-50 font-mono">
                Published
              </span>
              <span
                class="text-bone/80 tabular-nums"
                title={new Date(props.metadata.created_at).toLocaleDateString(props.lang)}
              >
                {formatRelativeTime(props.metadata.created_at, props.lang)}
              </span>
            </div>
          )}

          {props.metadata.updated_at && props.metadata.updated_at !== props.metadata.created_at && (
            <div class="flex flex-col border-l border-white/5 pl-6">
              <span class="text-[10px] uppercase tracking-wider opacity-50 font-mono">Updated</span>
              <span
                class="text-bone/80 tabular-nums"
                title={new Date(props.metadata.updated_at).toLocaleDateString(props.lang)}
              >
                {formatRelativeTime(props.metadata.updated_at, props.lang)}
              </span>
            </div>
          )}

          {props.metadata.version != null && (
            <div class="flex flex-col border-l border-white/5 pl-6">
              <span class="text-[10px] uppercase tracking-wider opacity-50 font-mono">Version</span>
              <span class="text-neon-amber font-mono">v{props.metadata.version}</span>
            </div>
          )}
        </div>
      )}

      <div class="flex items-center gap-2">
        <HudLabel
          label={labels.readInLang.replace('{lang}', langLabel)}
          tone="action"
          surface="frontmatter"
        />
      </div>
    </div>
  )
})

export type { FrontmatterSlotsProps, FrontmatterLabels, ArticleMetadataSlots } from './types'
