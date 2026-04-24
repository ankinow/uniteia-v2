import { sql } from 'drizzle-orm'
import { blob, index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const agents = sqliteTable('agents', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  config: text('config'),
})

export const mlTrends = sqliteTable(
  'ml_trends',
  {
    id: text('id').primaryKey(),
    keyword: text('keyword').notNull(),
    title: text('title').notNull(),
    price: real('price').notNull(),
    originalPrice: real('original_price'),
    thumbnailUrl: text('thumbnail_url'),
    permalink: text('permalink').notNull(),
    categoryId: text('category_id'),
    sellerReputation: text('seller_reputation'),
    shippingFree: integer('shipping_free', { mode: 'boolean' }).default(false),
    condition: text('condition').default('new'),
    soldQuantity: integer('sold_quantity').default(0),
    fetchedAt: integer('fetched_at').default(sql`(unixepoch())`),
    expiresAt: integer('expires_at'),
  },
  (table) => {
    return {
      keywordIdx: index('idx_trends_keyword').on(table.keyword),
      categoryIdx: index('idx_trends_category').on(table.categoryId),
      expiresIdx: index('idx_trends_expires').on(table.expiresAt),
    }
  },
)

export const products = sqliteTable(
  'products',
  {
    id: text('id').primaryKey(),
    mlItemId: text('ml_item_id'),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    category: text('category').notNull(),
    price: real('price'),
    originalPrice: real('original_price'),
    currency: text('currency').default('BRL'),
    thumbnailUrl: text('thumbnail_url'),
    affiliateLink: text('affiliate_link').notNull(),
    commissionRate: real('commission_rate').default(0.12),
    rating: real('rating').default(0),
    metadataJson: text('metadata_json'),
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    priority: integer('priority').default(50),
    score: integer('score').default(0),
    vectorEmbedding: blob('vector_embedding', { mode: 'buffer' }),
    lastVerifiedAt: integer('last_verified_at', { mode: 'timestamp' }),
    createdAt: integer('created_at').default(sql`(unixepoch())`),
    updatedAt: integer('updated_at').default(sql`(unixepoch())`),
  },
  (table) => {
    return {
      slugIdx: index('idx_products_slug').on(table.slug),
      categoryIdx: index('idx_products_category').on(table.category),
      activeIdx: index('idx_products_active').on(table.isActive),
    }
  },
)

export const affiliateLinks = sqliteTable('affiliate_links', {
  id: text('id').primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  vendor: text('vendor').default('monorepo'),
  affiliateUrl: text('affiliate_url').notNull(),
  isValid: integer('is_valid', { mode: 'boolean' }).default(true),
  lastValidated: integer('last_validated').default(sql`(unixepoch())`),
})

export const affiliateClicks = sqliteTable(
  'affiliate_clicks',
  {
    id: text('id').primaryKey(),
    productId: text('product_id')
      .notNull()
      .references(() => products.id),
    productSlug: text('product_slug').notNull(),
    referrer: text('referrer'),
    userAgent: text('user_agent'),
    country: text('country'),
    city: text('city'),
    ipHash: text('ip_hash'),
    sessionId: text('session_id'),
    clickedAt: integer('clicked_at').default(sql`(unixepoch())`),
  },
  (table) => {
    return {
      productIdx: index('idx_clicks_product').on(table.productId),
      timeIdx: index('idx_clicks_time').on(table.clickedAt),
    }
  },
)

export const generatedContent = sqliteTable(
  'generated_content',
  {
    id: text('id').primaryKey(),
    productId: text('product_id').references(() => products.id),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    contentHtml: text('content_html').notNull(),
    contentMarkdown: text('content_markdown'),
    wordCount: integer('word_count').default(0),
    schemaJson: text('schema_json'),
    metaDescription: text('meta_description'),
    keywords: text('keywords'),
    contentType: text('content_type').default('review'),
    aiModel: text('ai_model'),
    generationPrompt: text('generation_prompt'),
    views: integer('views').default(0),
    isPublished: integer('is_published', { mode: 'boolean' }).default(false),
    createdAt: integer('created_at').default(sql`(unixepoch())`),
    updatedAt: integer('updated_at').default(sql`(unixepoch())`),
    publishedAt: integer('published_at'),
    agentPipeline: text('agent_pipeline'),
    generationTimeMs: integer('generation_time_ms'),
  },
  (table) => {
    return {
      slugIdx: index('idx_content_slug').on(table.slug),
      publishedIdx: index('idx_content_published').on(table.isPublished),
    }
  },
)

export const neuralInsights = sqliteTable(
  'Neural_Insights',
  {
    insightId: integer('insight_id').primaryKey({ autoIncrement: true }),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    insightType: text('insight_type').notNull(),
    contentMarkdown: text('content_markdown'),
    generatedAt: integer('generated_at').default(sql`(unixepoch())`),
    modelUsed: text('model_used'),
    validUntil: integer('valid_until'),
  },
  (table) => {
    return {
      productIdx: index('idx_insights_product').on(table.productId),
    }
  },
)
