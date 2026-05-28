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

import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type {
  BonecoItem,
  CollageArrow,
  LivingBriefCollageProps,
  PolaroidItem,
  TapeVariant,
} from './types'

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

// ── Boneco SVG Generator (cartoon hand-drawn puppet) ──

function bonecoSvg(boneco: BonecoItem): string {
  const colors = {
    happy: {
      skin: 'oklch(0.80 0.08 60)',
      hair: 'oklch(0.25 0.03 280)',
      eye: 'oklch(0.15 0.02 280)',
    },
    thinking: {
      skin: 'oklch(0.78 0.06 55)',
      hair: 'oklch(0.30 0.04 270)',
      eye: 'oklch(0.15 0.02 280)',
    },
    teaching: {
      skin: 'oklch(0.82 0.07 65)',
      hair: 'oklch(0.20 0.03 290)',
      eye: 'oklch(0.12 0.02 280)',
    },
    excited: {
      skin: 'oklch(0.85 0.10 70)',
      hair: 'oklch(0.25 0.04 275)',
      eye: 'oklch(0.15 0.02 280)',
    },
    confused: {
      skin: 'oklch(0.75 0.05 50)',
      hair: 'oklch(0.28 0.03 285)',
      eye: 'oklch(0.15 0.02 280)',
    },
  }
  const c = colors[boneco.emotion ?? 'teaching']
  const scale = boneco.scale ?? 1
  const s = (n: number) => Math.round(n * scale)

  // Direction of pointer hand
  const pointerHand = boneco.pointing
    ? `<path d="M${s(36)},${s(38)} L${s(boneco.pointing === 'right' ? 54 : 18)},${s(38)}" stroke="${c.skin}" stroke-width="${s(3)}" stroke-linecap="round" fill="none"/>`
    : ''

  return `<svg viewBox="0 0 64 88" width="${s(64)}" height="${s(88)}" class="boneco-puppet ${boneco.emotion ? `boneco-${boneco.emotion}` : ''}" data-boneco-id="${boneco.id}">
    <!-- Hair -->
    <ellipse cx="${s(32)}" cy="${s(16)}" rx="${s(14)}" ry="${s(10)}" fill="${c.hair}" opacity="0.9"/>
    <!-- Head -->
    <ellipse cx="${s(32)}" cy="${s(22)}" rx="${s(11)}" ry="${s(12)}" fill="${c.skin}" stroke="${c.skin}" stroke-width="0.5"/>
    <!-- Eyes -->
    <circle cx="${s(27)}" cy="${s(20)}" r="${s(2)}" fill="${c.eye}"/>
    <circle cx="${s(37)}" cy="${s(20)}" r="${s(2)}" fill="${c.eye}"/>
    <!-- Eye highlights -->
    <circle cx="${s(28)}" cy="${s(19)}" r="${s(0.8)}" fill="oklch(1 0 0 / 0.6)"/>
    <circle cx="${s(38)}" cy="${s(19)}" r="${s(0.8)}" fill="oklch(1 0 0 / 0.6)"/>
    <!-- Smile / expression -->
    ${
      boneco.emotion === 'happy' || boneco.emotion === 'excited'
        ? `<path d="M${s(27)},${s(27)} Q${s(32)},${s(32)} ${s(37)},${s(27)}" stroke="${c.eye}" stroke-width="${s(1.5)}" fill="none" stroke-linecap="round"/>`
        : boneco.emotion === 'thinking'
          ? `<circle cx="${s(32)}" cy="${s(27)}" r="${s(2)}" fill="oklch(0.60 0.05 280 / 0.3)"/>`
          : boneco.emotion === 'confused'
            ? `<path d="M${s(26)},${s(27)} Q${s(32)},${s(25)} ${s(38)},${s(27)}" stroke="${c.eye}" stroke-width="${s(1.5)}" fill="none" stroke-linecap="round"/>`
            : `<path d="M${s(27)},${s(27)} Q${s(32)},${s(30)} ${s(37)},${s(27)}" stroke="${c.eye}" stroke-width="${s(1.5)}" fill="none" stroke-linecap="round"/>`
    }
    <!-- Body -->
    <rect x="${s(24)}" y="${s(34)}" width="${s(16)}" height="${s(20)}" rx="${s(3)}" fill="oklch(0.40 0.10 265 / 0.7)"/>
    <!-- Arms -->
    <path d="M${s(24)},${s(38)} L${s(14)},${s(48)}" stroke="${c.skin}" stroke-width="${s(3)}" stroke-linecap="round" fill="none"/>
    ${pointerHand}
    <path d="M${s(40)},${s(38)} L${s(50)},${s(48)}" stroke="${c.skin}" stroke-width="${s(3)}" stroke-linecap="round" fill="none"/>
    <!-- Legs -->
    <path d="M${s(27)},${s(54)} L${s(22)},${s(68)}" stroke="${c.skin}" stroke-width="${s(3)}" stroke-linecap="round" fill="none"/>
    <path d="M${s(37)},${s(54)} L${s(42)},${s(68)}" stroke="${c.skin}" stroke-width="${s(3)}" stroke-linecap="round" fill="none"/>
  </svg>`
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
    const visibleBonecos = useSignal<Set<string>>(new Set())
    const isLoaded = useSignal(false)

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
      const el = collageRef.value
      if (!el) return

      // Mark as loaded for tape-peel animation
      isLoaded.value = true

      const handleScroll = () => {
        const rect = el.getBoundingClientRect()
        const viewportH = window.innerHeight
        const progress = Math.max(
          0,
          Math.min(1, (viewportH - rect.top) / (viewportH + rect.height))
        )
        scrollProgress.value = progress

        // Intersection-based boneco visibility (Motion Canvas boneco-bounce)
        const bonecosEls = el.querySelectorAll('[data-boneco-id]')
        for (let i = 0; i < bonecosEls.length; i++) {
          const bEl = bonecosEls.item(i)
          const bRect = bEl.getBoundingClientRect()
          const isVisible = bRect.top < viewportH - 50 && bRect.bottom > 50
          if (isVisible) {
            visibleBonecos.value = new Set([
              ...visibleBonecos.value,
              bEl.getAttribute('data-boneco-id') || '',
            ])
          }
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()

      cleanup(() => window.removeEventListener('scroll', handleScroll))
    })

    return (
      <div
        ref={collageRef}
        class={[
          'living-brief-collage',
          'h-full min-h-screen',
          'relative overflow-y-auto overflow-x-hidden',
          'bg-[color-mix(in_oklch,oklch(0.95_0.02_80)_90%,oklch(0.90_0.03_85)_10%)]',
          className,
        ].join(' ')}
        data-testid="living-brief-collage"
      >
        {/* Torn paper edges (CSS pseudo-elements via class) */}
        <div class="torn-edges absolute inset-0 pointer-events-none" aria-hidden="true" />

        {/* Corkboard/parchment texture background */}
        <div
          class="corkboard-subtle absolute inset-0 pointer-events-none opacity-[0.04]"
          aria-hidden="true"
        />
        <div
          class="grain-4k absolute inset-0 pointer-events-none opacity-[0.03]"
          aria-hidden="true"
        />

        {/* Signature tape strip at top */}
        <div
          class="absolute top-4 left-1/2 -translate-x-1/2 z-10 opacity-60"
          style={{ transform: 'rotate(-2deg)' }}
          aria-hidden="true"
          dangerouslySetInnerHTML={TAPE_SVG.yellow}
        />

        {/* Collage content area */}
        <div class="relative z-[1] p-6 md:p-8 lg:p-10 min-h-screen">
          {/* Tape decorations scattered */}
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

          {/* Polaroid photos */}
          {polaroids && polaroids.length > 0 && (
            <div class="polaroid-grid relative">
              {polaroids.map((p, idx) => (
                <div
                  key={p.id}
                  class={[
                    'polaroid-card absolute',
                    'bg-white/90 rounded-sm shadow-lg',
                    'p-2 pb-8',
                    'transition-all duration-500',
                    scrollProgress.value > 0.2
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8',
                  ].join(' ')}
                  style={{
                    ...polaroidStyle(p),
                    transitionDelay: `${idx * 150}ms`,
                    zIndex: Math.max(1, polaroids.length - idx), // Clamped between 1 and N
                  }}
                >
                  {p.src ? (
                    <img
                      src={p.src}
                      alt={p.label || ''}
                      class="w-full h-24 object-cover rounded-sm"
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
                    <div class="text-[10px] text-center mt-1 font-handwrite text-gray-600 truncate">
                      {p.label}
                    </div>
                  )}
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
                    label.variant === 'typewrite' ? 'font-mono' : 'font-handwrite',
                    'text-sm md:text-base leading-tight',
                    'px-2 py-1',
                    'bg-white/30 backdrop-blur-sm rounded-sm',
                    label.arrow && label.arrow !== 'none' ? 'arrow-connector' : '',
                  ].join(' ')}
                  style={{
                    left: `${label.x}%`,
                    top: `${label.y}%`,
                    transform: `rotate(${label.rotate ?? (idHash(label.id) % 4) - 2}deg)`,
                    color: label.color || 'oklch(0.25 0.03 280)',
                    zIndex: 2, // Above tape (1), below polaroids (3)
                  }}
                >
                  {label.text}
                  {/* Arrow emoji as simple connector */}
                  {label.arrow === 'right' && <span class="ml-1">→</span>}
                  {label.arrow === 'left' && <span class="mr-1">←</span>}
                  {label.arrow === 'up' && <span class="ml-1">↑</span>}
                  {label.arrow === 'down' && <span class="ml-1">↓</span>}
                </div>
              ))}
            </div>
          )}

          {/* SVG Arrows (perfect-freehand style) */}
          {arrows && arrows.length > 0 && (
            <div class="collage-arrows absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
              {arrows.map(arrow => (
                <div key={arrow.id} dangerouslySetInnerHTML={arrowSvg(arrow)} />
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
                    zIndex: 3, // Above polaroids, below arrows
                  }}
                >
                  <div dangerouslySetInnerHTML={bonecoSvg(boneco)} />
                  {boneco.bubble && (
                    <div
                      class={[
                        'absolute -top-8 left-full ml-2',
                        'bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1',
                        'text-xs max-w-[120px]',
                        'shadow-sm',
                        'before:content-[""] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2',
                        'before:border-4 before:border-transparent before:border-r-white/80',
                      ].join(' ')}
                    >
                      {boneco.bubble}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Emoticon badges */}
          {emoticons && emoticons.length > 0 && (
            <div class="collage-emoticons absolute inset-0 pointer-events-none">
              {emoticons.map((emoji, idx) => (
                <span
                  key={idx}
                  class="emoticon-badge absolute text-lg md:text-xl animate-float-gentle"
                  style={{
                    left: `${10 + idx * 15}%`,
                    top: `${30 + (idx % 3) * 20}%`,
                    animationDelay: `${idx * 0.3}s`,
                    animationDuration: `${3 + idx * 0.5}s`,
                  }}
                  aria-hidden="true"
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}

          {/* Collage sections (formatted content blocks) */}
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
                      class="collage-text-block absolute max-w-[280px] p-3 bg-white/20 backdrop-blur-sm rounded border border-white/10"
                      style={sectionStyle}
                    >
                      <div
                        class="text-sm leading-relaxed text-[oklch(0.20_0.03_280)]"
                        dangerouslySetInnerHTML={section.content}
                      />
                    </div>
                  )
                }

                if (section.type === 'emoticon') {
                  return (
                    <span
                      key={section.id}
                      class="absolute text-2xl animate-float-gentle"
                      style={sectionStyle}
                      aria-hidden="true"
                    >
                      {section.content}
                    </span>
                  )
                }

                if (section.type === 'teach-image' || section.type === 'image') {
                  return (
                    <div
                      key={section.id}
                      class="teach-image absolute rounded-sm shadow-md overflow-hidden"
                      style={{
                        ...sectionStyle,
                        width: section.width ? `${section.width}px` : '140px',
                      }}
                    >
                      <div class="w-full h-20 bg-gradient-to-br from-[oklch(0.80_0.10_85)] to-[oklch(0.65_0.15_75)] flex items-center justify-center text-white text-lg font-bold">
                        📖
                      </div>
                      <div class="text-[10px] p-1 bg-white/70 text-center truncate">
                        {section.content}
                      </div>
                      {/* Tiny tape */}
                      <div
                        class="absolute -top-1 left-1/2 -translate-x-1/2 opacity-60"
                        style={{ transform: 'rotate(-1deg)' }}
                        aria-hidden="true"
                        dangerouslySetInnerHTML={TAPE_SVG.clear}
                      />
                    </div>
                  )
                }

                return null
              })}
            </div>
          )}

          {/* Decorative floral elements */}
          {showFlora && (
            <div class="collage-flora absolute inset-0 pointer-events-none" aria-hidden="true">
              <span
                class="absolute bottom-8 right-12 text-3xl opacity-30 rotate-12"
                style={{ filter: 'grayscale(0.5)' }}
              >
                🌿
              </span>
              <span class="absolute top-16 left-4 text-2xl opacity-20 -rotate-12">🌸</span>
              <span class="absolute bottom-16 left-1/4 text-xl opacity-25 rotate-45">🌺</span>
              <span class="absolute top-1/3 right-4 text-lg opacity-15 -rotate-6">🍃</span>
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
