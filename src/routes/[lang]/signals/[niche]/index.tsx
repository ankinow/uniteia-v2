import { component$ } from '@builder.io/qwik'
import {
  type DocumentHead,
  type RequestHandler,
  routeLoader$,
  useLocation,
} from '@builder.io/qwik-city'
import { Breadcrumb } from '~/components/breadcrumb'
import { JSONLD } from '~/components/json-ld'
import type { ContentLocale } from '~/content-graph/contracts/node'
import { toBcp47 } from '~/i18n/bcp47'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '~/i18n/types'
import { canonicalUrl, xdefaultUrl } from '~/routing/routes'
import { getBuildLocale } from '~/utils/build-locale'
import type { NicheArticleEntry } from '~/utils/content-loader'
import { findNicheBySlug, getNicheSlug, loadNichesConfig } from '~/utils/niche-loader'
import { generateWebPageSchema } from '~/utils/schema-generators'
import { generateWebSiteSchema } from '~/utils/schema-generators'
import type { NicheRouteData } from './types'

type AlternateLink = {
  rel: 'alternate'
  hreflang: SupportedLanguage | 'x-default'
  href: string
}

/** Quick lookup set for valid language codes */
const VALID_LANG_CODES = new Set<string>(SUPPORTED_LANGUAGES.map(l => l.code))

export const onRequest: RequestHandler = async event => {
  const lang = event.params.lang ?? ''
  const nicheSlug = event.params.niche ?? ''

  if (!lang || !VALID_LANG_CODES.has(lang)) {
    throw event.error(404, `Language "${lang ?? 'unknown'}" not supported`)
  }

  const niches = await loadNichesConfig()
  const niche = findNicheBySlug(niches, nicheSlug, lang as SupportedLanguage)

  if (!niche) {
    throw event.error(404, `Niche not found: ${nicheSlug}`)
  }

  const localeSlug = getNicheSlug(niche, lang as SupportedLanguage)
  if (localeSlug !== nicheSlug) {
    throw event.redirect(301, `/${lang}/signals/${localeSlug}${event.url.search}`)
  }
}

export const onStaticGenerate = async () => {
  const buildLang = getBuildLocale()
  const niches = await loadNichesConfig()
  return {
    params: niches.map(n => ({
      lang: buildLang,
      niche: getNicheSlug(n, buildLang as SupportedLanguage),
    })),
  }
}

/**
 * routeLoader$ that loads the niches config, finds the niche matching
 * the URL slug, validates the language param, and returns typed
 * NicheRouteData or throws 404.
 *
 * All Node.js imports are inside loadNichesConfig (which uses dynamic
 * import() per D001), so this loader is fully server-only.
 */
export const useNicheData = routeLoader$<NicheRouteData>(async ({ params, error }) => {
  const lang = params.lang ?? ''
  const nicheSlug = params.niche ?? ''

  // Validate language parameter
  if (!lang || !VALID_LANG_CODES.has(lang)) {
    throw error(404, `Language "${lang ?? 'unknown'}" not supported`)
  }

  // Load and validate niches from config
  const niches = await loadNichesConfig()

  // Find the matching niche
  const niche = findNicheBySlug(niches, nicheSlug, lang as SupportedLanguage)
  if (!niche) {
    // During SSG, return empty data instead of throwing
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
              en: nicheSlug,
              pt: nicheSlug,
              es: nicheSlug,
              fr: nicheSlug,
              de: nicheSlug,
              it: nicheSlug,
              ja: nicheSlug,
              zh: nicheSlug,
            },
            description: { en: '', pt: '', es: '', fr: '', de: '', it: '', ja: '', zh: '' },
          } as any),
        otherNiches: [],
      }
    }
    console.warn(`[niche-loader] Niche not found for slug: "${nicheSlug}"`)
    throw error(404, `Niche not found: ${nicheSlug}`)
  }

  // Return current niche + all other niches for the related grid
  const otherNiches = niches.filter(n => n.slug !== nicheSlug)

  return { niche, otherNiches }
})

export const useNicheArticles = routeLoader$<NicheArticleEntry[]>(async ({ params }) => {
  const lang = params.lang ?? ''
  const nicheSlug = params.niche ?? ''

  const niches = await loadNichesConfig()
  const niche = findNicheBySlug(niches, nicheSlug, lang as SupportedLanguage)
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
    // During SSG, content graph may not be available
    if (import.meta.env.SSR) {
      console.warn(`[niche-loader] Content graph unavailable during SSG for niche: ${nicheSlug}`)
      return []
    }
    throw err
  }
})

/**
 * Niche landing page component
 * Renders the NicheLanding component with data from the route loader.
 * Language is read from URL params (already validated by routeLoader$).
 */
import { BauhausGrid, BauhausSection } from '~/components/bauhaus-section'
import { BauhausArticleCard } from '~/components/bauhaus-section/article-card'
import { BauhausTrendingSection } from '~/components/homepage-curation/bauhaus-trending'

export default component$(() => {
  const data = useNicheData()
  const articles = useNicheArticles()
  const location = useLocation()
  const lang = (location.params.lang as SupportedLanguage) || 'en'
  const pageTitle = `${data.value.niche.title[lang]} — UniTeia`

  const websiteSchema = generateWebSiteSchema({
    name: `${data.value.niche.title[lang]} | UniTeia`,
    url: location.url.href,
    description: data.value.niche.description[lang],
    lang,
  })

  const nicheUrl = canonicalUrl(location.url.origin, `/${lang}/signals/${data.value.niche.slug}`)
  const webPageSchema = generateWebPageSchema({
    name: pageTitle,
    url: nicheUrl,
    description: data.value.niche.description[lang],
    lang,
    breadcrumb: [
      { name: lang.toUpperCase(), item: `${location.url.origin}/${lang}` },
      { name: 'Signals', item: `${location.url.origin}/${lang}/signals` },
      { name: data.value.niche.title[lang], item: nicheUrl },
    ],
  })

  const localizedArticles = articles.value.filter(a => a.lang === lang)

  return (
    <>
      <JSONLD data={websiteSchema} />
      <JSONLD data={webPageSchema} />
      <main class="bg-[var(--color-bg-primary)]">
        {/* Bauhaus Hero Header */}
        <BauhausSection mood="voltage" as="header" class="pt-32 pb-48">
          <div class="flex flex-col md:flex-row gap-12 items-start justify-between">
            <div class="max-w-3xl">
              <div class="mb-8 flex items-center gap-4">
                <Breadcrumb
                  segmentLabels={{ [data.value.niche.slug]: data.value.niche.title[lang] }}
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

            {/* Hero visual for niche */}
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

        {/* Article Grid Section */}
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
                  href={`/${lang}/signals/apex/${article.slug}`}
                  category={data.value.niche.title[lang]}
                />
              ))}
            </BauhausGrid>
          </BauhausSection>
        )}

        {/* Trending Section Integration */}
        <BauhausTrendingSection articles={localizedArticles} lang={lang} mood="blackout" />

        {/* Footer info (minimal Bauhaus) */}
        <div class="py-12 px-6 border-t border-[var(--color-border)] text-center bg-black">
          <span class="bauhaus-label opacity-20">UniTeia v2 · Bauhaus Layer · 2026</span>
        </div>
      </main>
    </>
  )
})

/**
 * Document head — sets page title and meta description from niche data
 */
export const head: DocumentHead = ({ resolveValue, params, url }) => {
  const data = resolveValue(useNicheData)
  const lang = (params.lang as SupportedLanguage) || 'en'

  const localizedSlug = getNicheSlug(data.niche, lang as SupportedLanguage)
  const nicheStr = data.niche.slug
  const pageTitle = `${data.niche.title[lang]} — UniTeia`
  const description = data.niche.description[lang]

  const alternateLinks: AlternateLink[] = SUPPORTED_LANGUAGES.map(l => ({
    rel: 'alternate',
    hreflang: l.code,
    href: canonicalUrl(`https://${l.code}.uniteia.com`, `/${l.code}/signals/${params.niche}`),
  }))

  alternateLinks.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: xdefaultUrl('https://en.uniteia.com', params.niche),
  })

  return {
    title: pageTitle,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: description },
      {
        property: 'og:url',
        content: canonicalUrl(url.origin, `/${lang}/signals/${localizedSlug}`),
      },
      { property: 'og:type', content: 'article' },
      { property: 'og:locale', content: toBcp47(lang) },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: description },
    ],
    links: [
      { rel: 'canonical', href: canonicalUrl(url.origin, `/${lang}/signals/${localizedSlug}`) },
      ...alternateLinks,
    ],
  }
}
