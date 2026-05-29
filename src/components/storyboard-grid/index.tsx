/**
 * StoryboardGrid — Editorial CSS Grid layout
 *
 * Replaces the Living Brief collage with indexable, accessible, responsive HTML.
 * Cells are positioned using CSS Grid areas. SVG arrows connect cells.
 * Background texture creates editorial paper feel.
 *
 * Usage:
 *   <StoryboardGrid layout={resolvedLayout} />
 *
 * The layout object comes from article frontmatter, with i18n keys resolved.
 */

import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { StoryboardCell } from './storyboard-cell'
import type { ResolvedLayout } from './types'
import './storyboard-grid.css'

/**
 * Compute SVG arrow paths between cell elements using their DOM positions.
 * Runs client-side only (after hydration).
 */
function computeArrows(
  cells: { id: string; arrowTo?: string[] }[],
  containerEl: HTMLElement
): string[] {
  const paths: string[] = []
  for (const cell of cells) {
    if (!cell.arrowTo || cell.arrowTo.length === 0) continue

    const fromEl = containerEl.querySelector<HTMLElement>(`[data-cell-id="${cell.id}"]`)
    if (!fromEl) continue

    for (const targetId of cell.arrowTo) {
      const toEl = containerEl.querySelector<HTMLElement>(`[data-cell-id="${targetId}"]`)
      if (!toEl) continue

      const fromRect = fromEl.getBoundingClientRect()
      const toRect = toEl.getBoundingClientRect()
      const containerRect = containerEl.getBoundingClientRect()

      // Arrow from right edge of source to top-left of target
      const x1 = fromRect.right - containerRect.left
      const y1 = fromRect.top + fromRect.height / 2 - containerRect.top
      const x2 = toRect.left - containerRect.left
      const y2 = toRect.top + toRect.height / 2 - containerRect.top

      // Straight line with slight curve for visual interest
      const cx = (x1 + x2) / 2
      paths.push(`M${x1},${y1} Q${cx},${y1} ${cx},${y2} T${x2},${y2}`)
    }
  }
  return paths
}

export const StoryboardGrid = component$<{ layout: ResolvedLayout }>(({ layout }) => {
  const gridRef = useSignal<HTMLDivElement>()
  const arrowPaths = useSignal<string[]>([])
  const textureStyle = layout.texture
    ? { backgroundImage: `url(${layout.texture})` }
    : {
        background: '#faf9f6',
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,0,0,0.02) 0%, transparent 50%)',
      }

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const el = gridRef.value
    if (!el) return

    const compute = () => {
      arrowPaths.value = computeArrows(layout.cells, el)
    }

    compute()
    window.addEventListener('resize', compute)
    cleanup(() => window.removeEventListener('resize', compute))
  })

  return (
    <div class="storyboard-wrapper" style={textureStyle}>
      <div
        ref={gridRef}
        class="storyboard-grid"
        style={{
          gridTemplateAreas: layout.gridTemplate,
          gridTemplateColumns: layout.gridColumns,
          gridTemplateRows: layout.gridRows,
        }}
      >
        {layout.cells.map(cell => (
          <StoryboardCell key={cell.id} cell={cell} />
        ))}
      </div>

      {/* SVG arrows layer — rendered only when paths are computed */}
      {arrowPaths.value.length > 0 && (
        <svg class="storyboard-arrows" aria-hidden="true">
          <defs>
            <marker
              id="storyboard-arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#1a1a1a" />
            </marker>
          </defs>
          {arrowPaths.value.map((path, idx) => (
            <path
              key={idx}
              d={path}
              stroke="#1a1a1a"
              strokeWidth={2}
              fill="none"
              {...({ 'marker-end': 'url(#storyboard-arrowhead)' } as any)}
            />
          ))}
        </svg>
      )}

      {/* Grain overlay for texture */}
      <div class="storyboard-grain" aria-hidden="true" />
    </div>
  )
})
