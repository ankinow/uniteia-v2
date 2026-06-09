/**
 * CEM 100x — Constraint Efficiency Metric (Canônico)
 *
 * Fórmula imutável. Calibrada para pipeline de conteúdo UniTeia.
 * Padrão: 100 iterações evolutivas. Target: CEM ≥ 0.95.
 *
 *    CEM = Σ(quality_gates_passed) / (LoC_changed + deps_called + phases_failed + 1)
 *           ─────────────────────   ──────────────────────────────────────────────
 *           numerator (↑ better)    denominator (↓ better)
 *
 * Onde:
 *   quality_gates_passed = deploy_gates_passed + test_pass_count + collage_count
 *   LoC_changed          = linhas alteradas no manifesto ou código
 *   deps_called          = número de chamadas externas (mega-factory, APIs, LLMs)
 *   phases_failed        = número de fases do pipeline que falharam
 *
 * A constante +1 no denominador previne divisão por zero.
 *
 * Interpretação:
 *   CEM < 0.30  → pipeline ineficiente (muito código, pouco resultado)
 *   CEM 0.30-0.60 → baseline aceitável
 *   CEM 0.60-0.85 → bom — otimização ativa
 *   CEM 0.85-0.95 → excelente — produção
 *   CEM ≥ 0.95    → SOTA — target 100x
 *
 * Meta: CEM monotonicamente crescente ao longo das iterações.
 * Se CEM ↓ em qualquer iteração → rollback da mutação.
 */

export interface CEMSnapshot {
  iteration: number
  timestamp: string

  // Numerator components
  deployGatesPassed: number
  deployGatesTotal: number
  testPassCount: number
  testTotalCount: number
  collageCount: number // número de collage JSONs gerados
  contentGraphNodes: number
  hreflangCount: number

  // Denominator components
  locChanged: number // linhas alteradas (git diff --stat)
  depsCalled: number // chamadas a scripts/APIs externas
  phasesFailed: number // fases do pipeline com erro

  // Computed
  cem: number // CEM = quality_gates_passed / (locChanged + depsCalled + phasesFailed + 1)

  // Metadata
  mutationsApplied: string[] // lista de mutações aplicadas nesta iteração
  rollback: boolean // true se esta iteração foi revertida
}

/**
 * Calcula CEM a partir dos componentes.
 * Target canônico: 100 iterações, CEM final ≥ 0.95.
 */
export function computeCEM(snap: Omit<CEMSnapshot, 'cem'>): number {
  const qualityGatesPassed = snap.deployGatesPassed + snap.testPassCount + snap.collageCount

  const denominator = snap.locChanged + snap.depsCalled + snap.phasesFailed + 1 // prevent division by zero

  return qualityGatesPassed / denominator
}

/**
 * Compara dois snapshots e retorna Δ.
 * Positivo = melhoria. Negativo = regressão → trigger rollback.
 */
export function deltaCEM(prev: CEMSnapshot, curr: CEMSnapshot): number {
  return curr.cem - prev.cem
}

/**
 * Valida se CEM está na trajetória esperada para 100x.
 * Interpolação linear: target_by_iteration = 0.65 + (0.30 * iteration / 100)
 */
export function cemOnTrack(snap: CEMSnapshot): boolean {
  const target = 0.65 + (0.3 * snap.iteration) / 100
  return snap.cem >= target - 0.05 // 5% tolerance band
}

// Constantes canônicas
export const CEM_TARGET = 0.95
export const CEM_ITERATIONS = 100
export const CEM_START_BASELINE = 0.65
