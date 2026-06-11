import { component$ } from '@builder.io/qwik'
import {
  type DocumentHead,
  type RequestHandler,
  routeLoader$,
  useLocation,
} from '@builder.io/qwik-city'
import { Breadcrumb } from '~/components/breadcrumb'
import { JSONLD } from '~/components/json-ld'
import { BUILD_LOCALE } from '~/build-locale'
import type { ContentLocale } from '~/content-graph/contracts/node'
import type { SupportedLanguage } from '~/i18n/types'
import { canonicalUrl } from '~/routing/routes'
import type { NicheArticleEntry } from '~/utils/content-loader'
import { findNicheBySlug, getNicheSlug, loadNichesConfig } from '~/utils/niche-loader'
import { generateWebPageSchema } from '~/utils/schema-generators'
import { generateWebSiteSchema } from '~/utils/schema-generators'
import type { NicheRouteData } from './types'

export const onRequest: RequestHandler = async event => {
  const lang = BUILD_LOCALE as SupportedLanguage
  const nicheSlug = 'apex'

  const niches = await loadNichesConfig()
  const niche = findNicheBySlug(niches, nicheSlug, lang)

  if (!niche) {
    throw event.error(404, `Niche not found: ${nicheSlug}`)
  }

  const localeSlug = getNicheSlug(niche, lang)
  if (localeSlug !== nicheSlug) {
    throw event.redirect(301, `/signals/${localeSlug}${event.url.search}`)
  }
}

export const onStaticGenerate = async () => {
  return {
    params: [{}],
  }
}

/**
 * routeLoader$ that loads the niches config and returns typed NicheRouteData.
 * Hardcoded to APEX niche only.
 */
export const useNicheData = routeLoader$<NicheRouteData>(async ({ error }) => {
  const lang = BUILD_LOCALE as SupportedLanguage
  const nicheSlug = 'apex'

  const niches = await loadNichesConfig()
  const niche = findNicheBySlug(niches, nicheSlug, lang)
  if (!niche) {
    if (import.meta.env.SSR) {
      console.warn(`[niche-loader] Niche not found during SSG: "${nicheSlug}"`)
      return {
        niche:
          niches[0] ||
          ({
            slug: nicheSlug,
            slugs: { en: nicheSlug, pt: nicheSlug },
            icon: 'file',
            title: {
              en: nicheSlug, pt: nicheSlug, es: nicheSlug, fr: nicheSlug,
              de: nicheSlug, it: nicheSlug, ja: nicheSlug, zh: nicheSlug,
            },
            description: { en: '', pt: '', es: '', fr: '', de: '', it: '', ja: '', zh: '' },
          } as any),
        otherNiches: [],
      }
    }
    console.warn(`[niche-loader] Niche not found for slug: "${nicheSlug}"`)
    throw error(404, `Niche not found: ${nicheSlug}`)
  }

  const otherNiches = niches.filter(n => n.slug !== nicheSlug)
  return { niche, otherNiches }
})

export const useNicheArticles = routeLoader$<NicheArticleEntry[]>(async () => {
  const lang = BUILD_LOCALE as SupportedLanguage

  const niches = await loadNichesConfig()
  const niche = findNicheBySlug(niches, 'apex', lang)
  if (!niche) return []

  try {
    const { contentGraphProvider } = await import('~/content-graph.generated')
    const localeFilter = lang as ContentLocale
    const nodes = contentGraphProvider.getByNiche(niche.slug, { locale: localeFilter })

    return nodes
      .filter(
        n => n.slug !== '_index' && n.title && n.title !== '' && contentGraphProvider.isPublic(n)
      )
      .map(node => ({
        slug: node.slug,
        lang: node.locale as SupportedLanguage,
        title: node.title,
        summary: node.summary,
        updatedAt: node.timestamps.updatedAt,
      }))
  } catch (err) {
    if (import.meta.env.SSR) {
      console.warn(`[niche-loader] Content graph unavailable during SSG for niche: apex`)
      return []
    }
    throw err
  }
})

import { BauhausGrid, BauhausSection } from '~/components/bauhaus-section'
import { BauhausArticleCard } from '~/components/bauhaus-section/article-card'
import { BauhausTrendingSection } from '~/components/homepage-curation/bauhaus-trending'

export default component$(() => {
  const data = useNicheData()
  const articles = useNicheArticles()
  const location = useLocation()
  const lang = BUILD_LOCALE as SupportedLanguage
  const pageTitle = `${data.value.niche.title[lang]} — UniTeia`

  const websiteSchema = generateWebSiteSchema({
    name: `${data.value.niche.title[lang]} | UniTeia`,
    url: location.url.href,
    description: data.value.niche.description[lang],
    lang,
  })

  const nicheUrl = canonicalUrl(location.url.origin, `/signals/apex`)
  const webPageSchema = generateWebPageSchema({
    name: pageTitle,
    url: nicheUrl,
    description: data.value.niche.description[lang],
    lang,
    breadcrumb: [
      { name: lang.toUpperCase(), item: `${location.url.origin}/` },
      { name: 'Signals', item: `${location.url.origin}/signals` },
      { name: data.value.niche.title[lang], item: nicheUrl },
    ],
  })

  const localizedArticles = articles.value.filter(a => a.lang === lang)

  return (
    <>
      <JSONLD data={websiteSchema} />
      <JSONLD data={webPageSchema} />
      <main class="bg-[var(--color-bg-primary)]">
        <BauhausSection mood="voltage" as="header" class="pt-32 pb-48">
          <div class="flex flex-col md:flex-row gap-12 items-start justify-between">
            <div class="max-w-3xl">
              <div class="mb-8 flex items-center gap-4">
                <Breadcrumb
                  segmentLabels={{ apex: data.value.niche.title[lang] }}
                />
              </div>
              <span class="bauhaus-label text-[var(--color-accent)] mb-6 block">
                Niche Exploration
              </span>
              <h1 class="bauhaus-h1 mb-8">{data.value.niche.title[lang]}</h1>
              <p class="text-xl md:text-2xl font-medium leading-relaxed max-w-2xl opacity-80">
                {data.value.niche.description[lang]}
              </p>
            </div>

            <div class="w-full md:w-1/3 aspect-square bauhaus-block flex items-center justify-center overflow-hidden bg-black relative">
              {data.value.niche.heroImage ? (
                <img
                  src={data.value.niche.heroImage}
                  alt={data.value.niche.title[lang]}
                  width="400"
                  height="400"
                  loading="eager"
                  class="w-full h-full object-cover"
                />
              ) : (
                <span class="text-8xl font-black text-white/10">
                  {data.value.niche.title[lang].charAt(0)}
                </span>
              )}
              <div
                class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </BauhausSection>

        {localizedArticles.length > 0 && (
          <BauhausSection mood="blackout" class="py-32">
            <div class="mb-24">
              <span class="bauhaus-label text-[var(--color-accent)] mb-4 block">
                Knowledge Base
              </span>
              <h2 class="bauhaus-h1">Signals Found</h2>
            </div>

            <BauhausGrid columns={2}>
              {localizedArticles.map(article => (
                <BauhausArticleCard
                  key={article.slug}
                  title={article.title}
                  summary={article.summary}
                  href={`/signals/apex/${article.slug}`}
                  category={data.value.niche.title[lang]}
                />
              ))}
            </BauhausGrid>
          </BauhausSection>
        )}

        <BauhausTrendingSection articles={localizedArticles} lang={lang} mood="blackout" />

        <div class="py-12 px-6 border-t border-[var(--color-border)] text-center bg-black">
          <span class="bauhaus-label opacity-20">UniTeia v2 · Bauhaus Layer · 2026</span>
        </div>
      </main>
    </>
  )
})

export const head: DocumentHead = ({ resolveValue, url }) => {
  const data = resolveValue(useNicheData)
  const lang = BUILD_LOCALE as SupportedLanguage

  const localizedSlug = getNicheSlug(data.niche, lang)
  const pageTitle = `${data.niche.title[lang]} — UniTeia`
  const description = data.niche.description[lang]

  return {
    title: pageTitle,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: description },
      {
        property: 'og:url',
        content: canonicalUrl(url.origin, `/signals/${localizedSlug}`),
      },
      { property: 'og:type', content: 'article' },
      { property: 'og:locale', content: lang },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: description },
    ],
    links: [
      { rel: 'canonical', href: canonicalUrl(url.origin, `/signals/${localizedSlug}`) },
    ],
  }
}
