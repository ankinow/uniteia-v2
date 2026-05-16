import { describe, expect, it } from 'vitest'
import {
  DOPAMINE_ROUTE_BUDGET,
  DOPAMINE_SESSION_BUDGET,
  createDopamineBudgetState,
  reserveRouteWhisper,
  reserveSessionWhisper,
  resetDopamineRoute,
  resetDopamineSession,
} from '~/stores/dopamine-budget'

describe('createDopamineBudgetState', () => {
  it('seeds an apex route with the shared route and session whisper budgets available', () => {
    const state = createDopamineBudgetState({ pathname: '/en/signals', isApexHost: true })

    expect(state.isApexHost).toBe(true)
    expect(state.pathname).toBe('/en/signals')
    expect(state.routeBudget.remaining).toBe(DOPAMINE_ROUTE_BUDGET)
    expect(state.routeBudget.consumed).toBe(0)
    expect(state.sessionBudget.remaining).toBe(DOPAMINE_SESSION_BUDGET)
    expect(state.sessionBudget.consumed).toBe(0)
    expect(state.whisperState).toBe('ready')
    expect(state.lastResetReason).toBe('session-start')
  })

  it('spends the route budget once per route and restores it when the route changes', () => {
    const state = createDopamineBudgetState({ pathname: '/en/signals/ai-agents', isApexHost: true })

    expect(reserveRouteWhisper(state, 'dopamine-card')).toMatchObject({
      allowed: true,
      scope: 'route',
    })
    expect(reserveRouteWhisper(state, 'dopamine-card')).toMatchObject({
      allowed: true,
      scope: 'route',
    })
    expect(reserveRouteWhisper(state, 'dopamine-card')).toMatchObject({
      allowed: false,
      reason: 'route-spent',
      scope: 'route',
    })
    expect(state.routeBudget.remaining).toBe(0)
    expect(state.routeBudget.consumed).toBe(DOPAMINE_ROUTE_BUDGET)

    resetDopamineRoute(state, '/en/signals/language-models')

    expect(state.pathname).toBe('/en/signals/language-models')
    expect(state.routeBudget.remaining).toBe(DOPAMINE_ROUTE_BUDGET)
    expect(state.routeBudget.consumed).toBe(0)
    expect(state.whisperState).toBe('ready')
    expect(reserveRouteWhisper(state, 'dopamine-card')).toMatchObject({
      allowed: true,
      scope: 'route',
    })
  })

  it('spends the session budget once and reseeds it for a fresh session', () => {
    const state = createDopamineBudgetState({ pathname: '/en/test-article', isApexHost: true })

    expect(reserveSessionWhisper(state, 'quality-ring')).toMatchObject({
      allowed: true,
      scope: 'session',
    })
    expect(reserveSessionWhisper(state, 'quality-ring')).toMatchObject({
      allowed: false,
      reason: 'session-spent',
      scope: 'session',
    })
    expect(state.sessionBudget.remaining).toBe(0)
    expect(state.sessionBudget.consumed).toBe(DOPAMINE_SESSION_BUDGET)

    resetDopamineSession(state, '/en/test-article')

    expect(state.pathname).toBe('/en/test-article')
    expect(state.sessionBudget.remaining).toBe(DOPAMINE_SESSION_BUDGET)
    expect(state.sessionBudget.consumed).toBe(0)
    expect(state.routeBudget.remaining).toBe(DOPAMINE_ROUTE_BUDGET)
    expect(state.whisperState).toBe('ready')
    expect(reserveSessionWhisper(state, 'quality-ring')).toMatchObject({
      allowed: true,
      scope: 'session',
    })
  })

  it('blocks whispers on non-apex hosts', () => {
    const state = createDopamineBudgetState({ pathname: '/en/signals', isApexHost: false })

    expect(state.routeBudget.remaining).toBe(0)
    expect(state.sessionBudget.remaining).toBe(0)
    expect(state.whisperState).toBe('blocked')
    expect(reserveRouteWhisper(state, 'dopamine-card')).toMatchObject({
      allowed: false,
      reason: 'apex-only',
      scope: 'route',
    })
    expect(reserveSessionWhisper(state, 'quality-ring')).toMatchObject({
      allowed: false,
      reason: 'apex-only',
      scope: 'session',
    })
  })
})
