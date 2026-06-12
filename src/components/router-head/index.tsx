import { component$ } from '@builder.io/qwik'
import { useDocumentHead, useLocation } from '@builder.io/qwik-city'

import { LOCALE_CODES } from '~/edge/contract.v1'
import { BCP47_MAP, toBcp47 } from '~/i18n/bcp47'

function buildHreflangAlternates(
  origin: string,
  pathname: string
): Array<{ hreflang: string; href: string }> {
  const parts = pathname.split('/').filter(Boolean)
  const firstIsLocale = parts.length > 0 && LOCALE_CODES.includes(parts[0] as never)

  // Path tail after the locale segment (e.g. 'signals/apex/magica-overview')
  const tail = firstIsLocale ? parts.slice(1).join('/') : parts.join('/')
  const tailSegment = tail ? `/${tail}` : ''

  // Multi-domain: each locale has its own subdomain
  // en -> en.uniteia.com, pt -> pt.uniteia.com, etc.
  const apexDomain = 'uniteia.com'

  return LOCALE_CODES.map(code => ({
    hreflang: code,
    href: `https://${code}.${apexDomain}/${code}${tailSegment}`,
  }))
}

export const RouterHead = component$(() => {
  const head = useDocumentHead()
  const loc = useLocation()

  const siteName = 'UniTeia'
  const title = head.title ? head.title : siteName
  const canonicalUrl = loc.url.origin + loc.url.pathname

  // Current locale from URL pathname (first segment)
  const pathParts = loc.url.pathname.split('/').filter(Boolean)
  const currentLocale: string = (
    pathParts.length > 0 && LOCALE_CODES.includes(pathParts[0] as never) ? pathParts[0] : 'en'
  ) as string
  const ogLocale = BCP47_MAP[currentLocale] || 'en-US'

  // hreflang alternates for SEO
  const alternates = buildHreflangAlternates(loc.url.origin, loc.url.pathname)

  // JSON-LD WebSite
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: loc.url.origin,
    description:
      head.meta.find(m => m.name === 'description')?.content ||
      'UniTeia - Hub de Inteligência Artificial descentralizada e curadoria editorial.',
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: loc.url.origin,
    },
    inLanguage: toBcp47(currentLocale),
  }

  // JSON-LD BreadcrumbList
  const pathSegments = loc.url.pathname.split('/').filter(Boolean)
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const url = `${loc.url.origin}/${pathSegments.slice(0, index + 1).join('/')}`
    let name = segment
    if (segment === 'n') name = 'Topics'
    if (index === pathSegments.length - 1 && head.title) {
      name = head.title.split(' | ')[0] || head.title.split(' — ')[0] || head.title
    }

    return {
      '@type': 'ListItem',
      position: index + 1,
      name: name,
      item: url,
    }
  })

  const breadcrumbJsonLd =
    breadcrumbItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems,
        }
      : null

  const websiteJsonLdString = JSON.stringify(websiteJsonLd)
  const breadcrumbJsonLdString = breadcrumbJsonLd ? JSON.stringify(breadcrumbJsonLd) : null

  return (
    <>
      <title>{title}</title>

      <link rel="canonical" href={canonicalUrl} />
      <meta name="color-scheme" content="dark" />

      {/* hreflang alternates — all 8 locales + x-default */}
      {alternates.map(alt => (
        <link key={alt.hreflang} rel="alternate" hreflang={alt.hreflang} href={alt.href} />
      ))}
      <link rel="alternate" href="https://en.uniteia.com/" hreflang="x-default" />

      {/* Dynamic og:locale — derived from current URL locale */}
      <meta property="og:locale" content={ogLocale} />

      {head.meta.map(meta => (
        <meta key={JSON.stringify(meta)} {...meta} />
      ))}

      {head.links.map(link => (
        <link key={JSON.stringify(link)} {...link} />
      ))}

      <script type="application/ld+json">{websiteJsonLdString}</script>
      {breadcrumbJsonLdString && (
        <script type="application/ld+json">{breadcrumbJsonLdString}</script>
      )}
    </>
  )
})
