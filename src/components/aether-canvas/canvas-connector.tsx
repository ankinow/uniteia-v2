import { component$ } from '@builder.io/qwik'
import type { CanvasConnectorDef, CanvasTone } from '~/types/content'

export interface CanvasConnectorProps {
  connector: CanvasConnectorDef
  tone: CanvasTone
  class?: string
}

const CONNECTOR_STYLE_MAP: Record<string, string> = {
  solid: 'connector-solid',
  dashed: 'connector-dashed',
  glow: 'connector-glow',
  ink: 'connector-ink',
}

const CONNECTOR_PATH_MAP: Record<string, string> = {
  arc: 'url(#connector-arc)',
  's-curve': 'url(#connector-s-curve)',
  'arc-reverse': 'url(#connector-arc-reverse)',
}

export const CanvasConnector = component$<CanvasConnectorProps>(
  ({ connector, tone, class: className }) => {
    const styleClass = CONNECTOR_STYLE_MAP[connector.type ?? 'solid'] ?? 'connector-solid'
    return (
      <use
        href={CONNECTOR_PATH_MAP.arc}
        class={[`canvas-tone-${tone}`, styleClass, className].filter(Boolean).join(' ')}
        data-connector-id={connector.id}
        data-from={connector.from}
        data-to={connector.to}
      />
    )
  }
)
