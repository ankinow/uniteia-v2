import { component$ } from '@builder.io/qwik'

export interface AnalogyBoxProps {
  analogy: string
}

/**
 * AnalogyBox — Paper-styled analogy explanation box.
 * Uses the paper CSS custom properties for background, text, and border.
 * Visual style resembles a post-it / paper note.
 */
export const AnalogyBox = component$<AnalogyBoxProps>(({ analogy }) => {
  return (
    <div
      data-testid="analogy-box"
      class="p-6 md:p-8"
      style={{
        backgroundColor: 'var(--paper-bg)',
        color: 'var(--paper-text)',
        border: 'var(--paper-border)',
      }}
    >
      <p class="text-base md:text-lg leading-relaxed italic mb-0">{analogy}</p>
    </div>
  )
})
