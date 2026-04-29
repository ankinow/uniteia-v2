import { component$ } from '@builder.io/qwik'
import { useDocumentHead, useLocation } from '@builder.io/qwik-city'

export const RouterHead = component$(() => {
  const head = useDocumentHead()
  const loc = useLocation()

  const siteName = 'UniTeia'
  const title = head.title ? head.title : siteName
  const canonicalUrl = loc.url.origin + loc.url.pathname

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

      <script type="application/ld+json">{websiteJsonLdString}</script>
      {breadcrumbJsonLdString && (
        <script type="application/ld+json">{breadcrumbJsonLdString}</script>
      )}
    </>
  )
})
