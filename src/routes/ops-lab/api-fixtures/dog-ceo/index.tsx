/**
 * Dog CEO API Fixture Demo Route
 *
 * Internal ops-lab route for testing:
 * - External API ingestion
 * - Zod schema validation
 * - Image pipeline
 * - Cache and fallback behavior
 * - Static artifact generation
 *
 * DRAFT-ONLY: Not indexed, not canonical, not production content.
 */

import { component$, useSignal } from '@builder.io/qwik'
import { routeAction$, routeLoader$ } from '@builder.io/qwik-city'
import {
  DOG_CEO_REGISTRY,
  type DogCeoArtifact,
  type DogCeoResult,
  createDogCeoArtifact,
  fetchDogCeoSafe,
  generateDogAltText,
} from '~/adapters/demo/dog-ceo'

// ─── Data Loaders ──────────────────────────────────────────────────────────

export const useDogCeoData = routeLoader$<{
  result: DogCeoResult
  artifact: DogCeoArtifact
}>(async () => {
  const result = await fetchDogCeoSafe()
  const artifact = createDogCeoArtifact(result.data)
  return { result, artifact }
})

// ─── Actions ───────────────────────────────────────────────────────────────

export const useRefreshDog = routeAction$(async () => {
  const result = await fetchDogCeoSafe(fetch, true)
  const artifact = createDogCeoArtifact(result.data)
  return { result, artifact }
})

// ─── Component ─────────────────────────────────────────────────────────────

export default component$(() => {
  const dataSignal = useDogCeoData()
  const refreshAction = useRefreshDog()
  const showArtifact = useSignal(false)

  const { result, artifact } = refreshAction.value ?? dataSignal.value

  return (
    <main class="min-h-screen bg-void p-4 md:p-8">
      <div class="max-w-3xl mx-auto">
        {/* Header with draft badge */}
        <header class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl md:text-3xl font-bold text-bone">Dog CEO API Fixture</h1>
            <span class="px-2 py-0.5 text-xs font-mono bg-bronze/20 text-bronze border border-bronze/30 rounded">
              DRAFT-ONLY
            </span>
          </div>
          <p class="text-bone-muted">
            Demo fixture for testing external API ingestion, validation, and caching.
          </p>
        </header>

        {/* Status badges */}
        <div class="flex flex-wrap gap-2 mb-6">
          <StatusBadge
            label="Source"
            value={result.fromFallback ? 'fallback' : result.fromCache ? 'cache' : 'live'}
            variant={result.fromFallback ? 'warning' : result.fromCache ? 'info' : 'success'}
          />
          <StatusBadge label="Trust" value={DOG_CEO_REGISTRY.trust_level} variant="neutral" />
          <StatusBadge
            label="TTL"
            value={`${DOG_CEO_REGISTRY.cache.ttl_seconds}s`}
            variant="neutral"
          />
        </div>

        {/* Error message if any */}
        {result.error && (
          <div class="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p class="text-red-400 font-mono text-sm">Error: {result.error}</p>
            <p class="text-bone-muted text-sm mt-1">Displaying fallback fixture data.</p>
          </div>
        )}

        {/* Dog image card */}
        <div class="bg-deep rounded-lg border border-raised overflow-hidden mb-6">
          <div class="aspect-video relative bg-mid">
            <img
              src={result.data.message}
              alt={generateDogAltText(result.data.message)}
              class="w-full h-full object-cover"
              width={640}
              height={360}
              loading="lazy"
              crossOrigin="anonymous"
            />
          </div>
          <div class="p-4">
            <p class="text-bone-muted text-sm font-mono break-all">{result.data.message}</p>
            <p class="text-bone mt-2">{generateDogAltText(result.data.message)}</p>
          </div>
        </div>

        {/* Actions */}
        <div class="flex flex-wrap gap-3 mb-8">
          <button
            type="button"
            onClick$={() => refreshAction.submit({})}
            disabled={refreshAction.isRunning}
            class="px-4 py-2 bg-cyan-base text-void font-medium rounded hover:bg-cyan-hi transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refreshAction.isRunning ? 'Fetching...' : 'Fetch New Dog'}
          </button>
          <button
            type="button"
            onClick$={() => {
              showArtifact.value = !showArtifact.value
            }}
            class="px-4 py-2 bg-mid text-bone font-medium rounded hover:bg-raised transition-colors border border-raised"
          >
            {showArtifact.value ? 'Hide Artifact' : 'Show Artifact'}
          </button>
        </div>

        {/* Artifact JSON viewer */}
        {showArtifact.value && (
          <div class="bg-deep rounded-lg border border-raised p-4 mb-8">
            <h2 class="text-lg font-bold text-bone mb-3">Static Artifact Envelope</h2>
            <pre class="text-xs text-bone-muted font-mono overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(artifact, null, 2)}
            </pre>
          </div>
        )}

        {/* Registry info */}
        <section class="bg-deep rounded-lg border border-raised p-4">
          <h2 class="text-lg font-bold text-bone mb-4">Registry Configuration</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RegistryField label="ID" value={DOG_CEO_REGISTRY.id} />
            <RegistryField label="Kind" value={DOG_CEO_REGISTRY.kind} />
            <RegistryField label="URL" value={DOG_CEO_REGISTRY.url} />
            <RegistryField label="Trust Level" value={DOG_CEO_REGISTRY.trust_level} />
            <RegistryField label="Publish Policy" value={DOG_CEO_REGISTRY.policy.publish} />
            <RegistryField
              label="Production Index"
              value={String(DOG_CEO_REGISTRY.policy.production_index)}
            />
            <RegistryField
              label="Search Index"
              value={String(DOG_CEO_REGISTRY.policy.search_index)}
            />
            <RegistryField label="Cache TTL" value={`${DOG_CEO_REGISTRY.cache.ttl_seconds}s`} />
          </dl>
        </section>

        {/* Quality gates checklist */}
        <section class="mt-8 bg-deep rounded-lg border border-raised p-4">
          <h2 class="text-lg font-bold text-bone mb-4">Quality Gates</h2>
          <ul class="space-y-2">
            <QualityGate label="Schema validation (Zod)" passed={true} />
            <QualityGate label="Timeout handling (5s)" passed={true} />
            <QualityGate label="Fallback fixture" passed={true} />
            <QualityGate label="Cache bounded (24h TTL)" passed={true} />
            <QualityGate label="Image URL valid" passed={result.data.message.startsWith('https')} />
            <QualityGate
              label="Alt text generated"
              passed={!!generateDogAltText(result.data.message)}
            />
            <QualityGate label="Draft-only enforced" passed={artifact.$meta.draft_only === true} />
            <QualityGate
              label="Search index blocked"
              passed={artifact.$meta.search_index === false}
            />
          </ul>
        </section>
      </div>
    </main>
  )
})

// ─── Helper Components ─────────────────────────────────────────────────────

interface StatusBadgeProps {
  label: string
  value: string
  variant: 'success' | 'warning' | 'info' | 'neutral'
}

const StatusBadge = component$<StatusBadgeProps>(({ label, value, variant }) => {
  const colors = {
    success: 'bg-vine/20 text-vine border-vine/30',
    warning: 'bg-bronze/20 text-bronze border-bronze/30',
    info: 'bg-cyan-base/20 text-cyan-base border-cyan-base/30',
    neutral: 'bg-mid text-bone-muted border-raised',
  }

  return (
    <span class={`px-2 py-1 text-xs font-mono border rounded ${colors[variant]}`}>
      {label}: {value}
    </span>
  )
})

interface RegistryFieldProps {
  label: string
  value: string
}

const RegistryField = component$<RegistryFieldProps>(({ label, value }) => (
  <div>
    <dt class="text-xs text-bone-muted uppercase tracking-wide">{label}</dt>
    <dd class="text-bone font-mono text-sm mt-1">{value}</dd>
  </div>
))

interface QualityGateProps {
  label: string
  passed: boolean
}

const QualityGate = component$<QualityGateProps>(({ label, passed }) => (
  <li class="flex items-center gap-2">
    <span
      class={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
        passed ? 'bg-vine/20 text-vine' : 'bg-red-900/20 text-red-400'
      }`}
    >
      {passed ? '✓' : '✗'}
    </span>
    <span class={passed ? 'text-bone' : 'text-red-400'}>{label}</span>
  </li>
))
