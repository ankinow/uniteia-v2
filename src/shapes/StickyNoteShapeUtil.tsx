import { HTMLContainer, Rectangle2d, ShapeUtil, T } from '@tldraw/tldraw'
import type { TLShape } from '@tldraw/tldraw'
import { useTranslation } from 'react-i18next'

const STICKY_NOTE_TYPE = 'sticky-note'

declare module '@tldraw/tldraw' {
  interface TLGlobalShapePropsMap {
    [STICKY_NOTE_TYPE]: { w: number; h: number; textKey: string; color: 'yellow' | 'blue' | 'pink' }
  }
}

type StickyNoteShape = TLShape<typeof STICKY_NOTE_TYPE>

export class StickyNoteShapeUtil extends ShapeUtil<StickyNoteShape> {
  static override type = STICKY_NOTE_TYPE
  static override props = {
    w: T.number,
    h: T.number,
    textKey: T.string,
    color: T.string,
  }

  getDefaultProps(): StickyNoteShape['props'] {
    return { w: 200, h: 180, textKey: '', color: 'yellow' }
  }

  getGeometry(shape: StickyNoteShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  component(shape: StickyNoteShape) {
    const { t } = useTranslation()
    const text = t(shape.props.textKey)
    const colors = {
      yellow: '#fef3c7',
      blue: '#dbeafe',
      pink: '#fce7f3',
    }
    const textColors = {
      yellow: '#1f2937',
      blue: '#1e3a5f',
      pink: '#7f1d1d',
    }
    const bgColor = colors[shape.props.color as keyof typeof colors] || colors.yellow
    const txtColor = textColors[shape.props.color as keyof typeof textColors] || textColors.yellow

    return (
      <HTMLContainer
        style={{
          width: shape.props.w,
          height: shape.props.h,
          background: bgColor,
          padding: 12,
          fontFamily: '"Inter", "Noto Sans", sans-serif',
          fontSize: 13,
          color: txtColor,
          lineHeight: 1.4,
          boxShadow: '2px 2px 0 rgba(0,0,0,0.1)',
          transform: 'rotate(-1deg)',
          transformOrigin: 'center center',
          overflow: 'hidden',
        }}
      >
        {text}
      </HTMLContainer>
    )
  }

  getIndicatorPath(shape: StickyNoteShape) {
    const path = new Path2D()
    path.rect(0, 0, shape.props.w, shape.props.h)
    return path
  }
}
