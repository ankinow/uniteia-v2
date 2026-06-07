/**
 * MangaGrid VNE v2 — 12-panel sequential manga layout
 * VNE panel taxonomy + kawaii pose mapping + wide panel rhythm
 * Mobile: 1-col | Desktop: 2-col with wide panels spanning full width
 */
import { component$ } from '@builder.io/qwik'

export interface MangaPanel {
  id: string
  vneType:
    | 'hook'
    | 'myth'
    | 'promise'
    | 'analogy'
    | 'architecture'
    | 'code-peek'
    | 'decision'
    | 'warning'
    | 'benchmark'
    | 'hands-on'
    | 'result'
    | 'next-step'
  bgSrc: string
  bgAlt: string
  kawaiiSrc: string
  kawaiiAlt: string
  kawaiiPos: 'bottom-right' | 'bottom-left'
  step: number
  total: number
  wide?: boolean
  title: string
  body?: string
  list?: string[]
  codeSnippet?: string
}

interface MangaGridProps {
  panels: MangaPanel[]
}

// VNE pose mapping: panel type → kawaii pose
const POSE_LABEL: Record<string, string> = {
  hook: '🤔',
  myth: '🧐',
  promise: '✨',
  analogy: '📐',
  architecture: '🏗️',
  'code-peek': '⌨️',
  decision: '⚖️',
  warning: '⚠️',
  benchmark: '📊',
  'hands-on': '🔧',
  result: '🎉',
  'next-step': '🚀',
}

export const MangaGrid = component$<MangaGridProps>(({ panels }) => {
  return (
    <div class="vne-grid">
      {panels.map((panel, i) => (
        <article
          key={panel.id}
          class={`vne-panel vne-panel--${panel.vneType} ${panel.wide ? 'vne-panel--wide' : ''}`}
          style={{ gridArea: `p${String(i + 1).padStart(2, '0')}` }}
        >
          <div class="vne-panel__bg">
            <img
              src={panel.bgSrc}
              alt={panel.bgAlt}
              class="vne-panel__bg-img"
              loading={i < 3 ? 'eager' : 'lazy'}
              width={panel.wide ? 1920 : 1024}
              height={panel.wide ? 1080 : 768}
            />
          </div>

          <div class={`vne-panel__kawaii vne-panel__kawaii--${panel.kawaiiPos}`}>
            <img
              src={panel.kawaiiSrc}
              alt={panel.kawaiiAlt}
              class="vne-panel__kawaii-img"
              loading="lazy"
              width={256}
              height={256}
            />
          </div>

          <div class="vne-panel__badge" aria-hidden="true">
            <span class="vne-panel__step-num">
              {panel.step}/{panel.total}
            </span>
            <span class="vne-panel__step-emoji">{POSE_LABEL[panel.vneType] || ''}</span>
          </div>

          <div class="vne-panel__caption">
            <h3 class="vne-panel__title">{panel.title}</h3>
            {panel.body && <p class="vne-panel__body">{panel.body}</p>}
            {panel.list && (
              <ul class="vne-panel__list">
                {panel.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}
            {panel.codeSnippet && (
              <pre class="vne-panel__code">
                <code>{panel.codeSnippet}</code>
              </pre>
            )}
          </div>
        </article>
      ))}
    </div>
  )
})
