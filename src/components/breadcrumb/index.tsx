import { component$ } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import { useI18n } from '~/i18n/context'

/**
 * Breadcrumb — visible nav element with Schema.org BreadcrumbList JSON-LD.
 *
 * Renders a <nav aria-label="Breadcrumb"> with <ol> containing breadcrumb items
 * derived from the current URL path.
 */
export const Breadcrumb = component$(() => {
  const { lang } = useI18n()
  const loc = useLocation()
  const { t } = useI18n()

  const pathSegments = loc.url.pathname.split('/').filter(Boolean)
  // First segment is always the language code — skip it for display
  const [, ...trail] = pathSegments

  const labelMap: Record<string, string> = {
    signals: t.nav.breadcrumb.signals,
  }

  const crumbs: Array<{ label: string; href: string | undefined }> = [
    { label: t.nav.home, href: `/${lang.value}/` },
  ]

  let accumulated = ''
  for (const segment of trail) {
    accumulated += `/${segment}`

    // Derive label: try labelMap, then humanize slug
    let label = labelMap[segment]
    if (!label) {
      label = segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    }

    const isLast = accumulated === loc.url.pathname.replace(/\/$/, '')
    const href: string | undefined = isLast ? undefined : `/${lang.value}${accumulated}`
    crumbs.push({ label, href })
  }

  // Build JSON-LD structured data
  const breadcrumbJsonLd = crumbs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.label,
          ...(crumb.href ? { item: `${loc.url.origin}${crumb.href}` } : {}),
        })),
      }
    : null

  if (crumbs.length <= 1) return null // only home — no breadcrumb needed

  return (
    <nav aria-label={t.nav.breadcrumb.label}>
      <ol
        class="flex flex-wrap items-center gap-1 text-sm"
        style="list-style: none; padding: 0; margin: 0;"
      >
        {crumbs.map((crumb, idx) => (
          <li class="flex items-center gap-1" key={idx}>
            {idx > 0 && (
              <svg
                class="size-3 shrink-0"
                style="color: var(--color-text-tertiary, oklch(0.5 0.02 280))"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 12 12"
              >
                <path
                  d="M4.5 2.5L7.5 6L4.5 9.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            )}
            {crumb.href ? (
              <a
                href={crumb.href}
                class="hover:underline"
                style="color: var(--color-text-secondary, oklch(0.6 0.02 280))"
              >
                {crumb.label}
              </a>
            ) : (
              <span
                class="font-medium"
                style="color: var(--color-text, oklch(0.9 0.02 280))"
                aria-current="page"
              >
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      {breadcrumbJsonLd && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      )}
    </nav>
  )
})
