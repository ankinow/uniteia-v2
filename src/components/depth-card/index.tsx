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
 * Returns the pixel-gold-rim class when depth variant is active.
 * Neo Pixel × Sunset Saga — zero blur, pixel borders only.
 */
const getPixelClass = (depth: DepthVariant | DepthPlane): string | null => {
  if (depth === 'glass-light' || depth === 'glass') return 'pixel-gold-rim'
  return null
}

/**
 * Returns sunset-pixel visual upgrade for cards with depth.
 * Neo Pixel × Sunset Saga — pixel borders + sunset sheen.
 */
const getVisualUpgradeClass = (
  depth: DepthVariant | DepthPlane,
  depth2d5?: 'back' | 'base' | 'front' | 'floating',
  glass?: boolean
): string | null => {
  const hasDepth = depth2d5 || depth === 'glass-light' || glass || depth === 'glass'
  return hasDepth ? 'sunset-sheen surface-pixel' : null
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
            : variant === 'collage-editorial'
              ? { glass: false, depth2d5: 'floating' as const }
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
    const isCollageEditorial = variant === 'collage-editorial'

    const visualUpgrade = getVisualUpgradeClass(depth, depth2d5, glass)
    const classes: (string | undefined | null)[] = [
      'surface-hud',
      'depth-surface',
      'depth-card',
      visualUpgrade ? null : getPixelClass(depth),
      visualUpgrade,
      isCinematic ? 'pixel-gold-rim' : null,
      isCollageEditorial
        ? 'corkboard paper-real-texture ink-effect scrapbook-layer clip-diagonal-a'
        : null,
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
        {isCollageEditorial && (
          <>
            <div class="scrapbook-layer absolute inset-0 pointer-events-none" aria-hidden="true">
              <span class="corkboard-layer" />
              <div class="paper-real-texture" aria-hidden="true" />
              <div class="ink-effect" data-intensity="medium" />
            </div>
            <div class="clip-diagonal-a" aria-hidden="true" />
          </>
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
