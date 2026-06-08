import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'

export interface TOCEntry {
  id: string
  text: string
  level: number
}

/**
 * TableOfContents — Sticky list of headings for easy navigation.
 * Scans for H2 and H3 tags in the article content.
 */
export const TableOfContents = component$(() => {
  const entries = useSignal<TOCEntry[]>([])
  const activeId = useSignal<string>('')

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const findHeadings = () => {
      const headings = document.querySelectorAll('article h2, article h3')
      const newEntries: TOCEntry[] = []

      headings.forEach((h, idx) => {
        if (!h.id) {
          // Generate ID if missing
          h.id = `heading-${idx}-${h.textContent?.toLowerCase().replace(/\s+/g, '-')}`
        }
        newEntries.push({
          id: h.id,
          text: h.textContent || '',
          level: Number.parseInt(h.tagName?.[1] ?? '2'),
        })
      })
      entries.value = newEntries
    }

    findHeadings()

    // Intersection Observer to highlight active heading
    const observer = new IntersectionObserver(
      items => {
        const visible = items.filter(i => i.isIntersecting)
        if (visible.length > 0) {
          activeId.value = visible[0]?.target?.id ?? ''
        }
      },
      { rootMargin: '-10% 0px -80% 0px' }
    )

    document.querySelectorAll('article h2, article h3').forEach(h => observer.observe(h))

    return () => observer.disconnect()
  })

  if (entries.value.length === 0) return null

  return (
    <nav class="toc space-y-4" aria-label="Table of contents">
      <h3 class="text-xs uppercase tracking-[0.2em] text-bone/30 font-mono mb-4">Content Index</h3>
      <ul class="space-y-2.5">
        {entries.value.map(entry => (
          <li
            key={entry.id}
            class={['transition-all duration-200', entry.level === 3 ? 'pl-4' : '']}
          >
            <a
              href={`#${entry.id}`}
              onClick$={() => {
                activeId.value = entry.id
              }}
              class={[
                'block text-sm leading-tight transition-colors',
                activeId.value === entry.id
                  ? 'text-neon-cyan font-medium translate-x-1'
                  : 'text-bone/50 hover:text-bone',
              ]}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
})
