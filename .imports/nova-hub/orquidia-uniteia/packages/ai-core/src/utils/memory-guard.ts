/**
 * Memory Guard & Resource Monitor - SOTA 2026
 * Surgical, economic resource protection for low-end hardware.
 * AGENTIC∞: AgentOps component - Guardrails + Monitor
 */

import * as os from 'node:os'

export interface MemoryStatus {
  totalMB: number
  freeMB: number
  usedMB: number
  freePercent: number
  isSafe: boolean
  warnings: string[]
}

export interface ResourceGate {
  canProceed: boolean
  reason?: string
  action: 'proceed' | 'pause' | 'abort'
}

/**
 * AGENTIC∞ Eval-Dim: Cost + Safety check
 * Multi-dimensional resource evaluation
 */
export function checkMemory(): MemoryStatus {
  const total = os.totalmem()
  const free = os.freemem()
  const used = total - free

  const totalMB = Math.floor(total / 1024 / 1024)
  const freeMB = Math.floor(free / 1024 / 1024)
  const usedMB = Math.floor(used / 1024 / 1024)
  const freePercent = (free / total) * 100

  const warnings: string[] = []

  // Eval-Dim: Safety thresholds
  if (freeMB < 500) warnings.push('CRITICAL: <500MB free')
  else if (freeMB < 1000) warnings.push('WARNING: <1GB free')

  if (freePercent < 10) warnings.push('CRITICAL: <10% memory available')
  else if (freePercent < 20) warnings.push('WARNING: <20% memory available')

  // Eval-Dim: Cost (swap usage = performance cost)
  // Note: Requires additional system check for swap

  return {
    totalMB,
    freeMB,
    usedMB,
    freePercent,
    isSafe: freeMB >= 500 && freePercent >= 15,
    warnings,
  }
}

/**
 * AGENTIC∞ AgentOps: Guardrail - Pre-operation gate
 * RSIP_LOOP₄: Review phase
 */
export function operationGate(
  operation: 'scrape' | 'generate' | 'publish' | 'batch',
): ResourceGate {
  const mem = checkMemory()

  // Different gates for different operations
  const thresholds: Record<string, { minMB: number; minPercent: number }> = {
    scrape: { minMB: 600, minPercent: 15 }, // Hyperbrowser API needs less local mem
    generate: { minMB: 800, minPercent: 20 }, // AI generation needs working memory
    publish: { minMB: 400, minPercent: 10 }, // D1 API call is lightweight
    batch: { minMB: 1000, minPercent: 25 }, // Batch needs headroom
  }

  const threshold = thresholds[operation]

  if (mem.freeMB < threshold.minMB || mem.freePercent < threshold.minPercent) {
    return {
      canProceed: false,
      reason:
        `Memory gate blocked: ${mem.freeMB}MB free (${mem.freePercent.toFixed(1)}%). ` +
        `Required: ${threshold.minMB}MB / ${threshold.minPercent}%`,
      action: mem.freeMB < 300 ? 'abort' : 'pause',
    }
  }

  return { canProceed: true, action: 'proceed' }
}

/**
 * AGENTIC∞ RSIP_LOOP₄: Adapt phase
 * Force garbage collection if available
 */
export function forceGC(): void {
  if (global.gc) {
    global.gc()
    console.log('[MEMORY] Forced garbage collection')
  }
}

/**
 * AGENTIC∞ AgentOps: Monitor - Continuous monitoring
 */
export class MemoryMonitor {
  private interval: ReturnType<typeof setInterval> | null = null
  private history: Array<{ timestamp: number; freeMB: number }> = []

  start(intervalMs = 5000): void {
    this.interval = setInterval(() => {
      const mem = checkMemory()
      this.history.push({ timestamp: Date.now(), freeMB: mem.freeMB })

      // Keep last 100 samples
      if (this.history.length > 100) this.history.shift()

      // Log warnings
      if (mem.warnings.length > 0) {
        console.warn('[MEMORY MONITOR]', mem.warnings.join(', '))
      }
    }, intervalMs)
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  getTrend(): 'stable' | 'decreasing' | 'critical' {
    if (this.history.length < 10) return 'stable'

    const recent = this.history.slice(-10)
    const first = recent[0].freeMB
    const last = recent[recent.length - 1].freeMB
    const drop = first - last

    if (drop > 500) return 'critical'
    if (drop > 200) return 'decreasing'
    return 'stable'
  }
}

/**
 * Surgical memory pause - wait for GC or memory pressure to reduce
 */
export async function memoryPause(targetFreeMB = 800): Promise<void> {
  console.log(`[MEMORY] Pausing for GC... Target: ${targetFreeMB}MB`)

  for (let i = 0; i < 10; i++) {
    forceGC()
    await new Promise((r) => setTimeout(r, 500))

    const mem = checkMemory()
    if (mem.freeMB >= targetFreeMB) {
      console.log(`[MEMORY] Resumed. Now: ${mem.freeMB}MB free`)
      return
    }
  }

  console.warn('[MEMORY] Pause timeout - proceeding with caution')
}
