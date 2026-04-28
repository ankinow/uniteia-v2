import type { ArticleSchema, WebSiteSchema } from '~/types/schema-org'

/**
 * Generate Article schema
 */
export function generateArticleSchema(props: {
  headline: string
  description?: string
  author?: string
  datePublished: string
  dateModified?: string | undefined
  image?: string
  url: string
  niche: string
  lang: string
}): ArticleSchema {
  const siteUrl = `https://${props.niche}.uniteia.com`
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
    datePublished: props.datePublished,
    dateModified: props.dateModified || props.datePublished,
    image: props.image || `${siteUrl}/og-image.png`,
    url: articleUrl,
    publisher: {
      '@type': 'Organization',
      name: 'UniTeia',
      url: 'https://uniteia.com',
    },
    articleSection: props.niche,
    inLanguage: props.lang,
  }
}

/**
 * Generate WebSite schema
 */
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
    inLanguage: props.lang,
  }
}
