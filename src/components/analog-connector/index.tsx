import { type ClassList, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'

export type ConnectorVariant = 'solid' | 'dashed' | 'dotted' | 'glow'

export interface ConnectorEdge {
  sourceId: string
  targetId: string
  relation?: string
  variant?: ConnectorVariant
}

export interface ConnectorCoord {
  sx: number
  sy: number
  tx: number
  ty: number
}

export interface AnalogConnectorProps {
  edges: ConnectorEdge[]
  containerRef?: string
  variant?: ConnectorVariant
  animated?: boolean
  class?: ClassList
  coordOverrides?: ConnectorCoord[]
}

export const ALL_VARIANTS: ConnectorVariant[] = ['solid', 'dashed', 'dotted', 'glow']

function seededJitter(index: number): number {
  const seed = (index + 1) * 7.3
  const frac = seed - Math.floor(seed)
  return frac * 4 - 2
}

export function buildBezier(coords: ConnectorCoord): string {
  const { sx, sy, tx, ty } = coords
  const dx = tx - sx
  const cp1x = sx + dx * 0.4
  const cp1y = sy
  const cp2x = sx + dx * 0.6
  const cp2y = ty
  return `M ${sx},${sy} C ${cp1x},${cp1y}, ${cp2x},${cp2y}, ${tx},${ty}`
}

export const AnalogConnector = component$<AnalogConnectorProps>(
  ({
    edges,
    containerRef,
    variant = 'solid',
    animated = false,
    class: className,
    coordOverrides,
  }) => {
    const coordsSignal = useSignal<ConnectorCoord[]>([])

    useVisibleTask$(() => {
      if (coordOverrides) {
        coordsSignal.value = coordOverrides
        return
      }

      const containerQuery = containerRef
        ? document.querySelector(containerRef)
        : document.querySelector('[data-analog-container]')
      if (!containerQuery) return
      const containerEl: Element = containerQuery

      function measure() {
        const containerRect = containerEl.getBoundingClientRect()
        const measured: ConnectorCoord[] = []

        for (const edge of edges) {
          const sourceEl = document.querySelector(`[data-node-id="${edge.sourceId}"]`)
          const targetEl = document.querySelector(`[data-node-id="${edge.targetId}"]`)
          if (!sourceEl || !targetEl) continue

          const sourceRect = sourceEl.getBoundingClientRect()
          const targetRect = targetEl.getBoundingClientRect()

          measured.push({
            sx: sourceRect.left - containerRect.left + sourceRect.width,
            sy: sourceRect.top - containerRect.top + sourceRect.height / 2,
            tx: targetRect.left - containerRect.left,
            ty: targetRect.top - containerRect.top + targetRect.height / 2,
          })
        }

        coordsSignal.value = measured
      }

      measure()

      const observer = new ResizeObserver(measure)
      observer.observe(containerEl)

      return () => observer.disconnect()
    })

    const coords = coordOverrides ?? coordsSignal.value

    return (
      <svg
        class={['analog-connector', className]}
        data-testid="analog-connector"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        {edges.map((edge, i) => {
          const c = coords[i]
          if (!c) return null
          const bezierCoords: ConnectorCoord = {
            sx: c.sx + seededJitter(i * 4),
            sy: c.sy + seededJitter(i * 4 + 1),
            tx: c.tx + seededJitter(i * 4 + 2),
            ty: c.ty + seededJitter(i * 4 + 3),
          }
          return (
            <path
              key={`${edge.sourceId}-${edge.targetId}`}
              d={buildBezier(bezierCoords)}
              class={[
                'analog-connector__path',
                `analog-connector__path--${edge.variant || variant}`,
                animated ? 'analog-connector__path--animated' : undefined,
              ]}
              data-relation={edge.relation}
            />
          )
        })}
      </svg>
    )
  }
)
