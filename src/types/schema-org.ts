/**
 * Schema.org Type Definitions
 * Centralized type definitions for structured data
 */

export interface ArticleSchema {
  '@context': 'https://schema.org'
  '@type': 'Article'
  headline: string
  description?: string | undefined
  author?: PersonSchema | OrganizationSchema | undefined
  datePublished?: string
  dateModified?: string | undefined
  image?: string | undefined
  url: string
  publisher?: OrganizationSchema | undefined
  articleSection?: string | undefined
  inLanguage?: string | undefined
}

export interface WebSiteSchema {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  url: string
  description?: string | undefined
  publisher?: OrganizationSchema | undefined
  inLanguage?: string | undefined
}

export interface OrganizationSchema {
  '@type': 'Organization'
  name: string
  url?: string
  logo?: ImageObjectSchema
}

export interface PersonSchema {
  '@type': 'Person'
  name: string
  url?: string
}

export interface ImageObjectSchema {
  '@type': 'ImageObject'
  url: string
  width?: number
  height?: number
}

export type SchemaType = ArticleSchema | WebSiteSchema
