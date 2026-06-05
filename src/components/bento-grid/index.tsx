import { type ClassList, Slot, component$ } from '@builder.io/qwik'
import styles from './bento-grid.module.css'

export type BentoCellSize = 'default' | 'wide' | 'tall' | 'featured'

export interface BentoGridProps {
  class?: ClassList
  minCellWidth?: string
  cellHeight?: string
  gap?: string
}

export interface BentoCellProps {
  size?: BentoCellSize
  class?: ClassList
  as?: 'div' | 'article' | 'section'
}

/**
 * BentoGrid — modular CSS Grid layout (SOTA 2026)
 *
 * Container: CSS Grid with `auto-fit` + `minmax(280px, 1fr)` — zero media queries.
 * Cells: variants for 1x1 (default), 2x1 (wide), 1x2 (tall), 2x2 (featured).
 * Container queries: wide/featured cells collapse to 1 col on narrow viewports.
 *
 * Usage:
 *   <BentoGrid>
 *     <BentoCell size="featured">Hero</BentoCell>
 *     <BentoCell size="wide">Top article</BentoCell>
 *     <BentoCell>Standard cell</BentoCell>
 *   </BentoGrid>
 *
 * Bundle: 0 KB JS (purely structural, all styling via scoped CSS module).
 */
export const BentoGrid = component$<BentoGridProps>(
  ({ class: className, minCellWidth = '280px', cellHeight = '200px', gap = '1rem' }) => {
    return (
      <div
        class={[styles.container, className]}
        style={{
          '--bento-min-w': minCellWidth,
          '--bento-cell-h': cellHeight,
          '--bento-gap': gap,
        }}
      >
        <Slot />
      </div>
    )
  }
)

/**
 * BentoCell — single grid item with size variant.
 * Renders the slotted children inside a styled container.
 */
export const BentoCell = component$<BentoCellProps>(
  ({ size = 'default', class: className, as = 'div' }) => {
    const Tag = as
    const sizeClass =
      size === 'featured'
        ? styles.featured
        : size === 'wide'
          ? styles.wide
          : size === 'tall'
            ? styles.tall
            : ''
    return (
      <Tag class={[styles.cell, sizeClass, className]}>
        <Slot />
      </Tag>
    )
  }
)
