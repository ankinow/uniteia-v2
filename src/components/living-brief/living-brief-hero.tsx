/**
 * LivingBriefHero — Left panel (35%) of the 2-column layout
 *
 * Dark background with glowing title, descriptive text, hashtags, and CTA buttons.
 * Exact match to "The Living Brief" image reference: yellow glowing title,
 * purple description, hashtags row, action buttons.
 */

import { component$ } from '@builder.io/qwik'
import type { LivingBriefHeroProps } from './types'

export const LivingBriefHero = component$<LivingBriefHeroProps>(
  ({ title, subtitle, hashtags, buttons, variant = 'default' }) => {
    return (
      <div
        class={[
          'living-brief-hero',
          'h-full min-h-screen',
          'flex flex-col justify-center items-start',
          'px-8 md:px-12 py-16',
          'bg-gradient-to-b from-[oklch(0.12_0.04_280)] to-[oklch(0.08_0.05_280)]',
          'relative overflow-hidden',
          variant === 'magica' ? 'magica-hero-variant' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        data-testid="living-brief-hero"
      >
        {/* Ambient glow orbs */}
        <div
          class="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, oklch(0.70_0.15_75 / 0.4), transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div
          class="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, oklch(0.55_0.10_190 / 0.3), transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Glowing title — yellow/amber gradient */}
        <h1
          class={[
            'text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight',
            'bg-gradient-to-r from-[oklch(0.85_0.18_85)] via-[oklch(0.80_0.20_75)] to-[oklch(0.75_0.22_65)]',
            'bg-clip-text text-transparent',
            'drop-shadow-[0_0_30px_oklch(0.80_0.20_75/0.3)]',
            'mb-6',
          ].join(' ')}
        >
          {title}
        </h1>

        {/* Description — purple/violet tone */}
        {subtitle && (
          <p
            class={[
              'text-lg md:text-xl leading-relaxed max-w-md',
              'text-[oklch(0.65_0.14_290)]',
              'mb-8',
              'font-light',
            ].join(' ')}
          >
            {subtitle}
          </p>
        )}

        {/* Hashtags row */}
        {hashtags && hashtags.length > 0 && (
          <div class="flex flex-wrap gap-2 mb-10">
            {hashtags.map((tag, idx) => (
              <span
                key={idx}
                class={[
                  'inline-block px-3 py-1',
                  'text-sm font-mono tracking-tight',
                  'rounded-full',
                  'bg-white/5 border border-white/10',
                  'text-[oklch(0.50_0.08_280)]',
                  'hover:bg-white/10 hover:border-action/30 transition-colors',
                ].join(' ')}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA Buttons */}
        {buttons && buttons.length > 0 && (
          <div class="flex flex-wrap gap-4">
            {buttons.map((btn, idx) => {
              const variantStyles = {
                primary:
                  'bg-[oklch(0.55_0.18_265)] hover:bg-[oklch(0.50_0.20_265)] text-white font-semibold shadow-lg shadow-[oklch(0.55_0.18_265/0.3)]',
                secondary:
                  'border border-white/20 hover:border-white/40 text-[oklch(0.70_0.10_280)] font-medium',
                ghost: 'text-[oklch(0.50_0.08_280)] hover:text-[oklch(0.60_0.12_280)]',
              }
              return (
                <a
                  key={idx}
                  href={btn.href || '#'}
                  class={[
                    'inline-flex items-center gap-2',
                    'px-5 py-2.5 rounded-lg',
                    'text-sm tracking-wide uppercase',
                    'transition-all duration-200',
                    variantStyles[btn.variant || 'secondary'],
                  ].join(' ')}
                >
                  {btn.icon && <span class="text-base">{btn.icon}</span>}
                  {btn.label}
                </a>
              )
            })}
          </div>
        )}

        {/* Decorative scanline overlay (subtle) */}
        <div
          class="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)',
          }}
          aria-hidden="true"
        />
      </div>
    )
  }
)
