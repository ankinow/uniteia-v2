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
  if (depth === 'glass-heavy') return 'glass-heavy'
  if (depth === 'glass-light') return 'glass-light'
  if (glass || depth === 'glass') return 'glass'
  return null
}

/**
 * Returns ue5-illusion and glass-2-5d classes when the card has depth or glass active
 * (Σ LOAD refinement — zero API break).
 */
const getVisualUpgradeClass = (
  depth: DepthVariant | DepthPlane,
  depth2d5?: 'back' | 'base' | 'front' | 'floating',
  glass?: boolean
): string | null => {
  const hasDepth =
    depth2d5 || depth === 'glass-heavy' || depth === 'glass-light' || glass || depth === 'glass'
  return hasDepth ? 'ue5-illusion glass-2-5d' : null
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

export const DepthCard = component$<DepthSurfaceProps>(
  ({ as = 'div', depth = 'surface', depth2d5, glass, class: classList, ...attrs }) => {
    // Build base classes
    const visualUpgrade = getVisualUpgradeClass(depth, depth2d5, glass)
    const classes: (string | undefined | null)[] = [
      'surface-hud',
      'depth-surface',
      'depth-card',
      visualUpgrade ? null : getGlassClass(depth, glass),
      visualUpgrade,
      visualUpgrade ? 'glassmorphism-2' : null,
    ]

    // Compute data-depth for CSS targeting (backward compatible)
    const dataDepth = mapDepthToDataAttr(depth)

    // Build inline style for 2.5D
    const style2d5 = depth2d5 ? build2D5Style(depth2d5) : undefined
    const showGrain = !!getVisualUpgradeClass(depth, depth2d5, glass)

    const sharedProps = {
      ...attrs,
      'data-surface': 'depth-card',
      'data-depth': dataDepth,
      class: [classes, classList],
      style: style2d5,
    }

    switch (as) {
      case 'header':
        return (
          <header {...sharedProps}>
            {showGrain && (
              <div
                class="grain-4k absolute inset-0 pointer-events-none z-[var(--z-surface)]"
                aria-hidden="true"
              />
            )}
            <Slot />
          </header>
        )
      case 'article':
        return (
          <article {...sharedProps}>
            {showGrain && (
              <div
                class="grain-4k absolute inset-0 pointer-events-none z-[var(--z-surface)]"
                aria-hidden="true"
              />
            )}
            <Slot />
          </article>
        )
      case 'aside':
        return (
          <aside {...sharedProps}>
            {showGrain && (
              <div
                class="grain-4k absolute inset-0 pointer-events-none z-[var(--z-surface)]"
                aria-hidden="true"
              />
            )}
            <Slot />
          </aside>
        )
      case 'section':
        return (
          <section {...sharedProps}>
            {showGrain && (
              <div
                class="grain-4k absolute inset-0 pointer-events-none z-[var(--z-surface)]"
                aria-hidden="true"
              />
            )}
            <Slot />
          </section>
        )
      case 'footer':
        return (
          <footer {...sharedProps}>
            {showGrain && (
              <div
                class="grain-4k absolute inset-0 pointer-events-none z-[var(--z-surface)]"
                aria-hidden="true"
              />
            )}
            <Slot />
          </footer>
        )
      case 'nav':
        return (
          <nav {...sharedProps}>
            {showGrain && (
              <div
                class="grain-4k absolute inset-0 pointer-events-none z-[var(--z-surface)]"
                aria-hidden="true"
              />
            )}
            <Slot />
          </nav>
        )
      default:
        return (
          <div {...sharedProps}>
            {showGrain && (
              <div
                class="grain-4k absolute inset-0 pointer-events-none z-[var(--z-surface)]"
                aria-hidden="true"
              />
            )}
            <Slot />
          </div>
        )
    }
  }
)
