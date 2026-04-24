import {
  createContextId,
  useContext,
  useContextProvider,
  useStore,
  useTask$,
} from '@builder.io/qwik'

export const DOPAMINE_ROUTE_BUDGET = 2
export const DOPAMINE_SESSION_BUDGET = 1
export const DOPAMINE_SESSION_STORAGE_KEY = 'uniteia:dopamine-budget:v1'

export type DopamineWhisperState = 'ready' | 'spent' | 'blocked'
export type DopamineWhisperScope = 'route' | 'session'

export interface DopamineBudgetBucket {
  limit: number
  remaining: number
  consumed: number
}

export interface DopamineBudgetState {
  sessionId: string
  pathname: string
  isApexHost: boolean
  routeBudget: DopamineBudgetBucket
  sessionBudget: DopamineBudgetBucket
  whisperState: DopamineWhisperState
  lastResetReason: 'session-start' | 'route-change' | 'non-apex'
  lastResetAt: string
  lastConsumed: { scope: DopamineWhisperScope; source: string } | null
  lastSuppressed: { scope: DopamineWhisperScope; source: string; reason: string } | null
}

export interface DopamineBudgetDecision {
  allowed: boolean
  reason: 'apex-only' | 'route-spent' | 'session-spent' | 'ready'
  scope: DopamineWhisperScope
}

export interface DopamineBudgetSeed {
  pathname: string
  isApexHost: boolean
  sessionId?: string
}

export interface DopamineBudgetProviderOptions {
  isApexHost: boolean
  location: { url: { pathname: string } }
}

export const DOPAMINE_BUDGET_CTX = createContextId<DopamineBudgetState>('dopamine-budget')

function createSessionId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `dopamine-${Math.random().toString(36).slice(2, 10)}`
}

function nowIso(): string {
  return new Date().toISOString()
}

function createBudgetBucket(limit: number): DopamineBudgetBucket {
  return {
    limit,
    remaining: limit,
    consumed: 0,
  }
}

function recomputeWhisperState(state: DopamineBudgetState): void {
  if (!state.isApexHost) {
    state.whisperState = 'blocked'
    return
  }

  state.whisperState =
    state.routeBudget.remaining > 0 || state.sessionBudget.remaining > 0 ? 'ready' : 'spent'
}

function writeSessionSnapshot(state: DopamineBudgetState): void {
  if (typeof sessionStorage === 'undefined') return

  try {
    sessionStorage.setItem(
      DOPAMINE_SESSION_STORAGE_KEY,
      JSON.stringify({
        sessionId: state.sessionId,
        sessionBudget: state.sessionBudget,
        isApexHost: state.isApexHost,
      })
    )
  } catch {
    // Keep the shell usable if storage is unavailable or blocked.
  }
}

export function createDopamineBudgetState(seed: DopamineBudgetSeed): DopamineBudgetState {
  const sessionId = seed.sessionId ?? createSessionId()
  return {
    sessionId,
    pathname: seed.pathname,
    isApexHost: seed.isApexHost,
    routeBudget: createBudgetBucket(seed.isApexHost ? DOPAMINE_ROUTE_BUDGET : 0),
    sessionBudget: createBudgetBucket(seed.isApexHost ? DOPAMINE_SESSION_BUDGET : 0),
    whisperState: seed.isApexHost ? 'ready' : 'blocked',
    lastResetReason: seed.isApexHost ? 'session-start' : 'non-apex',
    lastResetAt: nowIso(),
    lastConsumed: null,
    lastSuppressed: null,
  }
}

export function resetDopamineRoute(state: DopamineBudgetState, pathname: string): void {
  state.pathname = pathname
  state.routeBudget = createBudgetBucket(state.isApexHost ? DOPAMINE_ROUTE_BUDGET : 0)
  state.lastResetReason = state.isApexHost ? 'route-change' : 'non-apex'
  state.lastResetAt = nowIso()
  state.lastSuppressed = null
  recomputeWhisperState(state)
  writeSessionSnapshot(state)
}

export function resetDopamineSession(state: DopamineBudgetState, pathname: string): void {
  state.pathname = pathname
  state.routeBudget = createBudgetBucket(state.isApexHost ? DOPAMINE_ROUTE_BUDGET : 0)
  state.sessionBudget = createBudgetBucket(state.isApexHost ? DOPAMINE_SESSION_BUDGET : 0)
  state.sessionId = createSessionId()
  state.lastResetReason = state.isApexHost ? 'session-start' : 'non-apex'
  state.lastResetAt = nowIso()
  state.lastConsumed = null
  state.lastSuppressed = null
  recomputeWhisperState(state)
  writeSessionSnapshot(state)
}

export function reserveRouteWhisper(
  state: DopamineBudgetState,
  source: string
): DopamineBudgetDecision {
  if (!state.isApexHost) {
    state.whisperState = 'blocked'
    state.lastSuppressed = { scope: 'route', source, reason: 'apex-only' }
    return { allowed: false, reason: 'apex-only', scope: 'route' }
  }

  if (state.routeBudget.remaining <= 0) {
    state.lastSuppressed = { scope: 'route', source, reason: 'route-spent' }
    recomputeWhisperState(state)
    return { allowed: false, reason: 'route-spent', scope: 'route' }
  }

  state.routeBudget.consumed += 1
  state.routeBudget.remaining -= 1
  state.lastConsumed = { scope: 'route', source }
  state.lastSuppressed = null
  recomputeWhisperState(state)
  writeSessionSnapshot(state)
  return { allowed: true, reason: 'ready', scope: 'route' }
}

export function reserveSessionWhisper(
  state: DopamineBudgetState,
  source: string
): DopamineBudgetDecision {
  if (!state.isApexHost) {
    state.whisperState = 'blocked'
    state.lastSuppressed = { scope: 'session', source, reason: 'apex-only' }
    return { allowed: false, reason: 'apex-only', scope: 'session' }
  }

  if (state.sessionBudget.remaining <= 0) {
    state.lastSuppressed = { scope: 'session', source, reason: 'session-spent' }
    recomputeWhisperState(state)
    return { allowed: false, reason: 'session-spent', scope: 'session' }
  }

  state.sessionBudget.consumed += 1
  state.sessionBudget.remaining -= 1
  state.lastConsumed = { scope: 'session', source }
  state.lastSuppressed = null
  recomputeWhisperState(state)
  writeSessionSnapshot(state)
  return { allowed: true, reason: 'ready', scope: 'session' }
}

export function useDopamineBudgetProvider(
  options: DopamineBudgetProviderOptions
): DopamineBudgetState {
  const budget = useStore<DopamineBudgetState>(() =>
    createDopamineBudgetState({
      pathname: options.location.url.pathname,
      isApexHost: options.isApexHost,
    })
  )

  useContextProvider(DOPAMINE_BUDGET_CTX, budget)

  useTask$(({ track }) => {
    const pathname = track(() => options.location.url.pathname)
    if (budget.pathname !== pathname) {
      resetDopamineRoute(budget, pathname)
    }
  })

  return budget
}

export function useDopamineBudget(): DopamineBudgetState {
  return useContext(DOPAMINE_BUDGET_CTX)
}
