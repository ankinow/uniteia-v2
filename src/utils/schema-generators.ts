import type { ArticleSchema, WebPageSchema, WebSiteSchema } from '~/types/schema-org'
import { toBcp47 } from '~/i18n/bcp47'

/**
 * Generate Article schema
 */
export function generateArticleSchema(props: {
  headline: string
  description?: string
  author?: string
  image?: string
  url: string
  niche: string
  lang: string
}): ArticleSchema {
  const siteUrl =
    props.niche === 'apex' ? 'https://uniteia.com' : `https://${props.niche}.uniteia.com`
  const articleUrl = `${siteUrl}/${props.lang}/${props.url}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.headline,
    description: props.description,
    author: props.author
      ? {
          '@type': 'Person',
          name: props.author,
        }
      : undefined,
    image: props.image || `${siteUrl}/og-image.png`,
    url: articleUrl,
    publisher: {
      '@type': 'Organization',
      name: 'UniTeia',
      url: 'https://uniteia.com',
    },
    articleSection: props.niche,
    inLanguage: toBcp47(props.lang),
  }
}

/**
 * Generate WebPage schema with inLanguage for locale-specific pages.
 * Use on article pages to provide structured data about the page itself.
 */
export function generateWebPageSchema(props: {
  name: string
  url: string
  description?: string
  lang: string
  breadcrumb?: Array<{ name: string; item: string }>
}): WebPageSchema {
  const result: WebPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: props.name,
    url: props.url,
    description: props.description,
    inLanguage: toBcp47(props.lang),
    isPartOf: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'UniTeia',
      url: 'https://uniteia.com',
    },
  }

  if (props.breadcrumb && props.breadcrumb.length > 0) {
    result.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: props.breadcrumb.map((item, index) => ({
        '@type': 'ListItem' as const,
        position: index + 1,
        name: item.name,
        item: item.item,
      })),
    }
  }

  return result
}

export function generateWebSiteSchema(props: {
  name: string
  url: string
  description?: string
  lang: string
}): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: props.name,
    url: props.url,
    description: props.description,
    publisher: {
      '@type': 'Organization',
      name: 'UniTeia',
      url: 'https://uniteia.com',
    },
    inLanguage: toBcp47(props.lang),
  }
}
