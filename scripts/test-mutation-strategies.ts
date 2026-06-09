/**
 * Test: mutation-strategies.ts
 * Verifies all 6 mutations: apply, revert, and constraints.
 * Run: cd /home/lermf/uniteia-v2 && bun run scripts/test-mutation-strategies.ts
 */
import { readFileSync } from 'node:fs'
import { load as parseYaml } from 'js-yaml'
import type { Manifest } from './manifest-schema'
import { MUTATIONS, applyMutations, randomMutation } from './mutation-strategies'

// ── Load manifest (cast — mutations are runtime-safe, schema is separate concern) ──
const raw = readFileSync('content-manifest.yaml', 'utf8')
const original = parseYaml(raw) as Manifest

let passed = 0
let failed = 0

function assert(cond: boolean, msg: string) {
  if (cond) {
    passed++
  } else {
    failed++
    console.error(`  FAIL: ${msg}`)
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

// ── Test each mutation ──
console.log('Testing mutation-strategies.ts...\n')

const MUT_NAMES = Object.keys(MUTATIONS)
for (const name of MUT_NAMES) {
  const mutation = MUTATIONS[name]!
  console.log(`--- ${name}: ${mutation.description} ---`)

  // Apply
  let modified: Manifest
  try {
    modified = mutation.apply(original)
    assert(modified !== original, 'apply returns new object')
  } catch (e) {
    console.error(`  ERROR in apply: ${e}`)
    failed++
    continue
  }

  // Revert
  let reverted: Manifest
  try {
    reverted = mutation.revert(modified)
  } catch (e) {
    console.error(`  ERROR in revert: ${e}`)
    failed++
    continue
  }

  // Verify revert undoes mutation
  assert(deepEqual(reverted, original), 'revert restores original manifest exactly')

  // ── Constraint checks on modified ──
  // 1. Never modify slugs
  const origSlugs = new Set(original.articles.map(a => a.slug))
  const modSlugs = new Set(modified.articles.map(a => a.slug))
  assert(
    origSlugs.size === modSlugs.size && [...origSlugs].every(s => modSlugs.has(s)),
    'slugs unchanged (no slugs modified/added/removed)'
  )

  // 2. Max 12 nodes per canvas
  for (const a of modified.articles) {
    if (a.canvas) {
      assert(
        a.canvas.nodes.length <= 12,
        `article ${a.slug}: nodes ≤ 12 (got ${a.canvas.nodes.length})`
      )
    }
  }

  // 3. Article count unchanged
  assert(modified.articles.length === original.articles.length, 'article count unchanged')

  // 4. Niche count unchanged
  assert(
    Object.keys(modified.niches).length === Object.keys(original.niches).length,
    'niche count unchanged'
  )

  // 5. Version unchanged
  assert(modified.version === original.version, 'version unchanged')

  // 6. Never delete nodes — only add
  for (const origA of original.articles) {
    const modA = modified.articles.find(a => a.slug === origA.slug)
    if (modA) {
      const origCount = origA.canvas?.nodes.length ?? 0
      const modCount = modA.canvas?.nodes.length ?? 0
      assert(
        modCount >= origCount,
        `article ${origA.slug}: nodes not deleted (orig=${origCount}, mod=${modCount})`
      )
    }
  }

  console.log()
}

// ── Test randomMutation ──
console.log('--- randomMutation ---')
const rm = randomMutation()
assert(MUT_NAMES.includes(rm.name), `randomMutation returns valid mutation (got ${rm.name})`)
assert(typeof rm.apply === 'function', 'randomMutation has apply')
assert(typeof rm.revert === 'function', 'randomMutation has revert')

// ── Test applyMutations with names ──
console.log('--- applyMutations (names) ---')
const namesList = ['ADD_SECTION', 'ADJUST_TONE']
const result1 = applyMutations(original, namesList)
assert(result1 !== original, 'applyMutations with names returns new object')
assert(
  result1.articles.length === original.articles.length,
  'applyMutations preserves article count'
)

// ── Test applyMutations with count ──
console.log('--- applyMutations (count) ---')
const result2 = applyMutations(original, [], 3)
assert(result2 !== original, 'applyMutations with count returns new object')
assert(
  result2.articles.length === original.articles.length,
  'applyMutations preserves article count'
)

// ── Summary ──
console.log(`\nResults: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
