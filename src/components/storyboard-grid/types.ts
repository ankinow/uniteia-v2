/**
 * StoryboardGrid — Editorial CSS Grid layout
 * Replaces the Living Brief collage with indexable, accessible, responsive HTML.
 *
 * Cell variants:
 *   insight   — title + paragraph (insight-driven)
 *   evidence  — image + caption
 *   diagram   — icon/SVG + feature list
 *   cta       — CTA button + badge + microcopy
 *   metric    — large number + label + delta
 *   quote     — blockquote + attribution
 */

export type CellVariant =
  | 'insight'
  | 'evidence'
  | 'diagram'
  | 'cta'
  | 'metric'
  | 'quote'

export interface StoryboardCell {
  id: string
  variant: CellVariant
  gridArea: string
  title?: string
  body?: string
  image?: { src: string; alt: string }
  list?: string[]
  cta?: { label: string; href: string; variant: 'primary' | 'secondary' }
  metric?: { value: string; label: string; delta?: string }
  quote?: { text: string; source: string }
  /** Cells this cell's arrow points TO (SVG arrow drawn between grid areas) */
  arrowTo?: string[]
}

export interface StoryboardLayout {
  version: '2.0'
  /** Path to background texture image (or empty for CSS-only) */
  texture?: string
  /** CSS grid-template-areas value */
  gridTemplate: string
  gridColumns: string
  gridRows: string
  cells: StoryboardCell[]
}

/** Resolved storyboard layout with i18n text already loaded */
export interface ResolvedLayout {
  version: '2.0'
  texture?: string
  gridTemplate: string
  gridColumns: string
  gridRows: string
  cells: ResolvedCell[]
}

export interface ResolvedCell {
  id: string
  variant: CellVariant
  gridArea: string
  title?: string
  body?: string
  image?: { src: string; alt: string }
  list?: string[]
  cta?: { label: string; href: string; variant: 'primary' | 'secondary' }
  metric?: { value: string; label: string; delta?: string }
  quote?: { text: string; source: string }
  arrowTo?: string[]
}
