import { HTMLContainer, Rectangle2d, ShapeUtil, T } from '@tldraw/tldraw'
import type { TLShape } from '@tldraw/tldraw'

const SVG_ICON_TYPE = 'svg-icon'

declare module '@tldraw/tldraw' {
  interface TLGlobalShapePropsMap {
    [SVG_ICON_TYPE]: { w: number; h: number; iconId: string; scale: number }
  }
}

type SvgIconShape = TLShape<typeof SVG_ICON_TYPE>

// SVG icon registry - kawaii hand-drawn style icons
const ICON_REGISTRY: Record<string, string> = {
  robot: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="32" height="32" rx="6" stroke="#00d4ff" stroke-width="2"/>
      <circle cx="16" cy="18" r="3" fill="#00d4ff"/>
      <circle cx="32" cy="18" r="3" fill="#00d4ff"/>
      <rect x="16" y="28" width="16" height="2" rx="1" fill="#00d4ff"/>
      <circle cx="24" cy="40" r="2" fill="#00d4ff" opacity="0.5"/>
    </svg>
  `,
  magnet: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12 L20 12 L20 36 L12 36 Z" fill="#00d4ff"/>
      <path d="M28 12 L36 12 L36 36 L28 36 Z" fill="#ff6b6b"/>
      <path d="M20 24 L28 24" stroke="#00d4ff" stroke-width="3" stroke-linecap="round"/>
      <circle cx="24" cy="24" r="4" fill="#0a0a0f"/>
    </svg>
  `,
  alert: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6 L42 36 H6 Z" fill="#fff5e6" stroke="#ffb800" stroke-width="2"/>
      <circle cx="24" cy="18" r="3" fill="#ff6b6b"/>
      <rect x="22" y="24" width="4" height="10" rx="2" fill="#ff6b6b"/>
    </svg>
  `,
  hub: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="16" stroke="#00d4ff" stroke-width="2"/>
      <circle cx="24" cy="24" r="6" fill="#00d4ff"/>
      <g stroke="#00d4ff" stroke-width="2" stroke-linecap="round">
        <line x1="24" y1="6" x2="24" y2="14"/>
        <line x1="24" y1="34" x2="24" y2="42"/>
        <line x1="6" y1="24" x2="14" y2="24"/>
        <line x1="34" y1="24" x2="42" y2="24"/>
        <line x1="12" y1="12" x2="16" y2="16"/>
        <line x1="32" y1="32" x2="36" y2="36"/>
        <line x1="12" y1="36" x2="16" y2="32"/>
        <line x1="32" y1="16" x2="36" y2="12"/>
      </g>
    </svg>
  `,
  flow: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12 L24 12 L24 24 L36 24 L36 36" stroke="#00d4ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <polygon points="36,36 42,30 42,42" fill="#00d4ff"/>
    </svg>
  `,
  code: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="36" height="32" rx="4" stroke="#00d4ff" stroke-width="2"/>
      <path d="M14 20 L20 26 L14 32" stroke="#00d4ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M34 20 L28 26 L34 32" stroke="#00d4ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `,
  check: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="#00d4ff" stroke-width="2"/>
      <path d="M14 24 L22 32 L34 16" stroke="#00d4ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `,
  flag: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 8 L14 40" stroke="#ff6b6b" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M14 12 L32 18 L14 24 Z" fill="#fff0f0" stroke="#ff6b6b" stroke-width="2"/>
    </svg>
  `,
  star: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="24,4 28,16 40,18 30,26 34,38 24,32 14,38 18,26 8,18 20,16" fill="#ffd93d" stroke="#00d4ff" stroke-width="2"/>
    </svg>
  `,
}

export class SvgIconShapeUtil extends ShapeUtil<SvgIconShape> {
  static override type = SVG_ICON_TYPE
  static override props = {
    w: T.number,
    h: T.number,
    iconId: T.string,
    scale: T.number,
  }

  getDefaultProps(): SvgIconShape['props'] {
    return { w: 64, h: 64, iconId: 'robot', scale: 1 }
  }

  getGeometry(shape: SvgIconShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  component(shape: SvgIconShape) {
    const iconSvg: string = ICON_REGISTRY[shape.props.iconId] ?? ICON_REGISTRY.robot ?? ''
    const size = Math.min(shape.props.w, shape.props.h) * shape.props.scale

    return (
      <HTMLContainer
        style={{
          width: shape.props.w,
          height: shape.props.h,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          // biome-ignore lint/suspicious/noExplicitAny: tldraw HTMLContainer inner div doesn't expose dangerouslySetInnerHTML in types
          {...({ dangerouslySetInnerHTML: { __html: iconSvg } } as any)}
          style={{
            width: size,
            height: size,
          }}
        />
      </HTMLContainer>
    )
  }

  getIndicatorPath(shape: SvgIconShape) {
    const path = new Path2D()
    path.rect(0, 0, shape.props.w, shape.props.h)
    return path
  }
}
