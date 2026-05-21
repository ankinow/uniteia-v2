import { component$ } from '@builder.io/qwik'

export interface DecisionNode {
  id?: string
  label: string
  outcome?: string
  children?: DecisionNode[]
}

export interface DecisionMapProps {
  title: string
  nodes: DecisionNode[]
  variant?: 'sketchnote' | 'signal' | 'minimal'
}

/**
 * DecisionMap — Sketchnote-style decision flow for articles and homepage.
 *
 * Renders a visual decision tree with organic branching layout.
 * Uses the Visual DNA 2026 palette (OKLCH Coral/Cyan) for decision paths.
 *
 * Variants:
 *   - sketchnote: Hand-drawn aesthetic with paper-fiber backdrop and ink lines
 *   - signal: Signal Grid V3 style — clean, high-contrast
 *   - minimal: Subtle, text-focused with minimal visual treatment
 */
export const DecisionMap = component$<DecisionMapProps>(
  ({ title, nodes, variant = 'sketchnote' }) => {
    const variantStyles: Record<string, string> = {
      sketchnote: 'paper-fiber bg-paper/5 border border-paper-border/20 rounded-lg',
      signal: 'bg-void/80 border border-action/20 rounded-lg',
      minimal: 'border-l-2 border-action/30',
    }

    const nodeVariantStyles: Record<string, string> = {
      sketchnote: 'border-l-2 border-paper-border/30 pl-4 py-2 font-display text-bone',
      signal: 'border-l-2 border-action/40 pl-4 py-2 font-mono text-sm text-bone',
      minimal: 'pl-3 py-1 text-bone-muted',
    }

    return (
      <div
        data-testid="decision-map"
        data-variant={variant}
        class={['surface-hud p-6 md:p-8 mb-8', variantStyles[variant]]}
      >
        <h3 class="text-lg font-display font-semibold text-coral mb-4">{title}</h3>

        <div class="space-y-3">
          {nodes.map(node => (
            <div key={node.id ?? node.label}>
              <div class={nodeVariantStyles[variant]}>
                <span class="font-semibold">{node.label}</span>
                {node.outcome && <span class="text-cyan ml-2 text-sm">→ {node.outcome}</span>}
              </div>

              {node.children && node.children.length > 0 && (
                <div class="ml-6 mt-2 space-y-2">
                  {node.children.map(child => (
                    <div key={child.id ?? child.label} class={nodeVariantStyles[variant]}>
                      <span>{child.label}</span>
                      {child.outcome && (
                        <span class="text-cyan ml-2 text-sm">→ {child.outcome}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
)
