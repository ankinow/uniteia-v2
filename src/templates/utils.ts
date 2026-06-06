/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Editor } from '@tldraw/tldraw'

const HANDLE_ANCHORS: Record<string, { x: number; y: number }> = {
  left: { x: 0, y: 0.5 },
  right: { x: 1, y: 0.5 },
  top: { x: 0.5, y: 0 },
  bottom: { x: 0.5, y: 1 },
}

export function createShapesAndBindings(editor: Editor, shapes: any[]) {
  const bindings: any[] = []

  const processedShapes = shapes.map(shape => {
    if (shape.type === 'arrow') {
      const newProps = { ...shape.props }

      // Check for legacy start binding
      if (
        newProps.start &&
        typeof newProps.start === 'object' &&
        'boundShapeId' in newProps.start
      ) {
        const legacyStart = newProps.start
        const anchor = HANDLE_ANCHORS[legacyStart.handleId] || { x: 0.5, y: 0.5 }
        bindings.push({
          type: 'arrow',
          fromId: shape.id,
          toId: legacyStart.boundShapeId,
          props: {
            terminal: 'start',
            normalizedAnchor: anchor,
            isExact: false,
          },
        })
        newProps.start = { x: 0, y: 0 }
      }

      // Check for legacy end binding
      if (newProps.end && typeof newProps.end === 'object' && 'boundShapeId' in newProps.end) {
        const legacyEnd = newProps.end
        const anchor = HANDLE_ANCHORS[legacyEnd.handleId] || { x: 0.5, y: 0.5 }
        bindings.push({
          type: 'arrow',
          fromId: shape.id,
          toId: legacyEnd.boundShapeId,
          props: {
            terminal: 'end',
            normalizedAnchor: anchor,
            isExact: false,
          },
        })
        newProps.end = { x: 0, y: 0 }
      }

      return {
        ...shape,
        props: newProps,
      }
    }
    return shape
  })

  // Create shapes first
  processedShapes.forEach(shape => {
    editor.createShape(shape)
  })

  // Create bindings
  if (bindings.length > 0) {
    editor.createBindings(bindings)
  }
}
