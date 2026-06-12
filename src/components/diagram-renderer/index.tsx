/**
 * DiagramRenderer — SVG diagram display component
 *
 * Renders inline SVG via dangerouslySetInnerHTML or external SVG via <img>.
 * Follows textless policy: no text inside SVG, only aria-label for a11y.
 * Wraps in <figure> with optional <figcaption> for accessibility.
 *
 * Styling: dark theme (bg-void, border-bone/10, rounded-xl), max-w-full, overflow-x-auto.
 * Stroke-only manga inking style, OKLCH tokens.
 */
import { component$ } from '@builder.io/qwik'

export interface DiagramRendererProps {
  /** Raw SVG markup string to render inline (dangerouslySetInnerHTML) */
  svg?: string
  /** External SVG file URL to render as <img> */
  src?: string
  /** Required accessible label for the diagram */
  alt: string
  /** Optional caption displayed below the diagram */
  caption?: string
  /** Additional CSS classes for the wrapper <figure> */
  class?: string
}

/**
 * DiagramRenderer — renders SVG diagrams with dark theme styling.
 *
 * Supports two modes:
 * - svg prop: inline SVG rendered via dangerouslySetInnerHTML (SSR-safe)
 * - src prop: external SVG file rendered via <img>
 *
 * Always wrapped in <figure> with aria-label for accessibility.
 */
export const DiagramRenderer = component$<DiagramRendererProps>(
  ({ svg, src, alt, caption, class: className }) => {
    const wrapperClass = [
      'diagram-renderer',
      'bg-void',
      'border border-bone/10',
      'rounded-xl',
      'max-w-full',
      'overflow-x-auto',
      'p-4',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <figure class={wrapperClass}>
        {/* Inline SVG mode */}
        {svg && (
          <div
            class="diagram-renderer__svg w-full [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-w-full"
            role="img"
            aria-label={alt}
            dangerouslySetInnerHTML={svg}
          />
        )}

        {/* External SVG mode */}
        {src && !svg && (
          <img
            src={src}
            alt={alt}
            aria-label={alt}
            class="diagram-renderer__img w-full h-auto max-w-full"
            loading="lazy"
          />
        )}

        {/* Caption */}
        {caption && (
          <figcaption class="diagram-renderer__caption mt-3 text-sm text-bone-muted italic text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }
)
