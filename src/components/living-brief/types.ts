/**
 * LivingBrief2Col — Types
 *
 * 2-column Living Brief layout:
 * - Left 35%: Dark hero panel (glowing title, desc, hashtags, CTA)
 * - Right 65%: Parchment torn-paper collage (tape, polaroids, arrows, bonecos, labels)
 */

export interface LivingBriefHeroProps {
  /** Glowing title (yellow/gold gradient) */
  title: string
  /** Subtitle/description (purple/violet tone) */
  subtitle?: string | undefined
  /** Hashtag labels */
  hashtags?: string[] | undefined
  /** CTA buttons */
  buttons?: LivingBriefButton[] | undefined
  /** Background variant */
  variant?: 'default' | 'magica' | undefined
}

export interface LivingBriefButton {
  label: string
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: string
}

export interface LivingBriefCollageProps {
  /** Polaroid images with metadata */
  polaroids?: PolaroidItem[] | undefined
  /** Hand-drawn labels/annotations */
  labels?: CollageLabel[] | undefined
  /** Arrows connecting elements */
  arrows?: CollageArrow[] | undefined
  /** Boneco puppets (teaching characters) */
  bonecos?: BonecoItem[] | undefined
  /** Emoticons to scatter */
  emoticons?: string[] | undefined
  /** Tape strips */
  tapeVariants?: TapeVariant[] | undefined
  /** Whether to show decorative floral elements */
  showFlora?: boolean | undefined
  /** Content sections to render in the collage */
  sections?: CollageSection[] | undefined
  /** Additional CSS classes */
  class?: string | undefined
}

export interface PolaroidItem {
  id: string
  src?: string
  label?: string
  /** Rotation in degrees */
  rotate?: number
  /** Random offset */
  offsetX?: number
  offsetY?: number
  /** Width in pixels (default: 160) */
  width?: number
  /** Stack/pile group */
  stack?: string
}

export interface CollageLabel {
  id: string
  text: string
  /** Hand-drawn arrow direction */
  arrow?: 'left' | 'right' | 'up' | 'down' | 'none'
  x: number
  y: number
  rotate?: number
  variant?: 'handwrite' | 'typewrite'
  /** Text color */
  color?: string
}

export interface CollageArrow {
  id: string
  from: { x: number; y: number }
  to: { x: number; y: number }
  label?: string
  variant?: 'perfect-freehand' | 'straight' | 'curved'
  animated?: boolean
  color?: string
}

export interface BonecoItem {
  id: string
  /** Emotion/expression */
  emotion?: 'happy' | 'thinking' | 'teaching' | 'excited' | 'confused'
  /** Position */
  x: number
  y: number
  scale?: number
  /** Teach bubble text */
  bubble?: string
  /** Pointing direction */
  pointing?: 'left' | 'right' | 'up' | 'down'
}

export type TapeVariant = 'clear' | 'yellow' | 'white' | 'washi'

export interface CollageSection {
  id: string
  type: 'text' | 'image' | 'boneco' | 'arrow' | 'emoticon' | 'teach-image'
  content: string
  x: number
  y: number
  rotate?: number
  width?: number
}

export interface LivingBrief2ColProps {
  /** Left panel props */
  hero: LivingBriefHeroProps
  /** Right panel props */
  collage?: LivingBriefCollageProps
  /** Banner/header element before the 2-col */
  header?: Record<string, unknown>
  /** Mobile layout: 'stack' (default) | 'hero-top' */
  mobileLayout?: 'stack' | 'hero-top'
  /** Additional CSS classes */
  class?: string
  /** Show signature tape at top of collage */
  showSignatureTape?: boolean
}
