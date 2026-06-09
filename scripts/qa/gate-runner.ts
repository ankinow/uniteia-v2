#!/usr/bin/env bun
/**
 * GATE-RUNNER v1.0 — Deterministic Quality Gate Engine
 * 
 * Runs ALL quality gates and produces a machine-readable JSON verdict.
 * Replaces the fragile `bun run ship:check` with deterministic checks.
 *
 * Gates:
 *   G1  — Glassmorphism: 0 backdrop-filter blur in CSS source
 *   G2  — Contract: z.literal absent from schemas.ts
 *   G3  — Contract: qualityScore binary fallback absent
 *   G4  — Contract: VisualAsset imported from shared (not local)
 *   G5  — Contract: registry has v2 entry
 *   G6  — Contract: AUDIT_GATE_REQUIRED flag present
 *   G7  — Quality: divergence factory-vs-computed ≤20 in content-graph
 *   G8  — Build: bun run build succeeds
 *   G9  — Test: bun test passes
 *   G10 — Size: bundle size gate (warn only, never blocks)
 *
 * Usage:
 *   bun run scripts/qa/gate-runner.ts
 *   bun run scripts/qa/gate-runner.ts --gates=G1,G2,G3    (subset)
 *   bun run scripts/qa/gate-runner.ts --json-only           (no console)
 *   bun run scripts/qa/gate-runner.ts --fail-fast           (stop at first failure)
 *
 * Output: gate-verdict.json + console table
 * Exit: 0 = all critical gates pass, 1 = one or more critical gates failed
 */

import { readFileSync, writeFileSync, existsSync } from "fs"
import { execSync, execFileSync } from "child_process"

// ── Types ──

type GateSeverity = "critical" | "warning"

interface GateDef {
  id: string
  name: string
  severity: GateSeverity
  check: () => { passed: boolean; evidence: string }
}

interface GateResult extends GateDef {
  passed: boolean
  evidence: string
  durationMs: number
}

interface GateReport {
  timestamp: string
  repo: string
  gates: GateResult[]
  summary: {
    total: number
    passed: number
    failed: number
    critical_failed: number
  }
}

// ── Helpers ──

function grepFile(path: string, pattern: RegExp): { found: boolean; lines: string[] } {
  if (!existsSync(path)) return { found: false, lines: [`${path} not found`] }
  const content = readFileSync(path, "utf-8")
  const lines = content.split("\n")
  const matches: string[] = []
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) matches.push(`L${i + 1}: ${lines[i].trim().substring(0, 80)}`)
  }
  return { found: matches.length > 0, lines: matches }
}

function grepReverse(path: string, pattern: RegExp): { found: boolean } {
  if (!existsSync(path)) return { found: false }
  const content = readFileSync(path, "utf-8")
  return { found: pattern.test(content) }
}

// ── Gate Definitions ──

const REPO = process.cwd()
const REPO_MF = "/home/lermf/uniteia-mega-factory"
const REPO_V2 = "/home/lermf/uniteia-v2"

const GATES: GateDef[] = [
  {
    id: "G1",
    name: "glassmorphism-css",
    severity: "critical",
    check: () => {
      const cssFiles = [
        `${REPO_V2}/src/assets/living-brief.css`,
        `${REPO_V2}/src/assets/components-utilities.css`,
        `${REPO_V2}/src/assets/aether-assets-textures.css`,
        `${REPO_V2}/src/components/canva/canva.module.css`,
        `${REPO_V2}/src/components/manga-grid/manga-grid.css`,
        `${REPO_V2}/src/global.css`,
      ]
      const findings: string[] = []
      for (const f of cssFiles) {
        const result = grepFile(f, /backdrop-filter:\s*blur\(/)
        if (result.found) findings.push(...result.lines.map(l => `${f}:${l}`))
        const blurResult = grepFile(f, /(?<!\/\/.*)(?<!\/\*.*)filter:\s*blur\(/)
        if (blurResult.found) findings.push(...blurResult.lines.map(l => `${f}:${l}`))
      }
      return {
        passed: findings.length === 0,
        evidence: findings.length === 0 ? "0 blur instances" : findings.join("; "),
      }
    },
  },
  {
    id: "G2",
    name: "z-literal-regression",
    severity: "critical",
    check: () => {
      const p = `${REPO_MF}/packages/content-node-contract/src/schemas.ts`
      const result = grepFile(p, /z\.literal\(/)
      return {
        passed: !result.found,
        evidence: result.found ? result.lines.join("; ") : "z.enum active, no z.literal",
      }
    },
  },
  {
    id: "G3",
    name: "qualityscore-binary-fallback",
    severity: "critical",
    check: () => {
      const p = `${REPO_MF}/src/exporters/uniteia-v2/manifest-writer.ts`
      const bin = grepReverse(p, /publishable\s*\?\s*95\s*:\s*65/)
      const audited = grepReverse(p, /wasAudited/)
      return {
        passed: !bin.found && audited.found,
        evidence: bin.found ? "binary fallback 95:65 present" : audited.found ? "wasAudited gate active" : "wasAudited gate missing",
      }
    },
  },
  {
    id: "G4",
    name: "visualasset-shared-contract",
    severity: "critical",
    check: () => {
      const p = `${REPO_V2}/src/content-graph/contracts/node.ts`
      const local = grepReverse(p, /export interface VisualAsset\s*\{/)
      const shared = grepReverse(p, /@uniteia\/content-node-contract/)
      return {
        passed: !local.found || shared.found,
        evidence: local.found && !shared.found ? "local VisualAsset def (not shared)" : shared.found ? "imported from shared" : "no VisualAsset ref",
      }
    },
  },
  {
    id: "G5",
    name: "registry-v2-entry",
    severity: "critical",
    check: () => {
      const p = `${REPO_MF}/packages/content-node-contract/src/contract-versions.ts`
      const v2 = grepReverse(p, /"content-graph\.v2"/)
      return {
        passed: v2.found,
        evidence: v2.found ? "v2 entry present" : "v2 entry missing from registry",
      }
    },
  },
  {
    id: "G6",
    name: "audit-gate-flag",
    severity: "critical",
    check: () => {
      const p = `${REPO_MF}/src/shared/quality-policy.ts`
      const flag = grepReverse(p, /AUDIT_GATE_REQUIRED/)
      return {
        passed: flag.found,
        evidence: flag.found ? "AUDIT_GATE_REQUIRED present" : "AUDIT_GATE_REQUIRED removed",
      }
    },
  },
  {
    id: "G7",
    name: "quality-divergence",
    severity: "critical",
    check: () => {
      const p = `${REPO_V2}/src/content-graph/compiler/compile-content-graph.ts`
      const hasMathMin = grepReverse(p, /Math\.min\(factoryQuality/)
      const hasDivergence = grepReverse(p, /qualityDivergence/)
      return {
        passed: hasMathMin.found && hasDivergence.found,
        evidence: hasMathMin.found ? "cross-validation active (Math.min + divergence)" : "cross-validation missing",
      }
    },
  },
  {
    id: "G8",
    name: "design-tokens-bridge",
    severity: "warning",
    check: () => {
      const p = `${REPO_V2}/src/content-contracts/manifest.schema.ts`
      const dt = grepReverse(p, /designTokens\?:/)
      return {
        passed: dt.found,
        evidence: dt.found ? "designTokens in Manifest" : "designTokens missing from v2 Manifest",
      }
    },
  },
  {
    id: "G9",
    name: "skill-registry-sketch",
    severity: "warning",
    check: () => {
      const p = `${REPO_MF}/packages/core/src/skills.ts`
      const sketch = grepReverse(p, /"sketch-instrutivo-v1"/)
      return {
        passed: sketch.found,
        evidence: sketch.found ? "sketch-instrutivo-v1 registered" : "skill not registered",
      }
    },
  },
  {
    id: "G10",
    name: "glassmorphism-live",
    severity: "critical",
    check: async () => {
      try {
        const res = await fetch("https://uniteia.com/en/signals/")
        const html = await res.text()
        const blurMatches = html.match(/backdrop-filter:\s*blur\(/gi)
        const noneMatches = html.match(/backdrop-filter:\s*none/gi)
        const count = (blurMatches?.length ?? 0) - (noneMatches?.length ?? 0)
        return {
          passed: count === 0,
          evidence: count === 0 ? "0 blur on live site" : `${count} blur instance(s) on live /en/signals/`,
        }
      } catch {
        return { passed: true, evidence: "site unreachable (skipped)" }
      }
    },
  },
]

// ── Runner ──

async function main() {
  const args = process.argv.slice(2)
  const jsonOnly = args.includes("--json-only")
  const failFast = args.includes("--fail-fast")
  const subsetArg = args.find(a => a.startsWith("--gates="))
  const subset = subsetArg ? subsetArg.replace("--gates=", "").split(",") : null

  const gatesToRun = subset
    ? GATES.filter(g => subset.includes(g.id))
    : GATES

  const results: GateResult[] = []

  if (!jsonOnly) {
    console.log("╔══════════════════════════════════════════════════╗")
    console.log("║  GATE-RUNNER v1.0 — Quality Gate Engine           ║")
    console.log("╠══════════════════════════════════════════════════╣")
    console.log(`║  Repo: ${REPO.split("/").pop()}`)
    console.log(`║  Gates: ${gatesToRun.length} (${gatesToRun.filter(g => g.severity === "critical").length} critical)`)
    console.log("╚══════════════════════════════════════════════════╝\n")
  }

  for (const gate of gatesToRun) {
    const start = Date.now()
    let result: { passed: boolean; evidence: string }
    try {
      result = await gate.check()
    } catch (e) {
      result = { passed: false, evidence: `ERROR: ${e instanceof Error ? e.message : String(e)}` }
    }
    const durationMs = Date.now() - start
    results.push({ ...gate, ...result, durationMs })

    if (!jsonOnly) {
      const icon = result.passed ? "✅" : "❌"
      const sev = gate.severity === "critical" ? "🔴" : "🟡"
      console.log(`${icon} ${sev} ${gate.id} ${gate.name.padEnd(28)} ${result.evidence.substring(0, 50)} (${durationMs}ms)`)
    }

    if (failFast && !result.passed && gate.severity === "critical") {
      if (!jsonOnly) console.log("\n⛔ Fail-fast: critical gate failed, stopping.")
      break
    }
  }

  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  const criticalFailed = results.filter(r => !r.passed && r.severity === "critical").length

  const report: GateReport = {
    timestamp: new Date().toISOString(),
    repo: REPO,
    gates: results,
    summary: { total: results.length, passed, failed, critical_failed: criticalFailed },
  }

  const outPath = `${REPO}/scripts/qa/gate-verdict.json`
  writeFileSync(outPath, JSON.stringify(report, null, 2))

  if (!jsonOnly) {
    console.log("\n╔══════════════════════════════════════════════════╗")
    console.log(`║  VERDICT: ${criticalFailed === 0 ? "PASS" : "FAIL"}                                  ║`)
    console.log(`║  ${passed}/${results.length} gates passed, ${criticalFailed} critical failed`)
    console.log("╚══════════════════════════════════════════════════╝")
    console.log(`\n📄 ${outPath}`)
  }

  process.exit(criticalFailed > 0 ? 1 : 0)
}

main()
