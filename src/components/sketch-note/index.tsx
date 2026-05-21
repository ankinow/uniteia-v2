import { component$ } from '@builder.io/qwik'
import type { SketchNoteProps, SketchNoteVariant } from './types'

const VARIANT_STYLES: Record<SketchNoteVariant, { accent: string; border: string }> = {
  insight: {
    accent: 'var(--color-cyan)',
    border: 'color-mix(in srgb, var(--color-cyan) 25%, transparent)',
  },
  tip: {
    accent: 'var(--color-gold)',
    border: 'color-mix(in srgb, var(--color-gold) 25%, transparent)',
  },
  warning: {
    accent: 'var(--color-caution)',
    border: 'color-mix(in srgb, var(--color-caution) 25%, transparent)',
  },
  highlight: {
    accent: 'var(--color-acid)',
    border: 'color-mix(in srgb, var(--color-acid) 25%, transparent)',
  },
}

const VARIANT_GLOW: Record<SketchNoteVariant, string> = {
  insight: '0 0 12px color-mix(in srgb, var(--color-cyan) 20%, transparent)',
  tip: '0 0 12px color-mix(in srgb, var(--color-gold) 20%, transparent)',
  warning: '0 0 12px color-mix(in srgb, var(--color-caution) 20%, transparent)',
  highlight: '0 0 12px color-mix(in srgb, var(--color-acid) 20%, transparent)',
}

export const SketchNote = component$<SketchNoteProps>(
  ({ title, content, icon, variant = 'insight', class: className }) => {
    const cfg = VARIANT_STYLES[variant]
    const glow = VARIANT_GLOW[variant]
    const rotation = Math.random() * 1 - 0.5

    return (
      <div
        class={['relative overflow-hidden p-6', 'grain-4k paper-fiber', className]}
        style={{
          borderRadius: '60% 40% 50% 30% / 40% 50% 30% 60%',
          transform: `rotate(${rotation}deg)`,
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--raised) 20%, transparent), transparent)',
          border: `1px solid ${cfg.border}`,
          boxShadow: glow,
        }}
      >
        <div class="relative z-[1]">
          <div class="flex items-center gap-3 mb-3">
            {icon && (
              <span class="text-lg" aria-hidden="true">
                {icon}
              </span>
            )}
            <h4
              class="font-display text-base font-semibold"
              style={{
                color: cfg.accent,
                borderBottom: `2px solid ${cfg.border}`,
                display: 'inline-block',
                paddingBottom: '0.125rem',
              }}
            >
              {title}
            </h4>
          </div>
          <p class="text-sm text-bone leading-relaxed max-w-prose">{content}</p>
        </div>
      </div>
    )
  }
)

export type { SketchNoteProps, SketchNoteVariant }
