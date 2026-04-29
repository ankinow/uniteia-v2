import { component$ } from '@builder.io/qwik'
import { useDocumentHead, useLocation } from '@builder.io/qwik-city'
import { SUPPORTED_LANGUAGES } from '../../i18n/types'

export const RouterHead = component$(() => {
  const head = useDocumentHead()
  const loc = useLocation()

  const siteName = 'UniTeia'
  const title = head.title ? head.title : siteName
  const canonicalUrl = loc.url.origin + loc.url.pathname

  // Hreflang links
  const hreflangLinks = SUPPORTED_LANGUAGES.map(lang => {
    let path = `/${lang.code}/`
    // Article page
    if (head.frontmatter.slug) {
      path = `/${lang.code}/${head.frontmatter.slug}`
    }
    // Niche page
    else if (head.frontmatter.niche) {
      const nicheSlug = head.frontmatter.niche.slugs[lang.code]
      if (nicheSlug) {
        path = `/${lang.code}/n/${nicheSlug}`
      }
    }
    // Niche index page
    else if (loc.url.pathname.endsWith('/n') || loc.url.pathname.endsWith('/n/')) {
      path = `/${lang.code}/n`
    }
    return {
      rel: 'alternate',
      hreflang: lang.code,
      href: `${loc.url.origin}${path}`,
    }
  })

  // x-default hreflang
  const xDefaultPath = head.frontmatter.slug
    ? `/en/${head.frontmatter.slug}`
    : head.frontmatter.niche
      ? `/en/n/${head.frontmatter.niche.slugs.en}`
      : '/en/'

  hreflangLinks.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${loc.url.origin}${xDefaultPath}`,
  })

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
    inLanguage: loc.params.lang || 'pt',
  }

  // JSON-LD BreadcrumbList
  const pathSegments = loc.url.pathname.split('/').filter(Boolean)
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const url = `${loc.url.origin}/${pathSegments.slice(0, index + 1).join('/')}`
    // Simple mapping for segment names, could be improved with i18n
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

      {head.meta.map(meta => (
        <meta key={JSON.stringify(meta)} {...meta} />
      ))}

      {head.links.map(link => (
        <link key={JSON.stringify(link)} {...link} />
      ))}

      {hreflangLinks.map(link => (
        <link key={link.hreflang} rel={link.rel} hreflang={link.hreflang} href={link.href} />
      ))}

      <script type="application/ld+json">{websiteJsonLdString}</script>
      {breadcrumbJsonLdString && (
        <script type="application/ld+json">{breadcrumbJsonLdString}</script>
      )}
    </>
  )
})
