/**
 * CanvaMagicaOverview — SOTA Architectural Blueprint (2026-06)
 * Refactored to "Infographic OS" style following user reference.
 *
 * PLANO-076: technical blueprint, 5 sections, integrated diagrams,
 * oklch tokens, responsive grid-areas, zero-textless policy (mostly).
 *
 * IMPROVEMENTS (v3.1):
 * - Fixed i18n: All strings mapped to useCanvaMagicaT.
 * - Improved animations: CSS-driven by isVisible signal.
 * - Design System Icons: Replaced emojis with Sketchnote icons.
 * - Cleanup: Removed CLI commands from public UI.
 */
import { component$, useSignal, useStylesScoped$, useVisibleTask$ } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'

import { useCanvaMagicaT } from '~/hooks/useCanvaI18n'
import type { SupportedLanguage } from '~/i18n/types'
import { CodeIcon, FlowIcon, HubIcon, MagnetIcon, RobotIcon } from '../sketchnote/icons'
import styles from './canva.module.css?inline'
import {
  MagicaCommandCenterDiagram,
  McpArchitectureDiagram,
  QuickstartFlowDiagram,
  TencentStackDiagram,
} from './diagrams'

interface CanvaMagicaProps {
  qualityScore?: number
  languages?: number
}

export const CanvaMagicaOverview = component$<CanvaMagicaProps>(
  ({ qualityScore = 84, languages = 8 }) => {
    const loc = useLocation()
    const lang = (loc.params.lang as SupportedLanguage) || 'en'
    useStylesScoped$(styles)

    const t = useCanvaMagicaT(lang)
    const isVisible = useSignal(false)

    useVisibleTask$(() => {
      // Small delay to ensure paint before animation starts
      const timer = setTimeout(() => {
        isVisible.value = true
      }, 50)
      return () => clearTimeout(timer)
    })

    return (
      <section
        class={`blueprint-container ${isVisible.value ? 'visible' : ''}`}
        aria-label={t.workflowVisualization}
        data-lang={lang}
      >
        {/* Decorative Grid Overlay */}
        <div class="blueprint-grid-overlay" aria-hidden="true" />

        {/* Top Header: Brand & Title */}
        <div class="blueprint-header">
          <div class="header-icon">
            <HubIcon size={60} />
          </div>
          <div class="header-content">
            <h1 class="header-title">
              <span class="prefix">{t.keyMetrics}:</span>
              {t.magicaWorkflowBuilder}
            </h1>
          </div>
        </div>

        {/* Main Blueprint Grid */}
        <div class="blueprint-main-grid">
          {/* Section 1: Command Center */}
          <article class="blueprint-section section-1" style={{ '--stagger': 1 }}>
            <div class="section-header">
              <span class="section-num">1</span>
              <h2 class="section-title">{t.magicaCommandCenter}</h2>
            </div>
            <div class="section-body material-glass">
              <div class="diagram-wrapper">
                <MagicaCommandCenterDiagram />
              </div>
              <footer class="section-footer">
                <div class="pill cyan">{t.pillBudgetGate}</div>
                <div class="pill gold">{t.pillSloRouter}</div>
              </footer>
            </div>
          </article>

          {/* Section 2: MCP Runtime */}
          <article class="blueprint-section section-2" style={{ '--stagger': 2 }}>
            <div class="section-header">
              <span class="section-num">2</span>
              <h2 class="section-title">{t.aiProcessing}</h2>
            </div>
            <div class="section-body material-carbon">
              <div class="diagram-wrapper">
                <McpArchitectureDiagram />
              </div>
              <footer class="section-footer">
                <div class="pill">{t.nodeBasedPromptChaining}</div>
                <div class="pill">{t.pillToolInjection}</div>
              </footer>
            </div>
          </article>

          {/* Section 3: Delivery Flow */}
          <article class="blueprint-section section-3" style={{ '--stagger': 3 }}>
            <div class="section-header">
              <span class="section-num">3</span>
              <h2 class="section-title">{t.workflowSteps}</h2>
            </div>
            <div class="section-body material-paper">
              <div class="diagram-wrapper">
                <QuickstartFlowDiagram />
              </div>
              <footer class="section-footer">
                <div class="pill dark">{t.pillGlobalEdge}</div>
                <div class="pill dark">{t.pillZeroLatency}</div>
              </footer>
            </div>
          </article>

          {/* Section 4: Cloud Infrastructure */}
          <article class="blueprint-section section-4" style={{ '--stagger': 4 }}>
            <div class="section-header">
              <span class="section-num">4</span>
              <h2 class="section-title">{t.architecture}</h2>
            </div>
            <div class="section-body material-chrome">
              <div class="diagram-wrapper">
                <TencentStackDiagram />
              </div>
              <footer class="section-footer">
                <div class="pill">{t.pillEdgeOne}</div>
                <div class="pill">{t.pillLighthouse}</div>
              </footer>
            </div>
          </article>

          {/* Section 5: Validation & Quality */}
          <article class="blueprint-section section-5" style={{ '--stagger': 5 }}>
            <div class="section-body material-glass-dark">
              <div class="quality-display">
                <div class="quality-score">
                  <span class="score-label">{t.qualityScore}</span>
                  <span class="score-value">{qualityScore}%</span>
                </div>
                <div class="validation-status">
                  <div class="status-item">
                    <span class="check">✓</span>
                    <span>
                      {t.languages} ({languages} locales)
                    </span>
                  </div>
                  <div class="status-item">
                    <span class="check">✓</span>
                    <span>{t.validationCompliance}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Bottom Bar: Architectural Alignment */}
        <footer class="blueprint-footer">
          <div class="alignment-flow">
            <h3 class="flow-title">{t.magicaDescription}</h3>
            <div class="flow-steps">
              <div class="step">
                <span class="step-icon">
                  <FlowIcon size={32} />
                </span>
                <span class="step-label">{t.flowSources}</span>
              </div>
              <div class="step-arrow">→</div>
              <div class="step">
                <span class="step-icon">
                  <MagnetIcon size={32} />
                </span>
                <span class="step-label">NOVA</span>
              </div>
              <div class="step-arrow">→</div>
              <div class="step">
                <span class="step-icon">
                  <HubIcon size={32} />
                </span>
                <span class="step-label">D1/KV</span>
              </div>
              <div class="step-arrow">→</div>
              <div class="step">
                <span class="step-icon">
                  <CodeIcon size={32} />
                </span>
                <span class="step-label">API</span>
              </div>
              <div class="step-arrow">→</div>
              <div class="step">
                <span class="step-icon">
                  <RobotIcon size={32} />
                </span>
                <span class="step-label">{t.flowFrontend}</span>
              </div>
            </div>
          </div>

          <div class="next-steps">
            <h3 class="next-title">🚀 {t.startBuilding}</h3>
            <p class="next-description" style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              {t.tryMagicaFree}
            </p>
            <div class="cta-wrapper" style={{ marginTop: '1rem' }}>
              <a
                href="https://magica.com"
                class="pill gold"
                style={{ textDecoration: 'none', display: 'inline-block', padding: '0.5rem 1rem' }}
              >
                {t.visitMagica}
              </a>
            </div>
          </div>
        </footer>
      </section>
    )
  }
)
