/**
 * collage-importer.ts
 * Import bridge between mega-factory CollagePackage export format
 * and LivingBriefCollage component props.
 *
 * Transforms VisualAssetResult[] arrays into LivingBriefCollageProps
 * so that articles can render generated arrows, bonecos, emoticons,
 * and teach-images in the 2-column Living Brief layout.
 */

import type {
  BonecoItem,
  CollageArrow,
  LivingBriefCollageProps,
} from '~/components/living-brief/types'

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
 * Transform a RawCollagePackage into LivingBriefCollageProps
 * ready to pass to the LivingBriefCollage component.
 */
export function collagePackageToProps(pkg: RawCollagePackage): LivingBriefCollageProps {
  const collage: LivingBriefCollageProps = {}

  // Transform arrows
  if (pkg.arrows.length > 0) {
    collage.arrows = pkg.arrows.map(
      (a, idx): CollageArrow => ({
        id: a.id,
        from: { x: 10 + idx * 5, y: 15 + idx * 8 },
        to: { x: 25 + idx * 4, y: 10 + idx * 5 },
        label: a.caption.slice(0, 30),
        animated: true,
        variant: 'perfect-freehand',
        color: 'oklch(0.72 0.165 80)',
      })
    )
  }

  // Transform bonecos
  if (pkg.bonecos.length > 0) {
    collage.bonecos = pkg.bonecos.map(
      (b, idx): BonecoItem => ({
        id: b.id,
        emotion: idx === 0 ? 'teaching' : idx === 1 ? 'happy' : 'thinking',
        x: 65,
        y: 55 + idx * 8,
        scale: 1.4,
        bubble: b.caption.slice(0, 40),
        pointing: idx % 2 === 0 ? 'right' : 'left',
      })
    )
  }

  // Transform emoticons
  if (pkg.emoticons.length > 0) {
    collage.emoticons = []
    for (const em of pkg.emoticons) {
      // Extract Unicode characters from SVG (text content)
      const emojiMatch = em.svg.match(/<text[^>]*>([^<]+)<\/text>/)
      if (emojiMatch?.[1]) {
        const chars = emojiMatch[1].trim().split(/\s+/)
        collage.emoticons.push(...chars)
      }
    }
  }

  // Transform teach-images → polaroids
  if (pkg.teachImages.length > 0) {
    collage.polaroids = pkg.teachImages.map((t, idx) => ({
      id: t.id,
      label: t.caption.slice(0, 30),
      rotate: (idx % 2 === 0 ? 2 : -2) + ((idHash(t.id) % 3) - 1),
      width: 160,
    }))
  }

  // Labels from article metadata
  if (pkg.arrows.length > 0 || pkg.teachImages.length > 0) {
    collage.labels = [
      ...pkg.arrows.slice(0, 3).map((a, idx) => ({
        id: `label-arrow-${idx}`,
        text: a.caption.slice(0, 25),
        x: 55 + idx * 12,
        y: 12 + idx * 18,
        rotate: -1 + idx * 1.5,
        variant: 'handwrite' as const,
        arrow: (idx % 2 === 0 ? 'right' : 'left') as 'right' | 'left',
        color: 'oklch(0.25 0.03 280)',
      })),
      ...pkg.teachImages.slice(0, 2).map((t, idx) => ({
        id: `label-teach-${idx}`,
        text: (t.caption || t.altText).slice(0, 25),
        x: 10 + idx * 50,
        y: 42 + idx * 5,
        rotate: 0 + idx * 2,
        variant: 'typewrite' as const,
        arrow: 'none' as const,
        color: 'oklch(0.30 0.04 270)',
      })),
    ]
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
