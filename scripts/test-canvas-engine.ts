/**
 * Test: canvas-template-engine.ts
 *
 * Validates all 4 template layouts with real article metadata.
 * Run: cd /home/lermf/uniteia-v2 && bun run scripts/test-canvas-engine.ts
 */

import { generateCanvas, generateCollageProps } from '../src/utils/canvas-template-engine'
import type { CanvasDef } from '../src/utils/canvas-template-engine'

// ─── Schema validation (mirrors manifest-schema.ts) ───
const VALID_TONES = ['warm-gray', 'parchment', 'obsidian', 'neural-blue', 'coral'] as const
const VALID_LAYOUTS = [
  'neural-branch',
  'timeline-spiral',
  'editorial-collage',
  'constellation',
  'storyboard',
] as const
const VALID_NODE_TYPES = ['hero', 'card', 'grid', 'insight', 'timeline', 'quote'] as const

function validateCanvasDef(canvas: CanvasDef, label: string): string[] {
  const errors: string[] = []

  if (!canvas) {
    errors.push(`${label}: canvas is null/undefined`)
    return errors
  }
  if (!VALID_TONES.includes(canvas.tone)) errors.push(`${label}: invalid tone '${canvas.tone}'`)
  if (!VALID_LAYOUTS.includes(canvas.layout))
    errors.push(`${label}: invalid layout '${canvas.layout}'`)
  if (!Array.isArray(canvas.nodes)) errors.push(`${label}: nodes is not an array`)
  if (canvas.nodes.length === 0) errors.push(`${label}: nodes is empty (min 1)`)
  if (canvas.nodes.length > 12)
    errors.push(`${label}: too many nodes ${canvas.nodes.length} (max 12)`)

  const ids = new Set<string>()
  for (const node of canvas.nodes) {
    if (!node.id || typeof node.id !== 'string') errors.push(`${label}: node missing id`)
    else if (ids.has(node.id)) errors.push(`${label}: duplicate node id '${node.id}'`)
    else ids.add(node.id)

    if (!node.section || typeof node.section !== 'string')
      errors.push(`${label}: node '${node.id}' missing section`)
    if (!VALID_NODE_TYPES.includes(node.type))
      errors.push(`${label}: invalid node type '${node.type}' for '${node.id}'`)

    // ID should be kebab-case
    if (node.id && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(node.id)) {
      errors.push(`${label}: node id '${node.id}' is not kebab-case`)
    }
  }

  return errors
}

// ─── Test articles (metadata patterns from content-manifest.yaml) ───

// 1. neural-branch: has 'ai-agents' + 'beginners' tags
const articleNeuralBranch = {
  tags: ['ai-agents', 'beginners', 'editorial'],
  niche: 'ai-agents',
  bodySample: `# What are AI Agents and Why You Should Care

AI agents represent a paradigm shift.

## The Core Components of an Agent

An autonomous AI agent typically consists of four core elements.

## Why Agents Matter in 2026

In 2026, AI agents have moved from experimental terminal scripts to production-grade systems.

## Getting Started with Agents

Learn how to build your first agent.`,
}

// 2. timeline-spiral: has 'comparison' + 'benchmark' tags
const articleTimelineSpiral = {
  tags: ['comparison', 'benchmark', 'llm'],
  niche: 'llm-comparison',
  bodySample: `# How to Evaluate and Choose the Best LLM

Choosing the right LLM is critical.

## 1. Defining Your Requirements

Before running benchmarks, list your constraints.

## 2. Running Standardized Benchmarks

Use MMLU, HumanEval, and other standardized tests.

## 3. Analyzing Cost vs. Performance

Calculate cost per 1K tokens and balance against accuracy.

## 4. Making the Final Decision

Consider both quantitative metrics and qualitative fit.`,
}

// 3. editorial-collage: has 'development' tag (NO 'ai-agents' or 'beginners')
// Modeled after magica-mcp-server (tags: magica, mcp, api, development)
const articleEditorialCollage = {
  tags: ['development', 'tutorial', 'mcp', 'api'],
  niche: 'apex',
  bodySample: `# Building MCP Servers with Magica

Learn to build MCP servers for AI agents.

## What is MCP?

MCP is an open standard that lets AI agents discover and interact with external tools.

## Setting Up an MCP Server

Create a new directory and initialize a TypeScript project.

## Defining Tools

Tools are the most common MCP primitive.

## Connecting to Magica

In your Magica workspace, go to Settings.

## Resources and Context

Beyond tools, MCP servers can expose Resources.

## Deployment

For development, run your MCP server locally.`,
}

// 4. constellation: no matching special tags (modeled after magica-overview)
const articleConstellation = {
  tags: ['magica', 'ai-platform', 'multi-model', 'productivity'],
  niche: 'apex',
  bodySample: `# Magica: The AI Command Center

Magica is an all-in-one AI workspace.

## What is Magica?

Magica aggregates the world's best generative AI models.

## Models and Capabilities

Access to ChatGPT, Claude, Gemini, Mistral, Grok.

## Multi-Model Workflows

Chain multiple models together for complex tasks.

## MCP Integration

Connect external tools and data sources.

## Pricing and Plans

Starting at $15/month for unlimited access.`,
}

// ─── Run tests ───
let passed = 0
let failed = 0
const failures: string[] = []

function assert(condition: boolean, msg: string): void {
  if (condition) {
    passed++
  } else {
    failed++
    failures.push(`FAIL: ${msg}`)
  }
}

console.log('=== Canvas Template Engine Tests ===\n')

// Test 1: Template resolution from tags (priority: neural-branch > timeline-spiral > editorial-collage > constellation)
console.log('[1] Template resolution from tags')
{
  const c1 = generateCanvas(articleNeuralBranch)
  assert(c1.layout === 'neural-branch', `neural-branch tags → layout '${c1.layout}'`)
  assert(
    c1.tone === 'neural-blue' || c1.tone === 'warm-gray',
    `neural-branch default tone '${c1.tone}'`
  )

  const c2 = generateCanvas(articleTimelineSpiral)
  assert(c2.layout === 'timeline-spiral', `timeline-spiral tags → layout '${c2.layout}'`)
  assert(c2.tone === 'parchment', `timeline-spiral default tone '${c2.tone}'`)

  const c3 = generateCanvas(articleEditorialCollage)
  assert(c3.layout === 'editorial-collage', `editorial-collage tags → layout '${c3.layout}'`)
  assert(
    c3.tone === 'warm-gray' || c3.tone === 'coral',
    `editorial-collage default tone '${c3.tone}'`
  )

  const c4 = generateCanvas(articleConstellation)
  assert(c4.layout === 'constellation', `constellation tags → layout '${c4.layout}'`)
  assert(c4.tone === 'obsidian', `constellation default tone '${c4.tone}'`)
}
console.log(`  ${passed} passed, ${failed} failed\n`)

// Test 2: Custom tone override
console.log('[2] Custom tone override')
{
  const c = generateCanvas(articleNeuralBranch, 'coral')
  assert(c.tone === 'coral', `tone override → '${c.tone}' (expected 'coral')`)
}
console.log(`  ${passed} passed, ${failed} failed\n`)

// Test 3: Validate CanvasDef schema compliance for all 4 templates
console.log('[3] CanvasDef schema validation')
{
  const articles = [
    { a: articleNeuralBranch, name: 'neural-branch' },
    { a: articleTimelineSpiral, name: 'timeline-spiral' },
    { a: articleEditorialCollage, name: 'editorial-collage' },
    { a: articleConstellation, name: 'constellation' },
  ]

  for (const { a, name } of articles) {
    const canvas = generateCanvas(a)
    const errors = validateCanvasDef(canvas, name)
    if (errors.length > 0) {
      for (const e of errors) failures.push(`  ${e}`)
      failed += errors.length
    } else {
      passed++
    }
    console.log(
      `  ${name}: ${errors.length === 0 ? '✓' : '✗'} nodes=${canvas.nodes.length} layout=${canvas.layout} tone=${canvas.tone}`
    )
  }
}
console.log(`  ${passed} passed, ${failed} failed\n`)

// Test 4: Node generation from body h2 headings
console.log('[4] Node generation from body h2 headings')
{
  // neural-branch: should extract h2 headings
  const c1 = generateCanvas(articleNeuralBranch)
  assert(
    c1.nodes[0]?.type === 'hero',
    `neural-branch first node type: ${c1.nodes[0]?.type} (expected hero)`
  )
  const sections1 = c1.nodes.map(n => n.section)
  assert(
    sections1.some(s => s.includes('Core Components')),
    `neural-branch has 'Core Components' section`
  )
  assert(
    sections1.some(s => s.includes('Agents Matter')),
    `neural-branch has 'Agents Matter' section`
  )

  // timeline-spiral: all h2 headings should be sequential nodes
  const c2 = generateCanvas(articleTimelineSpiral)
  assert(
    c2.nodes[0]?.type === 'hero',
    `timeline-spiral first node type: ${c2.nodes[0]?.type} (expected hero)`
  )
  assert(
    c2.nodes[c2.nodes.length - 1]?.type === 'insight',
    `timeline-spiral last node type: ${c2.nodes[c2.nodes.length - 1]?.type} (expected insight)`
  )
  const sections2 = c2.nodes.map(n => n.section)
  assert(
    sections2.some(s => s.includes('Defining')),
    `timeline-spiral has 'Defining' section`
  )
  assert(
    sections2.some(s => s.includes('Final Decision')),
    `timeline-spiral has 'Final Decision' section`
  )

  // editorial-collage: hero at start, steps in middle, result at end
  const c3 = generateCanvas(articleEditorialCollage)
  assert(
    c3.nodes[0]?.type === 'hero',
    `editorial-collage first node type: ${c3.nodes[0]?.type} (expected hero)`
  )
  assert(c3.nodes.length >= 4, `editorial-collage nodes: ${c3.nodes.length} (expected >= 4)`)

  // constellation: all h2 headings become nodes
  const c4 = generateCanvas(articleConstellation)
  assert(
    c4.nodes[0]?.type === 'hero',
    `constellation first node type: ${c4.nodes[0]?.type} (expected hero)`
  )
  assert(c4.nodes.length >= 5, `constellation nodes: ${c4.nodes.length} (expected >= 5)`)
}
console.log(`  ${passed} passed, ${failed} failed\n`)

// Test 5: Max 12 nodes enforced
console.log('[5] Max 12 nodes enforcement')
{
  const manyHeadings = Array.from({ length: 20 }, (_, i) => `## Section ${i + 1}`).join('\n')
  const c = generateCanvas({ tags: [], niche: 'test', bodySample: manyHeadings })
  assert(c.nodes.length <= 12, `max nodes: ${c.nodes.length} (expected <= 12)`)
}
console.log(`  ${passed} passed, ${failed} failed\n`)

// Test 6: No body headings → use defaults
console.log('[6] Fallback to default labels when no h2 headings')
{
  const c = generateCanvas({
    tags: ['ai-agents'],
    niche: 'ai-agents',
    bodySample: '# Just a title\nNo headings here.',
  })
  assert(c.nodes.length >= 4, `fallback nodes: ${c.nodes.length} (expected >= 4)`)
  assert(
    c.nodes[0]?.section === 'Overview',
    `fallback hero section: '${c.nodes[0]?.section}' (expected 'Overview')`
  )
}
console.log(`  ${passed} passed, ${failed} failed\n`)

// Test 7: generateCollageProps for all 4 templates
console.log('[7] generateCollageProps output')
{
  const articles = [
    { a: articleNeuralBranch, name: 'neural-branch' },
    { a: articleTimelineSpiral, name: 'timeline-spiral' },
    { a: articleEditorialCollage, name: 'editorial-collage' },
    { a: articleConstellation, name: 'constellation' },
  ]

  for (const { a, name } of articles) {
    const canvas = generateCanvas(a)
    const props = generateCollageProps(canvas, { width: 800, height: 500 })

    assert(typeof props === 'object' && props !== null, `${name}: props is an object`)
    assert(Array.isArray(props.nodes), `${name}: props.nodes is an array`)
    assert(Array.isArray(props.arrows), `${name}: props.arrows is an array`)
    assert(Array.isArray(props.notes), `${name}: props.notes is an array`)
    assert(typeof props.tone === 'string', `${name}: props.tone is string`)
    assert(props.width === 800, `${name}: props.width`)
    assert(props.height === 500, `${name}: props.height`)
    assert(typeof props.layout === 'string', `${name}: props.layout is string`)

    // Each collage node should have position, size, label
    const nodes = props.nodes as Array<Record<string, unknown>>
    for (const n of nodes) {
      assert(typeof n.cx === 'number', `${name}: node cx type`)
      assert(typeof n.cy === 'number', `${name}: node cy type`)
      assert(typeof n.r === 'number', `${name}: node r type`)
      assert(typeof n.label === 'string', `${name}: node label type`)
    }

    console.log(
      `  ${name}: nodes=${nodes.length} arrows=${(props.arrows as Array<unknown>).length} tone=${props.tone}`
    )
  }
}
console.log(`  ${passed} passed, ${failed} failed\n`)

// Test 8: Unique node IDs
console.log('[8] Unique node IDs')
{
  for (const article of [
    articleNeuralBranch,
    articleTimelineSpiral,
    articleEditorialCollage,
    articleConstellation,
  ]) {
    const c = generateCanvas(article)
    const ids = c.nodes.map(n => n.id)
    const unique = new Set(ids)
    assert(ids.length === unique.size, `IDs unique for ${c.layout}: ${ids.length}/${unique.size}`)
  }
}
console.log(`  ${passed} passed, ${failed} failed\n`)

// Test 9: Priority ordering: 'ai-agents' beats 'tutorial' for dual-tag articles
console.log('[9] Tag priority: ai-agents > tutorial')
{
  // Article with both ai-agents and tutorial → neural-branch wins (listed first)
  const c = generateCanvas({
    tags: ['ai-agents', 'tutorial', 'development'],
    niche: 'ai-agents',
    bodySample: '# Test\n## Step 1\n## Step 2\n## Step 3',
  })
  assert(
    c.layout === 'neural-branch',
    `ai-agents+tutorial → layout '${c.layout}' (expected neural-branch)`
  )
}
console.log(`  ${passed} passed, ${failed} failed\n`)

// Test 10: Empty body → still produces valid output
console.log('[10] Empty body handling')
{
  const c = generateCanvas({ tags: ['guide'], niche: 'test', bodySample: '' })
  assert(c.layout === 'editorial-collage', `guide tag → layout '${c.layout}'`)
  assert(c.nodes.length >= 4, `empty body fallback nodes: ${c.nodes.length}`)
  const errors = validateCanvasDef(c, 'empty-body')
  assert(errors.length === 0, `empty body validation: ${errors.length} errors`)
}
console.log(`  ${passed} passed, ${failed} failed\n`)

// ─── Summary ───
console.log('='.repeat(50))
console.log(`Total: ${passed} passed, ${failed} failed`)

if (failures.length > 0) {
  console.log('\nFailures:')
  for (const f of failures) console.log(`  ${f}`)
}

process.exit(failed > 0 ? 1 : 0)
