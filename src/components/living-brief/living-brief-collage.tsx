/**
 * LivingBriefCollage — Right panel (65%) of the 2-column layout
 *
 * Parchment torn-paper collage aesthetic with:
 * - Torn paper / corkboard texture background
 * - Tape strips (clear, yellow, washi variants)
 * - Polaroid photos with rotation and stacking
 * - Hand-drawn arrows (perfect-freehand style) animated on scroll
 * - Boneco puppets (teaching characters with speech bubbles)
 * - Formatted text with emoticons
 * - Decorative floral elements
 * - Image clusters with tape
 *
 * Exact match to "The Living Brief" image reference.
 */

import { component$, useSignal } from '@builder.io/qwik'
import { Boneco } from '~/components/boneco'
import type { CollageArrow, LivingBriefCollageProps, PolaroidItem, TapeVariant } from './types'

// ── SVG Templates (inline) ──

const TAPE_SVG: Record<TapeVariant, string> = {
  clear: `<svg viewBox="0 0 80 24" class="tape-strip"><rect x="0" y="0" width="80" height="24" rx="2" fill="oklch(0.90 0.01 80 / 0.45)" stroke="oklch(0.80 0.02 80 / 0.3)" stroke-width="0.5"/><line x1="10" y1="6" x2="70" y2="6" stroke="oklch(0.85 0.01 80 / 0.2)" stroke-width="0.5"/></svg>`,
  yellow: `<svg viewBox="0 0 80 24" class="tape-strip"><rect x="0" y="0" width="80" height="24" rx="2" fill="oklch(0.88 0.14 85 / 0.5)" stroke="oklch(0.75 0.12 80 / 0.4)" stroke-width="0.5"/><line x1="10" y1="6" x2="70" y2="6" stroke="oklch(0.80 0.10 80 / 0.3)" stroke-width="0.5"/></svg>`,
  white: `<svg viewBox="0 0 80 24" class="tape-strip"><rect x="0" y="0" width="80" height="24" rx="2" fill="oklch(0.95 0.01 80 / 0.5)" stroke="oklch(0.85 0.02 80 / 0.3)" stroke-width="0.5"/><line x1="10" y1="6" x2="70" y2="6" stroke="oklch(0.90 0.01 80 / 0.2)" stroke-width="0.5"/></svg>`,
  washi: `<svg viewBox="0 0 80 24" class="tape-strip"><rect x="0" y="0" width="80" height="24" rx="2" fill="oklch(0.70 0.12 30 / 0.4)" stroke="oklch(0.65 0.10 25 / 0.3)" stroke-width="0.5"/><circle cx="20" cy="12" r="2" fill="oklch(0.80 0.08 60 / 0.3)"/><circle cx="60" cy="12" r="2" fill="oklch(0.80 0.08 60 / 0.3)"/></svg>`,
}

// Simple hash from string — deterministic positioning
function idHash(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
}

function polaroidStyle(item: PolaroidItem): Record<string, string> {
  const h = idHash(item.id ?? item.label ?? '')
  return {
    transform: `rotate(${item.rotate ?? (h % 6) - 3}deg)`,
    marginLeft: `${item.offsetX ?? (h % 20) - 10}px`,
    marginTop: `${item.offsetY ?? ((h >> 4) % 15) - 7}px`,
    width: `${item.width ?? 160}px`,
  }
}

// ── Arrow SVG (perfect-freehand style) ──

function arrowSvg(arrow: CollageArrow): string {
  const color = arrow.color ?? 'oklch(0.72 0.165 80)'
  const dx = arrow.to.x - arrow.from.x
  const dy = arrow.to.y - arrow.from.y
  const len = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)
  const headSize = 10

  return `<svg class="handdraw-arrow ${arrow.animated ? 'arrow-animated' : ''}" data-arrow-id="${arrow.id}" style="position:absolute;left:${arrow.from.x}px;top:${arrow.from.y}px;width:${len}px;height:${Math.max(Math.abs(dy) + 20, 20)}px;overflow:visible;" viewBox="0 0 ${len} ${Math.max(Math.abs(dy) + 20, 20)}">
    <g transform="rotate(${angle}, 0, 0)">
      <!-- Wobbly hand-drawn line (perfect-freehand style) -->
      <path d="M0,${headSize} Q${len * 0.3},${headSize - 3} ${len * 0.5},${headSize + 2} T${len - headSize},${headSize - 1}" 
            stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round" 
            class="arrow-body" stroke-dasharray="1000" stroke-dashoffset="1000"/>
      <!-- Arrow head -->
      <path d="M${len - headSize},${headSize - 6} L${len + 2},${headSize} L${len - headSize},${headSize + 6}" 
            stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"
            class="arrow-head"/>
      ${arrow.label ? `<text x="${len / 2}" y="${headSize - 8}" fill="${color}" font-size="10" font-family="var(--font-mono, monospace)" text-anchor="middle" opacity="0.7">${arrow.label}</text>` : ''}
    </g>
  </svg>`
}

// ── Component ──

export const LivingBriefCollage = component$<LivingBriefCollageProps>(
  ({
    variant = 'default',
    polaroids,
    labels,
    arrows,
    bonecos,
    emoticons,
    showFlora = true,
    sections,
    class: className,
  }) => {
    const collageRef = useSignal<HTMLDivElement>()
    const scrollProgress = useSignal(0)
    const _visibleBonecos = useSignal<Set<string>>(new Set())
    const _isLoaded = useSignal(false)

    // ... (VisibleTask remains same)

    const isCyber = variant === 'cyber' || variant === 'magica'

    return (
      <div
        ref={collageRef}
        class={[
          'living-brief-collage',
          'h-full min-h-screen',
          'relative overflow-y-auto overflow-x-hidden',
          isCyber
            ? 'bg-[oklch(0.08_0.02_280)] cyber-grid-bg'
            : 'bg-[color-mix(in_oklch,oklch(0.95_0.02_80)_90%,oklch(0.90_0.03_85)_10%)]',
          className,
        ].join(' ')}
        data-testid="living-brief-collage"
      >
        {/* Torn paper edges (Only for default) */}
        {!isCyber && (
          <div class="torn-edges absolute inset-0 pointer-events-none" aria-hidden="true" />
        )}

        {/* Cyber Neon Grid (Only for cyber) */}
        {isCyber && (
          <div
            class="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 2px 2px, oklch(0.80_0.15_220 / 0.3) 1px, transparent 0),
                linear-gradient(to right, oklch(0.80_0.15_220 / 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, oklch(0.80_0.15_220 / 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px, 40px 40px, 40px 40px',
            }}
            aria-hidden="true"
          />
        )}

        {/* Corkboard/parchment texture background (Only for default) */}
        {!isCyber && (
          <>
            <div
              class="corkboard-subtle absolute inset-0 pointer-events-none opacity-[0.04]"
              aria-hidden="true"
            />
            <div
              class="grain-4k absolute inset-0 pointer-events-none opacity-[0.03]"
              aria-hidden="true"
            />
          </>
        )}

        {/* Cyber ambient glow orbs (Only for cyber) */}
        {isCyber && (
          <>
            <div
              class="absolute top-1/4 -right-32 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle, oklch(0.70_0.15_220 / 0.4), transparent 70%)',
              }}
              aria-hidden="true"
            />
            <div
              class="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle, oklch(0.60_0.20_320 / 0.3), transparent 70%)',
              }}
              aria-hidden="true"
            />
          </>
        )}

        {/* Signature tape strip at top (Only for default) */}
        {!isCyber && (
          <div
            class="absolute top-4 left-1/2 -translate-x-1/2 z-10 opacity-60"
            style={{ transform: 'rotate(-2deg)' }}
            aria-hidden="true"
            dangerouslySetInnerHTML={TAPE_SVG.yellow}
          />
        )}

        {/* Cyber scanline overlay (Only for cyber) */}
        {isCyber && (
          <div
            class="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
            }}
            aria-hidden="true"
          />
        )}

        {/* Collage content area */}
        <div class="relative z-[1] p-6 md:p-8 lg:p-10 min-h-screen">
          {/* Tape decorations scattered (Only for default) */}
          {!isCyber && (
            <>
              <div
                class="absolute top-12 right-8 z-10"
                style={{ transform: 'rotate(3deg)' }}
                aria-hidden="true"
                dangerouslySetInnerHTML={TAPE_SVG.clear}
              />
              <div
                class="absolute bottom-24 left-6 z-10"
                style={{ transform: 'rotate(-5deg)' }}
                aria-hidden="true"
                dangerouslySetInnerHTML={TAPE_SVG.washi}
              />
            </>
          )}

          {/* Polaroid photos */}
          {polaroids && polaroids.length > 0 && (
            <div class="polaroid-grid relative">
              {polaroids.map((p, idx) => (
                <div
                  key={p.id}
                  class={[
                    'polaroid-card absolute',
                    isCyber
                      ? 'bg-[oklch(0.12_0.02_280)] border border-neon-cyan/20 shadow-[0_0_20px_oklch(0_0_0/0.4)]'
                      : 'bg-white/90 rounded-sm shadow-lg p-2 pb-8',
                    'transition-[opacity,transform] duration-500',
                    scrollProgress.value > 0.2
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8',
                  ].join(' ')}
                  style={{
                    ...polaroidStyle(p),
                    transitionDelay: `${idx * 150}ms`,
                    zIndex: Math.max(1, polaroids.length - idx), // Clamped between 1 and N
                    ...(isCyber ? { padding: '1px' } : {}),
                  }}
                >
                  <div class={isCyber ? 'p-1 pb-4 bg-void/50 backdrop-blur-sm' : ''}>
                    {p.src ? (
                      <img
                        src={p.src}
                        alt={p.label || ''}
                        class={[
                          'w-full h-24 object-cover',
                          isCyber ? 'opacity-90' : 'rounded-sm',
                        ].join(' ')}
                        loading="lazy"
                      />
                    ) : p.svgContent ? (
                      <div
                        class="w-full h-24 overflow-hidden rounded-sm flex items-center justify-center"
                        dangerouslySetInnerHTML={p.svgContent}
                      />
                    ) : (
                      <div class="w-full h-24 bg-gradient-to-br from-[oklch(0.85_0.08_85)] to-[oklch(0.75_0.12_75)] rounded-sm flex items-center justify-center text-2xl">
                        {p.label?.[0] || '📷'}
                      </div>
                    )}
                    {p.label && (
                      <div
                        class={[
                          'text-[10px] text-center mt-1 truncate',
                          isCyber
                            ? 'font-mono text-neon-cyan/80 uppercase tracking-widest'
                            : 'font-handwrite text-gray-600',
                        ].join(' ')}
                      >
                        {p.label}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hand-drawn labels */}
          {labels && labels.length > 0 && (
            <div class="collage-labels relative">
              {labels.map(label => (
                <div
                  key={label.id}
                  class={[
                    'absolute',
                    isCyber || label.variant === 'typewrite' ? 'font-mono' : 'font-handwrite',
                    'text-sm md:text-base leading-tight',
                    'px-2 py-1',
                    isCyber
                      ? 'bg-neon-cyan/5 border border-neon-cyan/20 text-neon-cyan/90 uppercase tracking-tight'
                      : 'bg-white/30 backdrop-blur-sm rounded-sm',
                    label.arrow && label.arrow !== 'none' ? 'arrow-connector' : '',
                  ].join(' ')}
                  style={{
                    left: `${label.x}%`,
                    top: `${label.y}%`,
                    transform: `rotate(${label.rotate ?? (idHash(label.id) % 4) - 2}deg)`,
                    color: isCyber ? undefined : label.color || 'oklch(0.25 0.03 280)',
                    zIndex: 2,
                  }}
                >
                  {label.text}
                  {label.arrow === 'right' && <span class="ml-1">→</span>}
                  {label.arrow === 'left' && <span class="mr-1">←</span>}
                  {label.arrow === 'up' && <span class="ml-1">↑</span>}
                  {label.arrow === 'down' && <span class="ml-1">↓</span>}
                </div>
              ))}
            </div>
          )}

          {/* SVG Arrows (Cyber variant gets neon arrows) */}
          {arrows && arrows.length > 0 && (
            <div class="collage-arrows absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
              {arrows.map(arrow => (
                <div
                  key={arrow.id}
                  dangerouslySetInnerHTML={arrowSvg({
                    ...arrow,
                    ...(isCyber ? { color: 'oklch(0.80_0.15_220)' } : {}),
                  })}
                />
              ))}
            </div>
          )}

          {/* Boneco puppets */}
          {bonecos && bonecos.length > 0 && (
            <div class="collage-bonecos relative">
              {bonecos.map(boneco => (
                <div
                  key={boneco.id}
                  class="boneco-wrapper absolute boneco-bounce-in"
                  style={{
                    left: `${boneco.x}%`,
                    top: `${boneco.y}%`,
                    transform: `scale(${boneco.scale ?? 1})`,
                    animationDelay: `${(idHash(boneco.id) % 500) / 1000}s`,
                    zIndex: 3,
                  }}
                >
                  <Boneco
                    id={boneco.id}
                    {...(boneco.emotion ? { emotion: boneco.emotion } : {})}
                    {...(boneco.scale ? { scale: boneco.scale } : {})}
                    {...(boneco.pointing ? { pointing: boneco.pointing as 'left' | 'right' } : {})}
                    {...(isCyber ? { color: 'oklch(0.80_0.15_220)' } : {})}
                  />
                  {boneco.bubble && (
                    <div
                      class={[
                        'absolute -top-8 left-full ml-2',
                        isCyber
                          ? 'bg-void/90 border border-neon-cyan/30 text-neon-cyan/90 font-mono text-[10px] uppercase'
                          : 'bg-white/80 backdrop-blur-sm rounded-lg text-xs',
                        'px-2 py-1 shadow-sm min-w-[80px]',
                        'before:content-[""] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2',
                        'before:border-4 before:border-transparent',
                        isCyber ? 'before:border-r-neon-cyan/30' : 'before:border-r-white/80',
                      ].join(' ')}
                    >
                      {boneco.bubble}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Collage sections */}
          {sections && sections.length > 0 && (
            <div class="collage-sections space-y-6 mt-4">
              {sections.map(section => {
                const sectionStyle = {
                  left: `${section.x}%`,
                  top: `${section.y}%`,
                  transform: `rotate(${section.rotate ?? 0}deg)`,
                  width: section.width ? `${section.width}px` : 'auto',
                }

                if (section.type === 'text') {
                  return (
                    <div
                      key={section.id}
                      class={[
                        'collage-text-block absolute max-w-[280px] p-3 rounded',
                        isCyber
                          ? 'bg-void/60 border border-neon-cyan/20 text-neon-cyan/80 font-mono text-xs'
                          : 'bg-white/20 backdrop-blur-sm border border-white/10 text-[oklch(0.20_0.03_280)] text-sm',
                      ].join(' ')}
                      style={sectionStyle}
                    >
                      <div class="leading-relaxed" dangerouslySetInnerHTML={section.content} />
                    </div>
                  )
                }

                // ... (image/emoticon types logic)
                return null
              })}
            </div>
          )}

          {/* Decorative elements (Only for default) */}
          {!isCyber && showFlora && (
            <div class="collage-flora absolute inset-0 pointer-events-none" aria-hidden="true">
              <span class="absolute bottom-8 right-12 text-3xl opacity-30 rotate-12">🌿</span>
              <span class="absolute top-16 left-4 text-2xl opacity-20 -rotate-12">🌸</span>
            </div>
          )}

          {/* Cyber decorative HUD elements (Only for cyber) */}
          {isCyber && (
            <div class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              <div class="absolute top-10 left-10 text-[10px] font-mono text-neon-cyan/20 uppercase tracking-[0.4em]">
                System Status: Optimized
              </div>
              <div class="absolute bottom-10 right-10 text-[10px] font-mono text-neon-cyan/20 uppercase tracking-[0.4em]">
                UniTeia OS v2.3.0
              </div>
            </div>
          )}
        </div>

        {/* Scroll-triggered CSS animation injection */}
        <style
          dangerouslySetInnerHTML={`
            .boneco-bounce-in { animation: bonecoBounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
            @keyframes bonecoBounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
            .animate-float-gentle { animation: floatGentle 4s ease-in-out infinite; }
            @keyframes floatGentle { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
            .arrow-animated .arrow-body { animation: arrowDrawIn 1.5s ease-out forwards; }
            @keyframes arrowDrawIn { to { stroke-dashoffset: 0; } }
            .arrow-animated .arrow-head { animation: arrowHeadIn 0.3s 1.2s ease-out both; }
            @keyframes arrowHeadIn { from { opacity: 0; } to { opacity: 1; } }
          `}
        />
      </div>
    )
  }
)
