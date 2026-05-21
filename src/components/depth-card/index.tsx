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
  const hasDepth = depth2d5 || depth === 'glass-light' || glass || depth === 'glass'
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
  ({
    as = 'div',
    depth = 'surface',
    depth2d5: depth2d5Prop,
    glass: glassProp,
    variant,
    class: classList,
    ...attrs
  }) => {
    const variantDefaults =
      variant === 'glass'
        ? { glass: true, depth2d5: 'base' as const }
        : variant === 'cinematic'
          ? { glass: false, depth2d5: 'floating' as const }
          : variant === 'paper'
            ? { glass: false, depth2d5: 'back' as const }
            : {}

    const depth2d5 = depth2d5Prop ?? variantDefaults.depth2d5
    const glass =
      glassProp !== undefined
        ? glassProp
        : 'glass' in variantDefaults
          ? variantDefaults.glass
          : undefined
    const isCinematic = variant === 'cinematic'
    const isPaper = variant === 'paper'

    const visualUpgrade = getVisualUpgradeClass(depth, depth2d5, glass)
    const classes: (string | undefined | null)[] = [
      'surface-hud',
      'depth-surface',
      'depth-card',
      visualUpgrade ? null : getGlassClass(depth, glass),
      visualUpgrade,
      isCinematic ? 'neon-edge' : null,
    ]

    const dataDepth = mapDepthToDataAttr(depth)
    const style2d5 = depth2d5 ? build2D5Style(depth2d5) : undefined
    const showGrain = !!getVisualUpgradeClass(depth, depth2d5, glass)

    const sharedProps = {
      ...attrs,
      'data-surface': 'depth-card',
      'data-depth': dataDepth,
      ...(visualUpgrade ? { 'data-blur': 'lg' } : {}),
      class: [classes, classList],
      style: style2d5,
    }

    const inner = (
      <>
        {showGrain && (
          <div
            class="grain-4k absolute inset-0 pointer-events-none z-[var(--z-surface)]"
            aria-hidden="true"
          />
        )}
        {isPaper && (
          <div class="paper-fiber absolute inset-0 pointer-events-none" aria-hidden="true" />
        )}
        <Slot />
      </>
    )

    switch (as) {
      case 'header':
        return <header {...sharedProps}>{inner}</header>
      case 'article':
        return <article {...sharedProps}>{inner}</article>
      case 'aside':
        return <aside {...sharedProps}>{inner}</aside>
      case 'section':
        return <section {...sharedProps}>{inner}</section>
      case 'footer':
        return <footer {...sharedProps}>{inner}</footer>
      case 'nav':
        return <nav {...sharedProps}>{inner}</nav>
      default:
        return <div {...sharedProps}>{inner}</div>
    }
  }
)

export type { DepthCardVariant } from '~/components/depth/types'
