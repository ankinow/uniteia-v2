/**
 * Sketchnote route — renders any of the 3 sketchnote templates for a given topic
 *
 * URL pattern: /<lang>/sketchnote/<topic>
 *   - /en/sketchnote/mcp  → Template 01 (MCP for devs — 8 steps)
 *   - /en/sketchnote/quickstart  → Template 02 (Code recipe — 5 steps)
 *   - /en/sketchnote/decision  → Template 03 (Decision map — 4 panels)
 *
 * Each topic has an i18n-suffixed content block (en/pt/es/fr/de/it/ja/zh).
 * The page is SSG-rendered at build time (routeLoader$ — pitfall 95).
 */

import { Resource, component$ } from '@builder.io/qwik'
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city'
import { Sketchnote } from '~/components/sketchnote/Sketchnote'
import { getTranslation } from '~/i18n/context'
import type { SupportedLanguage } from '~/i18n/types'

// Map topic → which template variant
const TOPIC_VARIANT: Record<string, 'template01' | 'template02' | 'template03'> = {
  mcp: 'template01',
  'mcp-server': 'template01',
  quickstart: 'template02',
  'code-recipe': 'template02',
  decision: 'template03',
  'decision-map': 'template03',
}

const ALL_TOPICS = Object.keys(TOPIC_VARIANT)
const LOCALES = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'zh'] as const

export const onStaticGenerate = () => {
  return {
    params: LOCALES.flatMap(lang => ALL_TOPICS.map(topic => ({ lang, topic }))),
  }
}

export const useSketchnoteTopic = routeLoader$(async ({ params }) => {
  const lang = (params.lang as SupportedLanguage) || 'en'
  const topic = params.topic || 'mcp'
  const variant = TOPIC_VARIANT[topic] || 'template01'
  const t = getTranslation(lang)
  return { lang, topic, variant, t }
})

export default component$(() => {
  const data = useSketchnoteTopic()

  return (
    <main class="min-h-screen bg-void py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="mb-6">
          <a
            href={`/${data.value.lang}/signals/apex`}
            class="text-bone-muted hover:text-cyan text-sm font-mono"
          >
            ← Back
          </a>
        </div>

        <Resource
          value={data}
          onResolved={({ lang, topic, variant, t }) => (
            <Sketchnote variant={variant} t={t} lang={lang} />
          )}
        />
      </div>
    </main>
  )
})

export const head: DocumentHead = ({ resolveValue, params }) => {
  const data = resolveValue(useSketchnoteTopic)
  return {
    title: `Sketchnote — ${data.topic} | UniTeia`,
    meta: [
      {
        name: 'description',
        content: `Hand-drawn sketchnote template for ${data.topic} — ${data.t.sketchnote[data.variant].subtitle}`,
      },
    ],
  }
}
