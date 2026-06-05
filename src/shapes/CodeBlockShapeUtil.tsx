import { HTMLContainer, Rectangle2d, ShapeUtil, T } from '@tldraw/tldraw'
import type { TLShape } from '@tldraw/tldraw'
import { useTranslation } from 'react-i18next'

const CODE_BLOCK_TYPE = 'code-block'

declare module '@tldraw/tldraw' {
  interface TLGlobalShapePropsMap {
    [CODE_BLOCK_TYPE]: { w: number; h: number; codeKey: string; language: string }
  }
}

type CodeBlockShape = TLShape<typeof CODE_BLOCK_TYPE>

export class CodeBlockShapeUtil extends ShapeUtil<CodeBlockShape> {
  static override type = CODE_BLOCK_TYPE
  static override props = {
    w: T.number,
    h: T.number,
    codeKey: T.string,
    language: T.string,
  }

  getDefaultProps(): CodeBlockShape['props'] {
    return { w: 400, h: 280, codeKey: '', language: 'typescript' }
  }

  getGeometry(shape: CodeBlockShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  component(shape: CodeBlockShape) {
    const { t } = useTranslation()
    const code = t(shape.props.codeKey)
    const lang = shape.props.language

    return (
      <HTMLContainer
        style={{
          width: shape.props.w,
          height: shape.props.h,
          background: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: 8,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        }}
      >
        <div
          style={{
            background: '#161b22',
            borderBottom: '1px solid #30363d',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#8b949e',
          }}
        >
          <span>{lang}</span>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#8b949e',
              cursor: 'pointer',
              fontSize: 11,
              padding: '4px 8px',
              borderRadius: 4,
            }}
            onClick={() => navigator.clipboard.writeText(code)}
          >
            Copy
          </button>
        </div>
        <pre
          style={{
            margin: 0,
            padding: 16,
            overflow: 'auto',
            flex: 1,
            fontSize: 13,
            lineHeight: 1.5,
            color: '#e6edf3',
            background: '#0d1117',
          }}
        >
          <code className={`language-${lang}`}>{code}</code>
        </pre>
      </HTMLContainer>
    )
  }

  getIndicatorPath(shape: CodeBlockShape) {
    const path = new Path2D()
    path.rect(0, 0, shape.props.w, shape.props.h)
    return path
  }
}
