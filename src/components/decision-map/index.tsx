import { component$ } from '@builder.io/qwik'
import type { DecisionMapProps, DecisionMapVariant, DecisionNode } from './types'

const VARIANT_BOX: Record<DecisionMapVariant, string> = {
  sketchnote: 'paper-fiber bg-paper/5 border border-paper-border/20 rounded-lg',
  signal: 'bg-void/80 surface-hud',
  minimal: 'border-l-2 border-action/30',
}

const VARIANT_NODE: Record<DecisionMapVariant, string> = {
  sketchnote: 'border-l-2 border-paper-border/30 pl-4 py-2 font-display text-bone',
  signal: 'border-l-2 border-action/40 pl-4 py-2 font-mono text-sm text-bone',
  minimal: 'pl-3 py-1 text-bone-muted',
}

const VARIANT_CONNECTOR: Record<DecisionMapVariant, string> = {
  sketchnote: 'border-l border-paper-border/20 ml-3',
  signal: 'border-l border-action/20 ml-3',
  minimal: 'border-l border-bone-muted/10 ml-3',
}

export const DecisionMap = component$<DecisionMapProps>(
  ({ nodes, variant = 'sketchnote', class: className }) => {
    return (
      <div
        data-testid="decision-map-directory"
        data-variant={variant}
        class={['p-6 md:p-8 mb-8', VARIANT_BOX[variant], className]}
      >
        <div class="space-y-3">
          {nodes.map(node => (
            <DecisionMapNode key={node.id} node={node} variant={variant} depth={0} />
          ))}
        </div>
      </div>
    )
  }
)

const DecisionMapNode = component$<{
  node: DecisionNode
  variant: DecisionMapVariant
  depth: number
}>(({ node, variant, depth }) => {
  return (
    <div>
      <div
        class={[VARIANT_NODE[variant], depth > 0 && VARIANT_CONNECTOR[variant]]}
        style={depth > 0 ? { marginLeft: `${depth * 1.5}rem` } : undefined}
      >
        <span class="font-semibold">{node.label}</span>
        {node.outcome && <span class="text-cyan ml-2 text-sm">→ {node.outcome}</span>}
      </div>
      {node.children && node.children.length > 0 && (
        <div class="mt-2 space-y-2">
          {node.children.map(child => (
            <DecisionMapNode key={child.id} node={child} variant={variant} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
})

export type { DecisionMapProps, DecisionMapVariant, DecisionNode }
