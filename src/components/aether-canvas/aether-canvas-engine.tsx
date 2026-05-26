import { Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { CanvasSceneGraph } from '~/types/content'
import { CanvasConnector } from './canvas-connector'
import { CanvasNode } from './canvas-node'
import { resolveLayout } from './layout-strategy'

export interface AetherCanvasEngineProps {
  scene: CanvasSceneGraph
  class?: string
}

export const AetherCanvasEngine = component$<AetherCanvasEngineProps>(
  ({ scene, class: className }) => {
    const canvasReady = useSignal(false)
    const containerRef = useSignal<HTMLDivElement>()
    const containerWidth = useSignal(1024)

    useVisibleTask$(() => {
      canvasReady.value = true
      if (containerRef.value) {
        containerWidth.value = containerRef.value.offsetWidth
      }
    })

    if (!scene?.nodes?.length) {
      return <Slot />
    }

    const resolved = resolveLayout(scene, containerWidth.value)
    const hasContentNodes = scene.nodes.some(n => n.type !== 'hero' && n.type !== 'section')

    // If no meaningful visual content, render minimal decorative canvas
    if (!hasContentNodes) {
      return <div class="aether-canvas-minimal h-0 overflow-hidden" aria-hidden="true" />
    }

    return (
      <div
        ref={containerRef}
        class={[
          'aether-canvas',
          `canvas-tone-${resolved.tone}`,
          'relative w-full overflow-hidden',
          'min-h-[400px]',
          'bg-canvas-bg',
          canvasReady.value ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-500',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          height: `${Math.max(...resolved.nodes.map(n => (n.y ?? 0) + (n.height ?? 200))) + 40}px`,
        }}
      >
        <svg
          class="absolute inset-0 w-full h-full pointer-events-none z-0"
          role="img"
          aria-label="Canvas connectors"
        >
          <title>Connectors</title>
          {resolved.connectors?.map(c => (
            <CanvasConnector key={c.id} connector={c} tone={resolved.tone} />
          ))}
        </svg>
        {resolved.nodes.map((node, i) => (
          <CanvasNode key={node.id} node={node} tone={resolved.tone} index={i}>
            <Slot />
          </CanvasNode>
        ))}
      </div>
    )
  }
)
