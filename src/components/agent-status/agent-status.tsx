/**
 * AgentStatus — Agentic status indicators (thinking, idle, processing, complete)
 *
 * Visual indicators for agent/system state:
 * - idle: static pulse, awaiting input
 * - thinking: animated three-dot wave
 * - processing: indeterminate progress bar
 * - complete: checkmark glow
 * - error: warning indicator
 *
 * Accessible with aria-live="polite" for screen readers.
 * Bundle-safe: pure CSS + inline SVG, zero dependencies.
 * Supports i18n via optional `t` prop (agent.status.{idle|thinking|processing|complete|error}).
 */

import { component$ } from '@builder.io/qwik'

export type AgentState = 'idle' | 'thinking' | 'processing' | 'complete' | 'error'

export interface AgentStatusProps {
  class?: string
  state?: AgentState
  label?: string // explicit override — overrides i18n
  size?: 'sm' | 'md' | 'lg'
  accent?: string // CSS color override
  compact?: boolean // hide label, show icon only
  t?: {
    status: Record<AgentState, string>
    mcpTooltip?: string
  }
}

const StateDots = ({ count = 3 }: { count?: number }) => (
  <span class="animate-thinking" aria-hidden="true">
    {Array.from({ length: count }, (_, i) => (
      <span key={i} />
    ))}
  </span>
)

const PulseDot = () => (
  <span class="inline-block w-2 h-2 rounded-full animate-breathe bg-current" aria-hidden="true" />
)

const CheckMark = () => (
  <svg class="inline-block w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8.5L6.5 12L13 4"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)

const WarningIcon = () => (
  <svg class="inline-block w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 1L1 14h14L8 1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
    <path d="M8 5v4M8 11.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  </svg>
)

export const AgentStatus = component$<AgentStatusProps>(props => {
  const { class: classList, state = 'idle', label, size = 'md', accent, compact = false, t } = props

  const fallbackLabels: Record<AgentState, string> = {
    idle: 'Aether OS · Idle',
    thinking: 'Aether OS · Thinking',
    processing: 'Aether OS · Processing',
    complete: 'Aether OS · Complete',
    error: 'Aether OS · Error',
  }

  const stateColors: Record<AgentState, string> = {
    idle: 'var(--color-bone-muted, #b8b0a0)',
    thinking: 'var(--color-cyan, oklch(0.75 0.18 200))',
    processing: 'var(--color-action, oklch(0.72 0.22 22))',
    complete: 'var(--color-verified, oklch(0.79 0.18 145))',
    error: 'var(--color-unsafe, oklch(0.65 0.2 30))',
  }

  const sizeClasses = {
    sm: 'text-[10px] gap-1',
    md: 'text-xs gap-1.5',
    lg: 'text-sm gap-2',
  }

  const color = accent || stateColors[state]
  const displayLabel = label ?? (t?.status?.[state] || fallbackLabels[state])
  const mcpTip = t?.mcpTooltip || 'MCP Server Connected · 7 tools active'

  return (
    <output
      class={['agent-status inline-flex items-center', sizeClasses[size], classList]}
      style={{ color }}
      aria-live="polite"
      aria-label={displayLabel}
      data-tooltip={mcpTip}
    >
      {/* Icon */}
      {state === 'idle' && <PulseDot />}
      {state === 'thinking' && <StateDots />}
      {state === 'processing' && (
        <span class="w-12" aria-hidden="true">
          <span class="progress-indeterminate" />
        </span>
      )}
      {state === 'complete' && <CheckMark />}
      {state === 'error' && <WarningIcon />}

      {/* Label */}
      {!compact && (
        <span class="agent-status__label font-mono uppercase tracking-wider">{displayLabel}</span>
      )}
    </output>
  )
})
