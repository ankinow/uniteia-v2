/**
 * Kawaii Thumbnail Mapper — deterministic mini asset by article slug
 *
 * Maps any article slug to one of 51 kawaii mini poses via a
 * simple djb2-style hash. Same slug always returns the same
 * character — consistent across SSR and client, all locales.
 *
 * Usage:
 *   import { slugToKawaiiMini } from '~/utils/kawaii-thumbnail'
 *   const { src, alt } = slugToKawaiiMini(signal.node.slug)
 *   <img src={src} alt={alt} ... />
 */

/** All 51 kawaii mini pose names (alphabetical, deterministic order) */
const MINI_POSES: readonly string[] = [
  'architect-working',
  'building-blocks',
  'calm-meditation',
  'clicking-button',
  'climbing-stairs',
  'clock-watching',
  'confident-thumbsup',
  'confused-hand-chin',
  'connecting-plug',
  'copying-clipboard',
  'countdown-4',
  'crossing-finish',
  'crossroads-choice',
  'curious-peek',
  'curious-tilt',
  'delivering-package',
  'deploying-rocket',
  'determined-fist',
  'dodging-x',
  'dragging-element',
  'energetic-jump',
  'excited-sparkle',
  'flying-kite',
  'focused-stare',
  'grateful-bow',
  'high-five',
  'idea-lightbulb',
  'looking-up',
  'magnifying-glass',
  'opening-door',
  'playful-wink',
  'pointing-cta',
  'pointing-right',
  'presenting-open-arms',
  'pressing-enter',
  'proud-chest',
  'reading-map',
  'relieved-sigh',
  'routing-arrows',
  'saving-disk',
  'scrolling-wheel',
  'sharing-gift',
  'sleeping-peaceful',
  'success-arms-up',
  'surprised-gasp',
  'swiping-card',
  'thinking-brain',
  'typing-keyboard',
  'walking-forward',
  'waving-goodbye',
  'zooming-in',
]

/**
 * DJB2-style hash — deterministic across SSR & client.
 * Same pattern used in project (collage-importer, visual-explainer, living-brief).
 */
function idHash(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0 // 32-bit integer
  }
  return Math.abs(hash)
}

export interface KawaiiThumbnail {
  src: string
  alt: string
  poseIndex: number
}

/**
 * Map an article slug to a deterministic kawaii mini thumbnail.
 *
 * @param slug - Article slug (e.g., "building-ai-agents")
 * @returns `{ src, alt, poseIndex }` — always the same for the same slug
 */
export function slugToKawaiiMini(slug: string): KawaiiThumbnail {
  const idx = idHash(slug) % MINI_POSES.length
  const firstPose = MINI_POSES[0]
  const pose: string = MINI_POSES[idx] ?? firstPose ?? 'default'
  return {
    src: `/assets/kawaii-vibecoder/mini/mini-${pose}.webp`,
    alt: `Kawaii ${pose.replace(/-/g, ' ')}`,
    poseIndex: idx,
  }
}
