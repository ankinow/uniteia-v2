/**
 * collage-importer.ts
 * Import bridge between mega-factory CollagePackage export format
 * and LivingBriefCollage component props.
 *
 * Transforms VisualAssetResult[] arrays into LivingBriefCollageProps
 * so that articles can render generated arrows, bonecos, emoticons,
 * and teach-images in the 2-column Living Brief layout.
 *
 * v3 — SVG-text labels + polaroid SVG rendering:
 * - Extracts labels from SVG <text> elements (instead of placeholder captions)
 * - Passes SVG content to polaroids for real rendering (not first-letter fallback)
 * - Gravity Groups positioning (3 anchors: workflow, ai-brain, output)
 */

import type {
  BonecoItem,
  CollageArrow,
  LivingBriefCollageProps,
} from '~/components/living-brief/types'

/** Extract first meaningful <text> content from an SVG string */
function extractSvgText(svg: string): string | null {
  const m = svg.match(/<text[^>]*>([^<]+)<\/text>/)
  return m ? (m[1]?.trim() ?? null) : null
}

/** Extract all <text> contents from an SVG as a single string */
function extractAllSvgTexts(svg: string): string {
  const texts: string[] = []
  const re = /<text[^>]*>([^<]+)<\/text>/g
  let m: RegExpMatchArray | null
  while ((m = re.exec(svg)) !== null) {
    const t = m[1]?.trim()
    if (t) texts.push(t)
  }
  return texts.join(' · ')
}

/** Simple hash from string for deterministic positioning */
function idHash(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Raw asset from mega-factory content-package-v1 export.
 * This is the contract format.
 */
export interface RawCollageAsset {
  id: string
  kind: 'handdraw-arrow' | 'boneco-puppet' | 'emoticon' | 'teach-image' | 'collage'
  svg: string
  caption: string
  altText: string
  checksum: string
  width: number
  height: number
  animatedSvg?: string
}

/**
 * Collage package from mega-factory export.
 * Injected into article frontmatter or fetched at build time.
 */
export interface RawCollagePackage {
  slug: string
  arrows: RawCollageAsset[]
  bonecos: RawCollageAsset[]
  emoticons: RawCollageAsset[]
  teachImages: RawCollageAsset[]
}

/**
 * Gravity-group anchor definitions
 * Each anchor creates a visual cluster of related elements
 */
interface GravityAnchor {
  name: string
  x: number // center point % of collage width
  y: number // center point % of collage height
}

const ANCHORS: GravityAnchor[] = [
  { name: 'workflow', x: 22, y: 22 }, // top-left: polaroid + processo
  { name: 'ai-brain', x: 52, y: 55 }, // center:   bonecos + cérebro
  { name: 'output', x: 78, y: 75 }, // bottom-right: resultado
]

function getAnchor(idx: number): GravityAnchor {
  return ANCHORS[idx % ANCHORS.length] as GravityAnchor
}

/**
 * Transform a RawCollagePackage into LivingBriefCollageProps
 * ready to pass to the LivingBriefCollage component.
 *
 * v3 changes:
 * - Arrow labels extracted from SVG <text> (not placeholder captions "Arrow 1")
 * - Polaroids include svgContent from teachImages (renders real SVG, not first-letter)
 * - Gravity group positioning (3 anchors)
 */
export function collagePackageToProps(pkg: RawCollagePackage): LivingBriefCollageProps {
  const collage: LivingBriefCollageProps = {}

  // ── Transform teach-images → polaroids ──
  // Distribute across gravity zones, include SVG content for real rendering
  if (pkg.teachImages.length > 0) {
    collage.polaroids = pkg.teachImages.map((t, idx) => {
      const zone = getAnchor(idx)
      const h = idHash(t.id)
      const offsetX = (h % 15) - 7 // -7 to +7%
      const offsetY = ((h >> 4) % 12) - 6 // -6 to +6%
      const width = idx === 0 ? 185 : idx < 3 ? 160 : 140
      // Use secondary SVG text as label (skip first which is often an emoji)
      const svgLabel = extractSvgText(t.svg) || t.caption
      return {
        id: t.id,
        svgContent: t.svg, // Pass full SVG for real rendering
        label: svgLabel.slice(0, 30),
        rotate: (idx % 2 === 0 ? 3 : -3) + ((h % 5) - 2),
        offsetX: Math.round(zone.x + offsetX),
        offsetY: Math.round(zone.y + offsetY - 10),
        width,
      }
    })
  }

  // ── Transform arrows ──
  // Connect elements within zones or chain between zones
  // Use SVG text content as label, not placeholder caption "Arrow 1"
  if (pkg.arrows.length > 0) {
    collage.arrows = pkg.arrows.map((a, idx): CollageArrow => {
      const srcZone = getAnchor(idx)
      const dstZone = getAnchor(idx + 1)
      const h = idHash(a.id)
      const fromY = srcZone.y - 5 + (h % 10)
      const toX = dstZone.x - 10 + ((h >> 4) % 15)
      const toY = dstZone.y - 8 + ((h >> 6) % 12)
      // Extract real label from SVG text, fall back to altText, NEVER use caption (which is "Arrow 1")
      const svgLabel = extractSvgText(a.svg) || a.altText.replace(/^Hand-drawn arrow:\s*/i, '')
      return {
        id: a.id,
        from: { x: srcZone.x + 8, y: fromY },
        to: { x: toX, y: toY },
        label: svgLabel.slice(0, 25),
        animated: true,
        variant: 'perfect-freehand',
        color: 'oklch(0.72 0.165 80)',
      }
    })
  }

  // ── Transform bonecos ──
  // Cluster around ai-brain anchor (ANCHORS[1])
  if (pkg.bonecos.length > 0) {
    collage.bonecos = pkg.bonecos.map((b, idx): BonecoItem => {
      const anchor = getAnchor(1) // ai-brain zone
      const _h = idHash(b.id)
      // Spread bonecos in a semi-circle around the anchor
      const radius = 10 + idx * 5
      const angle = (idx * 45 - 30) * (Math.PI / 180)
      const bx = anchor.x + Math.cos(angle) * radius
      const by = anchor.y + Math.sin(angle) * radius
      return {
        id: b.id,
        emotion: idx === 0 ? 'teaching' : idx === 1 ? 'excited' : 'happy',
        x: Math.round(bx),
        y: Math.round(by),
        scale: 1.5 - idx * 0.1,
        bubble: b.caption.slice(0, 40),
        pointing: idx % 2 === 0 ? 'right' : 'left',
      }
    })
  }

  // ── Transform emoticons ──
  // Scatter decoratively around all zones
  if (pkg.emoticons.length > 0) {
    collage.emoticons = []
    for (const em of pkg.emoticons) {
      const emojiMatch = em.svg.match(/<text[^>]*>([^<]+)<\/text>/)
      if (emojiMatch?.[1]) {
        const chars = emojiMatch[1].trim().split(/\s+/)
        collage.emoticons.push(...chars)
      }
    }
  }

  // ── Labels from article metadata ──
  // Positioned near their referenced elements
  if (pkg.arrows.length > 0 || pkg.teachImages.length > 0) {
    const teachLabels = pkg.teachImages.slice(0, 3).map((t, idx) => {
      const zone = getAnchor(idx)
      const svgLabel = extractSvgText(t.svg) || t.caption
      return {
        id: `label-teach-${idx}`,
        text: svgLabel.slice(0, 25),
        x: Math.round(zone.x - 8),
        y: Math.round(zone.y + 12),
        rotate: -1 + idx * 1.5,
        variant: 'typewrite' as const,
        arrow: 'none' as const,
        color:
          idx === 0
            ? 'oklch(0.55 0.15 80)'
            : idx === 1
              ? 'oklch(0.45 0.12 280)'
              : 'oklch(0.40 0.10 200)',
      }
    })

    const arrowLabels = pkg.arrows.slice(0, 3).map((a, idx) => {
      const zone = getAnchor(idx)
      const svgLabel = extractSvgText(a.svg) || a.altText.replace(/^Hand-drawn arrow:\s*/i, '')
      return {
        id: `label-arrow-${idx}`,
        text: svgLabel.slice(0, 25),
        x: Math.round(zone.x + 15 + idx * 5),
        y: Math.round(zone.y - 12 - idx * 3),
        rotate: 0 + idx * 2,
        variant: 'handwrite' as const,
        arrow: (idx % 2 === 0 ? 'right' : 'left') as 'right' | 'left',
        color: 'oklch(0.25 0.03 280)',
      }
    })

    collage.labels = [...teachLabels, ...arrowLabels]
  }

  return collage
}

/**
 * Parse a collage package from a JSON blob
 * (as stored in content-package-v1 export or article frontmatter)
 */
export function parseCollagePackage(json: string): RawCollagePackage | null {
  try {
    const data = JSON.parse(json)
    if (!data.slug) return null
    return data as RawCollagePackage
  } catch {
    return null
  }
}

/**
 * Load collage assets that were pre-generated and stored alongside
 * article content (e.g., in content/apex/en/assets/collage/).
 * Returns null if no collage data found.
 */
export async function loadCollageAssets(
  niche: string,
  slug: string,
  lang: string
): Promise<LivingBriefCollageProps | null> {
  try {
    // Collage data is stored as JSON next to the article content
    const mod = await import(`../../content/${niche}/${lang}/assets/collage/${slug}.json?raw`)
    const pkg = parseCollagePackage(mod.default)
    if (!pkg) return null
    return collagePackageToProps(pkg)
  } catch {
    // No collage data — article may not have been through mega-factory yet
    return null
  }
}
