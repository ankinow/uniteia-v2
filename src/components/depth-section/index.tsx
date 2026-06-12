import { Slot, component$ } from '@builder.io/qwik'
import type { DepthPlane, DepthSurfaceProps, DepthVariant } from '~/components/depth/types'

/**
 * Maps the new DepthVariant values to the legacy data-depth attribute
 * so existing CSS selectors (.depth-surface[data-depth="front/mid/back"]) still work.
 */
const mapDepthToDataAttr = (depth: DepthVariant | DepthPlane): DepthPlane => {
  switch (depth) {
    case 'surface':
      return 'front'
    case 'raised':
      return 'mid'
    case 'pressed':
      return 'back'
    default:
      return depth as DepthPlane
  }
}

/**
 * Returns the glass CSS class when glass mode is active, or null otherwise.
 */
const getGlassClass = (depth: DepthVariant | DepthPlane, glass?: boolean): string | null => {
  // DEPRECATED R26: glass variant maps to surface-panel
  if (depth === 'glass-light' || depth === 'glass' || glass) return 'surface-panel'
  return null
}

/**
 * Builds inline style for 2.5D depth effect (perspective + translateZ + scale + shadow).
 */
const build2D5Style = (level: 'back' | 'base' | 'front' | 'floating'): Record<string, string> => {
  switch (level) {
    case 'back':
      return {
        transform: 'translateZ(-20px) scale(0.95)',
        opacity: '0.7',
      }
    case 'base':
      return {
        transform: 'translateZ(0)',
      }
    case 'front':
      return {
        transform: 'translateZ(20px)',
        boxShadow: 'var(--pbr-metalness)',
      }
    case 'floating':
      return {
        transform: 'translateZ(40px)',
        boxShadow: 'var(--pbr-metalness), 0 8px 32px rgba(0,0,0,0.3)',
      }
  }
}

export const DepthSection = component$<DepthSurfaceProps>(
  ({ as = 'section', depth = 'surface', depth2d5, glass, class: classList, ...attrs }) => {
    // Build base classes
    const classes: (string | undefined | null)[] = [
      'surface-hud',
      'depth-surface',
      'depth-section',
      getGlassClass(depth, glass),
    ]

    // Add signal grid class when depth2d5 is active (subtle tech-grid background)
    if (depth2d5) {
      classes.push('grid-signal')
    }

    // Compute data-depth for CSS targeting (backward compatible)
    const dataDepth = mapDepthToDataAttr(depth)

    // Build inline style for 2.5D
    const style2d5 = depth2d5 ? build2D5Style(depth2d5) : undefined

    const sharedProps = {
      ...attrs,
      'data-surface': 'depth-section',
      'data-depth': dataDepth,
      class: [classes, classList],
      style: style2d5,
    }

    switch (as) {
      case 'header':
        return (
          <header {...sharedProps}>
            {/* Microtexture noise overlay when 2.5D is active */}
            {depth2d5 && <div aria-hidden="true" class="noise-mask" />}
            <Slot />
          </header>
        )
      case 'article':
        return (
          <article {...sharedProps}>
            {depth2d5 && <div aria-hidden="true" class="noise-mask" />}
            <Slot />
          </article>
        )
      case 'aside':
        return (
          <aside {...sharedProps}>
            {depth2d5 && <div aria-hidden="true" class="noise-mask" />}
            <Slot />
          </aside>
        )
      case 'div':
        return (
          <div {...sharedProps}>
            {depth2d5 && <div aria-hidden="true" class="noise-mask" />}
            <Slot />
          </div>
        )
      case 'footer':
        return (
          <footer {...sharedProps}>
            {depth2d5 && <div aria-hidden="true" class="noise-mask" />}
            <Slot />
          </footer>
        )
      case 'nav':
        return (
          <nav {...sharedProps}>
            {depth2d5 && <div aria-hidden="true" class="noise-mask" />}
            <Slot />
          </nav>
        )
      default:
        return (
          <section {...sharedProps}>
            {depth2d5 && <div aria-hidden="true" class="noise-mask" />}
            <Slot />
          </section>
        )
    }
  }
)
