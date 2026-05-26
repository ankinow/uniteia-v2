/**
 * ImageCluster — Phase 4 Aether OS visual content cluster
 *
 * Polaroid-style image clusters with tape overlays, rotation jitter,
 * and 3 layout variants (grid, masonry, scatter).
 *
 * Props:
 *   items: ImageClusterItem[] — images with caption, variant, rotation, tape
 *   layout: 'grid' | 'masonry' | 'scatter' (default 'grid')
 *   class?: additional CSS classes
 *
 * Variants per item:
 *   'polaroid' — white border + caption + optional tape
 *   'sticker'  — rounded + shadow, no border
 *   'plain'    — no frame, just image
 *
 * Tape positions: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
 */
import { Slot, component$ } from '@builder.io/qwik'
import type { ClassList } from '@builder.io/qwik'

export type ClusterLayout = 'grid' | 'masonry' | 'scatter'
export type ImageVariant = 'polaroid' | 'sticker' | 'plain'
export type TapePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface ImageClusterItem {
  src: string
  alt: string
  caption?: string
  variant?: ImageVariant
  rotation?: number
  tape?: TapePosition
}

export interface ImageClusterProps {
  items: ImageClusterItem[]
  layout?: ClusterLayout
  class?: ClassList
}

export const ImageCluster = component$<ImageClusterProps>(
  ({ items, layout = 'grid', class: className }) => {
    if (!items.length) return null

    return (
      <section
        class={['image-cluster', `image-cluster--${layout}`, className]}
        data-layout={layout}
        data-testid="image-cluster"
        aria-label="Image cluster"
      >
        {items.map((item, i) => {
          const variant = item.variant ?? 'polaroid'
          const rot = item.rotation ?? (layout === 'scatter' ? ((i % 3) - 1) * 3 : 0)

          return (
            <figure
              key={`${item.src}-${i}`}
              class={[
                'image-cluster__item',
                `image-cluster__item--${variant}`,
                item.tape ? `image-cluster__item--tape-${item.tape}` : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ transform: `rotate(${rot}deg)` }}
              data-index={i}
            >
              {/* Tape overlay */}
              {item.tape && (
                <div class="image-cluster__tape" data-position={item.tape} aria-hidden="true" />
              )}

              {/* Image */}
              <img
                class={[
                  'image-cluster__img',
                  variant === 'polaroid' ? 'image-cluster__img--polaroid' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
              />

              {/* Caption for polaroid variant */}
              {item.caption && variant === 'polaroid' && (
                <figcaption class="image-cluster__caption">{item.caption}</figcaption>
              )}

              {/* Slot for overlay content per item */}
              <Slot name={`item-${i}`} />
            </figure>
          )
        })}
      </section>
    )
  }
)
