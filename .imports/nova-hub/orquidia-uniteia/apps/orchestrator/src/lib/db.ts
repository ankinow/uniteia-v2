/**
 * Orquidia-uniteia D1 Database Utilities
 *
 * NOTE: This app shares the UniTeia D1 schema.
 * The `products` table schema here matches UniTeiaAI's production DB.
 */

import type { ProductCreate } from '@orquestra/shared'

export interface D1Env {
  DB: D1Database
}

/**
 * Product CRUD Operations
 */
export const productQueries = {
  async getAll(db: D1Database, limit = 20, offset = 0) {
    return db
      .prepare(
        'SELECT id, title, slug, category, price, affiliate_link, is_active, priority, created_at FROM products WHERE is_active = TRUE ORDER BY priority DESC, created_at DESC LIMIT ? OFFSET ?',
      )
      .bind(limit, offset)
      .all()
  },

  async getBySlug(db: D1Database, slug: string) {
    return db
      .prepare('SELECT * FROM products WHERE slug = ? AND is_active = TRUE')
      .bind(slug)
      .first()
  },

  async create(
    db: D1Database,
    product: ProductCreate & {
      id: string
      created_by?: string
      updated_by?: string
      created_at?: number
      updated_at?: number
    },
  ) {
    const now = Math.floor(Date.now() / 1000)
    // UniTeiaAI schema columns with audit fields
    return db
      .prepare(
        `
      INSERT INTO products (
        id,
        ml_item_id,
        title,
        slug,
        description,
        category,
        price,
        original_price,
        currency,
thumbnail_url,
commission_rate,
        rating,
        metadata_json,
        is_active,
        priority,
        score,
        created_at,
        updated_at,
        created_by,
        updated_by,
        publish_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        title=excluded.title,
        description=excluded.description,
        category=excluded.category,
        price=excluded.price,
original_price=excluded.original_price,
thumbnail_url=excluded.thumbnail_url,
metadata_json=excluded.metadata_json,
        is_active=excluded.is_active,
        priority=excluded.priority,
        score=excluded.score,
        updated_at=excluded.updated_at,
        updated_by=excluded.updated_by
    `,
      )
      .bind(
        product.id,
        null,
        product.title,
        product.slug,
        product.description || null,
        product.category,
        product.price ?? null,
        product.price_original ?? null,
        'BRL',
        product.thumbnail_url || product.image || null,
        0.12,
        null,
        JSON.stringify({
          ...product,
          // normalize key names expected elsewhere
          original_price: product.price_original,
        }),
        product.is_active ? 1 : 0,
        product.priority ?? 50,
        product.score ?? 0,
        product.created_at ?? now,
        product.updated_at ?? now,
        product.created_by || null,
        product.updated_by || null,
        'draft', // Default publish_status
      )
      .run()
  },
}

/**
 * Content Queries
 */
export const contentQueries = {
  async upsertGeneratedContent(
    db: D1Database,
    input: {
      productId?: string
      slug: string
      title: string
      contentType: string
      markdown: string
      html: string
      metaDescription?: string
      keywords?: string
      schemaJson?: string
      aiModel?: string
      generationPrompt?: string
      agentPipeline?: string
      generationTimeMs?: number
      publish?: boolean
    },
  ) {
    const now = Math.floor(Date.now() / 1000)
    const id = crypto.randomUUID()
    const publish = input.publish ?? true
    const wordCount = input.markdown.trim().split(/\s+/).filter(Boolean).length

    return db
      .prepare(
        `
      INSERT INTO generated_content (
        id,
        product_id,
        slug,
        title,
        content_html,
        content_markdown,
        word_count,
        schema_json,
        meta_description,
        keywords,
        content_type,
        ai_model,
        generation_prompt,
        is_published,
        created_at,
        updated_at,
        published_at,
        agent_pipeline,
        generation_time_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        title=excluded.title,
        content_html=excluded.content_html,
        content_markdown=excluded.content_markdown,
        word_count=excluded.word_count,
        schema_json=excluded.schema_json,
        meta_description=excluded.meta_description,
        keywords=excluded.keywords,
        content_type=excluded.content_type,
        ai_model=excluded.ai_model,
        generation_prompt=excluded.generation_prompt,
        is_published=excluded.is_published,
        updated_at=excluded.updated_at,
        published_at=excluded.published_at
    `,
      )
      .bind(
        id,
        input.productId || null,
        input.slug,
        input.title,
        input.html,
        input.markdown,
        wordCount,
        input.schemaJson || null,
        input.metaDescription || null,
        input.keywords || null,
        input.contentType,
        input.aiModel || null,
        input.generationPrompt || null,
        publish ? 1 : 0,
        now,
        now,
        publish ? now : null,
        input.agentPipeline || 'orquidia.orchestrator.v1',
        input.generationTimeMs ?? null,
      )
      .run()
  },
}

/**
 * Analytics Queries
 */
export const analyticsQueries = {
  async trackClick(
    db: D1Database,
    click: {
      id: string
      product_slug: string
      referrer?: string
      user_agent?: string
      ip_hash: string
      country?: string
    },
  ) {
    const now = Math.floor(Date.now() / 1000)
    return db
      .prepare(`
      INSERT INTO clicks (id, product_slug, referrer, user_agent, ip_hash, country, clicked_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        click.id,
        click.product_slug,
        click.referrer || null,
        click.user_agent || null,
        click.ip_hash,
        click.country || null,
        now,
      )
      .run()
  },

  async getClickStats(db: D1Database, days = 7) {
    const since = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60
    return db
      .prepare(`
      SELECT product_slug, COUNT(*) as click_count
      FROM clicks
      WHERE clicked_at >= ?
      GROUP BY product_slug
      ORDER BY click_count DESC
    `)
      .bind(since)
      .all()
  },

  async getDailyClicks(db: D1Database, days = 7) {
    const since = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60
    return db
      .prepare(`
      SELECT strftime('%Y-%m-%d', datetime(clicked_at, 'unixepoch')) as date,
             COUNT(*) as clicks
      FROM clicks
      WHERE clicked_at >= ?
      GROUP BY date
      ORDER BY date ASC
    `)
      .bind(since)
      .all()
  },

  async getTopProducts(db: D1Database, days = 7, limit = 5) {
    const since = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60
    return db
      .prepare(`
      SELECT p.title as title, c.product_slug as slug, COUNT(*) as clicks
      FROM clicks c
      LEFT JOIN products p ON p.slug = c.product_slug
      WHERE c.clicked_at >= ?
      GROUP BY c.product_slug
      ORDER BY clicks DESC
      LIMIT ?
    `)
      .bind(since, limit)
      .all()
  },

  async getCategoryBreakdown(db: D1Database, days = 7, limit = 4) {
    const since = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60
    return db
      .prepare(`
      SELECT COALESCE(p.category, 'Outros') as category, COUNT(*) as clicks
      FROM clicks c
      LEFT JOIN products p ON p.slug = c.product_slug
      WHERE c.clicked_at >= ?
      GROUP BY category
      ORDER BY clicks DESC
      LIMIT ?
    `)
      .bind(since, limit)
      .all()
  },
}
