import { component$ } from '@builder.io/qwik'
import type { ResolvedCell } from './types'
import { NoiseCanvas } from './noise-canvas'

/**
 * StoryboardCell — individual editorial cell
 * Renders content based on variant type with consistent editorial styling.
 * Enhanced with noise canvas for insight cells and ripple for CTA cells.
 */
export const StoryboardCell = component$<{ cell: ResolvedCell }>(({ cell }) => {
  const variantClass = `storyboard-cell--${cell.variant}`

  return (
    <article
      class={['storyboard-cell', variantClass].join(' ')}
      style={{ gridArea: cell.gridArea }}
      data-cell-id={cell.id}
      data-variant={cell.variant}
    >
      {/* ── Insight cell (with noise→signal canvas) ── */}
      {cell.variant === 'insight' && (
        <>
          <NoiseCanvas />
          {cell.title && <h3 class="storyboard-cell__title">{cell.title}</h3>}
          {cell.body && <p class="storyboard-cell__body">{cell.body}</p>}
        </>
      )}

      {/* ── Evidence cell (image + caption) ── */}
      {cell.variant === 'evidence' && (
        <>
          {cell.image && (
            <figure class="storyboard-cell__figure">
              <img
                src={cell.image.src}
                alt={cell.image.alt}
                class="storyboard-cell__image"
                loading="lazy"
              />
            </figure>
          )}
          {cell.title && <h3 class="storyboard-cell__title">{cell.title}</h3>}
          {cell.body && <p class="storyboard-cell__body">{cell.body}</p>}
        </>
      )}

      {/* ── Diagram cell (list of features) ── */}
      {cell.variant === 'diagram' && (
        <>
          {cell.title && <h3 class="storyboard-cell__title">{cell.title}</h3>}
          {cell.list && cell.list.length > 0 && (
            <ul class="storyboard-cell__list">
              {cell.list.map((item, idx) => (
                <li key={idx} class="storyboard-cell__list-item">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* ── CTA cell ── */}
      {cell.variant === 'cta' && (
        <div class="storyboard-cell__cta-wrapper">
          {cell.title && <h3 class="storyboard-cell__title">{cell.title}</h3>}
          {cell.body && <p class="storyboard-cell__body">{cell.body}</p>}
          {cell.cta && (
            <a
              href={cell.cta.href}
              class={`storyboard-cell__cta storyboard-cell__cta--${cell.cta.variant}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cell.cta.label}
            </a>
          )}
        </div>
      )}

      {/* ── Metric cell ── */}
      {cell.variant === 'metric' && (
        <div class="storyboard-cell__metric-wrapper">
          <div class="storyboard-cell__metric-value">{cell.metric?.value}</div>
          <div class="storyboard-cell__metric-label">{cell.metric?.label}</div>
          {cell.metric?.delta && (
            <div class="storyboard-cell__metric-delta">{cell.metric.delta}</div>
          )}
        </div>
      )}

      {/* ── Quote cell ── */}
      {cell.variant === 'quote' && (
        <blockquote class="storyboard-cell__quote">
          <p class="storyboard-cell__quote-text">{cell.quote?.text}</p>
          {cell.quote?.source && (
            <footer class="storyboard-cell__quote-source">— {cell.quote.source}</footer>
          )}
        </blockquote>
      )}

      {/* ── Arrow indicator (for cells that connect to others) ── */}
      {cell.arrowTo && cell.arrowTo.length > 0 && (
        <div class="storyboard-cell__arrow-indicator" aria-hidden="true">
          <svg width="24" height="12" viewBox="0 0 24 12">
            <path d="M0,6 L20,6" stroke="currentColor" stroke-width="1.5" fill="none" />
            <polygon points="20,1 24,6 20,11" fill="currentColor" />
          </svg>
        </div>
      )}
    </article>
  )
})
