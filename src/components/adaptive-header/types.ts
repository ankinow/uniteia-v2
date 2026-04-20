/**
 * AdaptiveHeader component props
 * Renders title + optional subtitle with viewport-aware responsive typography
 */
export interface AdaptiveHeaderProps {
  /** Main title text */
  title: string
  /** Optional subtitle displayed below the title */
  subtitle?: string
  /** Optional CSS class for additional styling */
  class?: string
}

/**
 * Typography breakpoint scale for AdaptiveHeader
 * Maps viewport sizes to font-size / line-height pairs
 *
 * - small:  28px / 36px (text-2xl + leading-9)
 * - medium: 36px / 44px (text-4xl + leading-11)
 * - large:  48px / 60px (text-5xl + leading-tight)
 */
export interface AdaptiveHeaderScale {
  small: { fontSize: string; lineHeight: string }
  medium: { fontSize: string; lineHeight: string }
  large: { fontSize: string; lineHeight: string }
}
