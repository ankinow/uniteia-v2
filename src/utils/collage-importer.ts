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
        from: { x: 30 + idx * 10, y: 40 + idx * 15 },
        to: { x: 60 + idx * 5, y: 30 + idx * 10 },
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
        x: 15 + idx * 25,
        y: 30 + idx * 12,
        scale: 1,
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
      rotate: (idx % 2 === 0 ? 2 : -2) + Math.random() * 2,
      width: 160,
    }))
  }

  // Labels from article metadata
  if (pkg.arrows.length > 0 || pkg.teachImages.length > 0) {
    collage.labels = [
      ...pkg.arrows.slice(0, 3).map((a, idx) => ({
        id: `label-arrow-${idx}`,
        text: a.caption.slice(0, 25),
        x: 50 + idx * 10,
        y: 20 + idx * 15,
        rotate: -2 + idx * 2,
        variant: 'handwrite' as const,
        arrow: (idx % 2 === 0 ? 'right' : 'left') as 'right' | 'left',
        color: 'oklch(0.25 0.03 280)',
      })),
      ...pkg.teachImages.slice(0, 2).map((t, idx) => ({
        id: `label-teach-${idx}`,
        text: (t.caption || t.altText).slice(0, 25),
        x: 20 + idx * 40,
        y: 60 + idx * 10,
        rotate: 1 + idx * 3,
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
