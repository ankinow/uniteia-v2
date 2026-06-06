import { HTMLContainer, Rectangle2d, ShapeUtil, T } from '@tldraw/tldraw'
import type { TLShape } from '@tldraw/tldraw'

const KAWAII_LIVING_TYPE = 'kawaii-living'

declare module '@tldraw/tldraw' {
  interface TLGlobalShapePropsMap {
    [KAWAII_LIVING_TYPE]: {
      w: number
      h: number
      shapeId: string
      style: 'manga-chalk' | 'manga-marker' | 'manga-ink' | 'manga-comic' | 'manga-3d'
      mood: 'concept' | 'volumetric'
      scale: number
    }
  }
}

type KawaiiLivingShape = TLShape<typeof KAWAII_LIVING_TYPE>

export class KawaiiLivingShapeUtil extends ShapeUtil<KawaiiLivingShape> {
  static override type = KAWAII_LIVING_TYPE
  static override props = {
    w: T.number,
    h: T.number,
    shapeId: T.string,
    style: T.string,
    mood: T.string,
    scale: T.number,
  }

  getDefaultProps(): KawaiiLivingShape['props'] {
    return {
      w: 120,
      h: 120,
      shapeId: 'kawaii-sticky-beige',
      style: 'manga-marker',
      mood: 'concept',
      scale: 1,
    }
  }

  getGeometry(shape: KawaiiLivingShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  component(shape: KawaiiLivingShape) {
    const { shapeId, style, mood, scale, w, h } = shape.props
    const size = Math.min(w, h) * scale

    // Resolve path: /assets/shape-canvas/{shapeId}/{style}/{mood}.webp
    const src = `/assets/shape-canvas/${shapeId}/${style}/${mood}.webp`

    // @ts-ignore - HTMLContainer is React component for tldraw canvas
    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <img
          src={src}
          alt={shapeId}
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          // Fallback if image fails to load (show a cute placeholder emoji/box)
          onError={e => {
            const imgEl = e.currentTarget
            imgEl.style.display = 'none'
            const parent = imgEl.parentElement
            if (parent && !parent.querySelector('.kawaii-fallback')) {
              const fallback = document.createElement('div')
              fallback.className = 'kawaii-fallback'
              fallback.innerText = '🌸'
              fallback.style.fontSize = '32px'
              parent.appendChild(fallback)
            }
          }}
        />
      </HTMLContainer>
    )
  }

  getIndicatorPath(shape: KawaiiLivingShape) {
    const path = new Path2D()
    path.rect(0, 0, shape.props.w, shape.props.h)
    return path
  }
}
