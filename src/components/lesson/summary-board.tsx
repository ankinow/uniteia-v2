import { component$ } from '@builder.io/qwik'

export interface SummaryBoardProps {
  items: string[]
}

/**
 * SummaryBoard — Checklist-style summary of key points.
 * Each item is prefixed with a vine-coloured checkmark (✓).
 * Built on a depth-card-inspired surface (surface-hud utility).
 */
export const SummaryBoard = component$<SummaryBoardProps>(({ items }) => {
  return (
    <div data-testid="summary-board" class="surface-hud p-6 md:p-8">
      <ul class="flex flex-col gap-3 list-none m-0 p-0">
        {items.map(item => (
          <li key={item} class="flex items-start gap-3 text-bone leading-relaxed">
            <span class="text-[var(--vine)] shrink-0 mt-0.5 text-lg" aria-hidden="true">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
})
