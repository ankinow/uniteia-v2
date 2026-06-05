import { HTMLContainer, Rectangle2d, ShapeUtil, T } from '@tldraw/tldraw'
import type { TLShape } from '@tldraw/tldraw'
import { useTranslation } from 'react-i18next'

const STEP_CARD_TYPE = 'step-card'

declare module '@tldraw/tldraw' {
  interface TLGlobalShapePropsMap {
    [STEP_CARD_TYPE]: { w: number; h: number; step: number; titleKey: string; bodyKey: string }
  }
}

type StepCardShape = TLShape<typeof STEP_CARD_TYPE>

export class StepCardShapeUtil extends ShapeUtil<StepCardShape> {
  static override type = STEP_CARD_TYPE
  static override props = {
    w: T.number,
    h: T.number,
    step: T.number,
    titleKey: T.string,
    bodyKey: T.string,
  }

  getDefaultProps(): StepCardShape['props'] {
    return { w: 320, h: 200, step: 1, titleKey: '', bodyKey: '' }
  }

  getGeometry(shape: StepCardShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  component(shape: StepCardShape) {
    const { t } = useTranslation()
    const title = t(shape.props.titleKey)
    const body = t(shape.props.bodyKey)

    // @ts-ignore - HTMLContainer is React component for tldraw canvas
    return (
      <HTMLContainer
        style={{
          width: shape.props.w,
          height: shape.props.h,
          background: '#1a1a2e',
          border: '1px solid #00d4ff',
          borderRadius: 8,
          padding: 16,
          color: '#e0e0e0',
          fontFamily: '"Inter", "Noto Sans", sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,212,255,0.1)',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#00d4ff',
            color: '#0a0a0f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {shape.props.step}
        </div>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            color: '#00d4ff',
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            opacity: 0.85,
            lineHeight: 1.5,
            overflowWrap: 'break-word',
          }}
        >
          {body}
        </p>
      </HTMLContainer>
    )
  }

  getIndicatorPath(shape: StepCardShape) {
    const path = new Path2D()
    path.rect(0, 0, shape.props.w, shape.props.h)
    return path
  }
}
