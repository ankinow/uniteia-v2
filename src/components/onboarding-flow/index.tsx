import { component$ } from '@builder.io/qwik'
import { DepthCard } from '~/components/depth-card'

export interface OnboardingFlowProps {
  locale: string
  siteName?: string
}

export const OnboardingFlow = component$<OnboardingFlowProps>(({ locale, siteName = 'UniTeia' }) => {
  const steps = [
    {
      tone: 'action' as const,
      label: 'Research',
      desc: 'Raw sources are ingested and scored for trust.',
    },
    {
      tone: 'verified' as const,
      label: 'Verify',
      desc: 'Claims are cross-checked against independent sources.',
    },
    {
      tone: 'curation' as const,
      label: 'Structure',
      desc: 'Content is formatted, localized, and readied for delivery.',
    },
  ]

  return (
    <section
      class="my-12 px-6 md:px-8 mx-auto max-w-4xl"
      data-testid="onboarding-flow"
      aria-label="How UniTeia works"
    >
      {/* Step 1 — Signal Intake */}
      <div class="mb-16 text-center perspective-dramatic preserve-3d">
        <DepthCard depth="surface" depth2d5="floating" glass={true}>
          <div class="p-8 md:p-12 relative">
            <span
              class="hud-label-base mb-4"
              data-tone="action"
              aria-hidden="true"
            >
              Step 1
            </span>
            <h1 class="text-display-xl font-display font-normal mb-4">
              The world is noisy.
            </h1>
            <h2 class="text-display-md font-display font-normal text-bone-muted mb-6">
              We filter the signal.
            </h2>
            <p class="text-body-lg text-bone/80 max-w-[68ch] mx-auto">
              {siteName} ingests thousands of sources daily, extracting what matters.
              <span class="block mt-3 text-coral font-medium">so you don't have to.</span>
            </p>
            <div class="absolute inset-0 grid-signal opacity-[0.04] animate-pulse pointer-events-none" aria-hidden="true" />
          </div>
        </DepthCard>
      </div>

      {/* Step 2 — Curated */}
      <div class="mb-16">
        <h3 class="text-center font-display font-normal text-display-md mb-8">
          Every signal passes 7 quality gates before reaching you.
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step) => (
            <DepthCard key={step.label} depth="raised" depth2d5="front">
              <div class="p-5">
                <span class="hud-label-base mb-3 block" data-tone={step.tone}>
                  {step.label}
                </span>
                <p class="text-sm text-bone/80 leading-relaxed">{step.desc}</p>
              </div>
            </DepthCard>
          ))}
        </div>
      </div>

      {/* Step 3 — Delivery Layer */}
      <div class="text-center canvas-light rounded-3xl p-6 md:p-10">
        <h3 class="font-display font-normal text-display-md text-paper-text mb-4">
          Available in 8 languages.
        </h3>
        <p class="text-body-lg text-paper-text/80 max-w-[52ch] mx-auto mb-6">
          Only what matters. Delivered in your language, on your terms.
        </p>
        <div class="flex flex-wrap justify-center gap-2">
          {['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'].map((code) => (
            <span
              key={code}
              class="paper-label text-xs"
              aria-label={`Available in ${code}`}
            >
              {code}
            </span>
          ))}
        </div>
        <span class="hud-label-base mt-4" data-tone="verified" data-size="compact">
          8 voices
        </span>
      </div>
    </section>
  )
})
