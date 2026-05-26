import { Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { CanvasNodeDef, CanvasTone } from '~/types/content'

export interface CanvasNodeProps {
  node: CanvasNodeDef
  tone: CanvasTone
  index?: number
  class?: string
}

export const CanvasNode = component$<CanvasNodeProps>(
  ({ node, tone, index = 0, class: className }) => {
    const isVisible = useSignal(false)
    const nodeRef = useSignal<HTMLDivElement>()

    useVisibleTask$(() => {
      isVisible.value = true
    })

    const frameClass = () => {
      switch (node.variant) {
        case 'parchment':
          return 'frame-parchment'
        case 'ink':
          return 'frame-ink'
        case 'neon':
          return 'frame-neon'
        default:
          return 'frame-glass'
      }
    }

    return (
      <div
        ref={nodeRef}
        class={[
          'canvas-node',
          `canvas-tone-${tone}`,
          frameClass(),
          isVisible.value ? 'canvas-node-enter' : 'opacity-0',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          position: 'absolute',
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: `${node.width}px`,
          height: `${node.height}px`,
          zIndex: node.zIndex ?? 1,
          animationDelay: `${index * 80}ms`,
        }}
      >
        <Slot />
      </div>
    )
  }
)
