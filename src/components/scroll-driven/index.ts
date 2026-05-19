/**
 * Scroll-Driven Narrative — Fase 3
 *
 * Barrel export for scroll-driven animation components and hooks.
 * Mixed UI: light canvas content + dark compact interfaces, UE5 illusion in motion.
 *
 * Components:
 * - ScrollHeroOrganism: 5-layer parallax hero with velocity glow
 * - ScrollContentCanvas: light canvas reacting to scroll (grain intensify, character wake)
 * - ScrollDepthCardEnhancer: wrapper injecting scroll-driven depth + neural glow
 * - SidebarScrollGlow: dark compact sidebar with scanline + glow progression
 *
 * Hooks:
 * - useScrollObserver: centralized scroll velocity + dwell detection (rAF-batched)
 */

export { ScrollHeroOrganism, useScrollObserver } from './scroll-hero-organism'
export type { ParallaxLayer, ScrollHeroOrganismProps, ScrollMetrics } from './scroll-hero-organism'

export { ScrollContentCanvas } from './scroll-content-canvas'
export type { ScrollContentCanvasProps } from './scroll-content-canvas'

export { ScrollDepthCardEnhancer } from './scroll-depth-card-enhancer'
export type { ScrollDepthCardEnhancerProps } from './scroll-depth-card-enhancer'

export { SidebarScrollGlow } from './sidebar-scroll-glow'
export type { SidebarScrollGlowProps } from './sidebar-scroll-glow'
