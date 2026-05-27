/**
 * sketchify-svg.ts — Convert existing SVGs to Aether Hand-Drawn style
 * UniTeia v2 | MoodboardAether Pipeline
 *
 * Uses Rough.js to redraw SVG elements with sketchy/hand-drawn aesthetics.
 * Converts clean vector icons (Phosphor, Lucide, unDraw) into the Aether
 * editorial style with controlled roughness, hachure fills, and wobble.
 *
 * Part of Zero Image Models pipeline — no GPU/API calls, pure client-side.
 *
 * @see ADR-014 Visual Asset Forge
 * @see Kimi Agent Visual Content Proposal §4.2-4.3
 */

import rough from 'roughjs'

/** Configuration for sketchy rendering */
export interface SketchifyConfig {
  /** Roughness level (0 = clean, 3 = very sketchy). Default: 1.5 */
  roughness?: number
  /** Line bowing distortion (0 = straight, 2 = very curved). Default: 1.0 */
  bowing?: number
  /** Fill style: hachure (cross-hatch), solid, zigzag, dots, etc. Default: 'hachure' */
  fillStyle?: 'hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots' | 'dashed'
  /** Hachure angle in degrees. Default: 60 */
  hachureAngle?: number
  /** Gap between hachure lines. Default: 6 */
  hachureGap?: number
  /** Stroke color override. Default: 'oklch(0.55 0.15 270)' (indigo) */
  strokeColor?: string
  /** Fill color override. Default: semi-transparent parchment */
  fillColor?: string
  /** Stroke width. Default: 2 */
  strokeWidth?: number
}

export const DEFAULT_SKETCHIFY_CONFIG: Required<SketchifyConfig> = {
  roughness: 1.5,
  bowing: 1.0,
  fillStyle: 'hachure',
  hachureAngle: 60,
  hachureGap: 6,
  strokeColor: 'oklch(0.55 0.15 270)',
  fillColor: 'oklch(0.95 0.01 80 / 0.25)',
  strokeWidth: 2,
}

/**
 * Converts an SVG string to a Rough.js sketchy version.
 *
 * This renders the original SVG into a hidden container, extracts
 * path/shape data, then re-renders with Rough.js sketchy style.
 *
 * @param svgString - Original SVG markup string
 * @param config - Sketchify configuration
 * @returns New SVG string with hand-drawn aesthetics applied
 */
export function sketchifySvg(
  svgString: string,
  config: Partial<SketchifyConfig> = {}
): string {
  const cfg = { ...DEFAULT_SKETCHIFY_CONFIG, ...config }

  // Create a hidden container to parse the SVG
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.visibility = 'hidden'
  container.style.width = '0'
  container.style.height = '0'
  container.style.overflow = 'hidden'
  container.innerHTML = svgString
  document.body.appendChild(container)

  const originalSvg = container.querySelector('svg')
  if (!originalSvg) {
    document.body.removeChild(container)
    return svgString // fallback: return original
  }

  const viewBox = originalSvg.getAttribute('viewBox') || '0 0 800 500'
  const [vbX, vbY, vbW, vbH] = viewBox.split(/\s+/).map(Number)

  // Create new SVG for sketchy output
  const outputSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  outputSvg.setAttribute('viewBox', viewBox)
  outputSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  outputSvg.setAttribute('width', String(vbW))
  outputSvg.setAttribute('height', String(vbH))

  // Add Aether grain filter
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  defs.innerHTML = `
    <filter id="sketchify-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer>
    </filter>
    <filter id="sketchify-wobble">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3"/>
      <feDisplacementMap in="SourceGraphic" scale="2.5"/>
    </filter>
  `
  outputSvg.appendChild(defs)

  // Grain overlay
  const grain = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  grain.setAttribute('x', '0')
  grain.setAttribute('y', '0')
  grain.setAttribute('width', String(vbW))
  grain.setAttribute('height', String(vbH))
  grain.setAttribute('fill', 'none')
  grain.setAttribute('filter', 'url(#sketchify-grain)')
  grain.setAttribute('pointer-events', 'none')
  grain.style.opacity = '0.40'
  outputSvg.appendChild(grain)

  // Use Rough.js to redraw paths and shapes
  const rc = rough.svg(outputSvg)

  // Process all <path> elements
  const paths = originalSvg.querySelectorAll('path')
  for (const path of paths) {
    const d = path.getAttribute('d')
    const fill = path.getAttribute('fill')
    const stroke = path.getAttribute('stroke')

    if (!d) continue

    try {
      const sketchyPath = rc.path(d, {
        stroke: stroke || cfg.strokeColor,
        strokeWidth: cfg.strokeWidth,
        roughness: cfg.roughness,
        bowing: cfg.bowing,
        fill: fill || cfg.fillColor,
        fillStyle: cfg.fillStyle,
        hachureAngle: cfg.hachureAngle,
        hachureGap: cfg.hachureGap,
      })
      sketchyPath.setAttribute('filter', 'url(#sketchify-wobble)')
      outputSvg.appendChild(sketchyPath)
    } catch {
      // If Rough.js can't parse the path, keep original
      const clone = path.cloneNode(true) as SVGPathElement
      outputSvg.appendChild(clone)
    }
  }

  // Process all <rect> elements
  const rects = originalSvg.querySelectorAll('rect')
  for (const rect of rects) {
    const x = parseFloat(rect.getAttribute('x') || '0')
    const y = parseFloat(rect.getAttribute('y') || '0')
    const w = parseFloat(rect.getAttribute('width') || '0')
    const h = parseFloat(rect.getAttribute('height') || '0')
    const fill = rect.getAttribute('fill')
    const stroke = rect.getAttribute('stroke')

    if (w <= 0 || h <= 0) continue

    const sketchyRect = rc.rectangle(x, y, w, h, {
      stroke: stroke || cfg.strokeColor,
      strokeWidth: cfg.strokeWidth,
      roughness: cfg.roughness,
      bowing: cfg.bowing,
      fill: fill || cfg.fillColor,
      fillStyle: cfg.fillStyle,
      hachureAngle: cfg.hachureAngle,
      hachureGap: cfg.hachureGap,
    })
    sketchyRect.setAttribute('filter', 'url(#sketchify-wobble)')
    outputSvg.appendChild(sketchyRect)
  }

  // Process all <circle> elements
  const circles = originalSvg.querySelectorAll('circle')
  for (const circle of circles) {
    const cx = parseFloat(circle.getAttribute('cx') || '0')
    const cy = parseFloat(circle.getAttribute('cy') || '0')
    const r = parseFloat(circle.getAttribute('r') || '0')
    const fill = circle.getAttribute('fill')
    const stroke = circle.getAttribute('stroke')

    if (r <= 0) continue

    // Rough.js draws circles as ellipses
    const sketchyCircle = rc.ellipse(cx, cy, r * 2, r * 2, {
      stroke: stroke || cfg.strokeColor,
      strokeWidth: cfg.strokeWidth,
      roughness: cfg.roughness,
      bowing: cfg.bowing,
      fill: fill || cfg.fillColor,
      fillStyle: cfg.fillStyle,
      hachureAngle: cfg.hachureAngle,
      hachureGap: cfg.hachureGap,
    })
    sketchyCircle.setAttribute('filter', 'url(#sketchify-wobble)')
    outputSvg.appendChild(sketchyCircle)
  }

  // Clean up
  document.body.removeChild(container)

  // Serialize back to string
  const serializer = new XMLSerializer()
  return serializer.serializeToString(outputSvg)
}

/**
 * Quick check: can this browser run sketchifySvg?
 * Requires: DOMParser, Rough.js (loaded), SVG support.
 */
export function isSketchifyAvailable(): boolean {
  try {
    return (
      typeof document !== 'undefined' &&
      typeof document.createElementNS === 'function' &&
      typeof XMLSerializer !== 'undefined'
    )
  } catch {
    return false
  }
}
