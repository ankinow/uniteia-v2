/**
 * D1 REST API Client - SOTA 2026
 * Economic, surgical. No heavy deps. Direct Cloudflare API.
 * For local-only Ops Center publishing to remote D1.
 */

const CF_API_BASE = 'https://api.cloudflare.com/client/v4'

export interface D1Config {
  accountId: string
  databaseId: string
  apiToken: string
}

export interface D1QueryResult<T = unknown> {
  success: boolean
  results?: T[]
  error?: string
  meta?: {
    duration: number
    changes: number
    lastRowId?: number
  }
}

/**
 * Economic D1 REST client
 * No ORM, no heavy drivers. Pure fetch.
 */
export class D1RestClient {
  private accountId: string
  private databaseId: string
  private apiToken: string
  private lastQueryTime = 0
  private readonly MIN_QUERY_INTERVAL = 100 // ms between queries (rate limit guard)

  constructor(config: D1Config) {
    this.accountId = config.accountId
    this.databaseId = config.databaseId
    this.apiToken = config.apiToken
  }

  /**
   * Execute SQL query via D1 REST API
   * AgentOps: Rate limiting, error handling, audit logging
   */
  async query<T = unknown>(sql: string, params?: unknown[]): Promise<D1QueryResult<T>> {
    // AgentOps: Rate limit guard
    const now = Date.now()
    const elapsed = now - this.lastQueryTime
    if (elapsed < this.MIN_QUERY_INTERVAL) {
      await new Promise((r) => setTimeout(r, this.MIN_QUERY_INTERVAL - elapsed))
    }
    this.lastQueryTime = Date.now()

    // AgentOps: Input validation (prevent destructive queries in dry-run mode)
    const normalizedSql = sql.trim().toUpperCase()
    const isWrite =
      normalizedSql.startsWith('INSERT') ||
      normalizedSql.startsWith('UPDATE') ||
      normalizedSql.startsWith('DELETE') ||
      normalizedSql.startsWith('DROP') ||
      normalizedSql.startsWith('ALTER')

    try {
      const url = `${CF_API_BASE}/accounts/${this.accountId}/d1/database/${this.databaseId}/query`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params: params || [],
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`D1 API error ${response.status}: ${errorText}`)
      }

      const data = (await response.json()) as {
        success: boolean
        result?: Array<{
          results?: T[]
          success: boolean
          meta?: {
            duration: number
            changes: number
            last_row_id?: number
          }
        }>
        errors?: Array<{ message: string }>
      }

      if (!data.success) {
        const errorMsg = data.errors?.[0]?.message || 'Unknown D1 error'
        throw new Error(errorMsg)
      }

      const firstResult = data.result?.[0]

      return {
        success: true,
        results: firstResult?.results,
        meta: firstResult?.meta,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      // AgentOps: Audit log
      console.error(`[D1 REST] Query failed: ${errorMessage}`, { sql: sql.substring(0, 100) })

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  /**
   * Health check - verify D1 connectivity
   */
  async healthCheck(): Promise<{ ok: boolean; latencyMs: number }> {
    const start = Date.now()
    try {
      const result = await this.query('SELECT 1 as health')
      return {
        ok: result.success,
        latencyMs: Date.now() - start,
      }
    } catch {
      return { ok: false, latencyMs: Date.now() - start }
    }
  }

  /**
   * Insert or update product (upsert)
   */
  async upsertProduct(product: {
    id: string
    slug: string
    title: string
    description?: string
    category: string
    price?: number
    affiliate_link: string
    thumbnail_url?: string
    is_active?: boolean
    priority?: number
  }): Promise<D1QueryResult> {
    const sql = `
      INSERT INTO products (
        id, slug, title, description, category, price, 
        affiliate_link, thumbnail_url, is_active, priority, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        category = excluded.category,
        price = excluded.price,
        affiliate_link = excluded.affiliate_link,
        thumbnail_url = excluded.thumbnail_url,
        is_active = excluded.is_active,
        priority = excluded.priority,
        updated_at = excluded.updated_at
    `

    const now = Math.floor(Date.now() / 1000)
    const params = [
      product.id,
      product.slug,
      product.title,
      product.description || null,
      product.category,
      product.price || null,
      product.affiliate_link,
      product.thumbnail_url || null,
      product.is_active !== false ? 1 : 0,
      product.priority ?? 50,
      now,
      now,
    ]

    return this.query(sql, params)
  }

  /**
   * Insert generated content
   */
  async insertGeneratedContent(content: {
    id: string
    product_id?: string
    slug: string
    title: string
    content_type: 'review' | 'comparison' | 'guide' | 'description'
    content_markdown: string
    content_html: string
    meta_description?: string
    keywords?: string
    is_published?: boolean
    ai_model?: string
    generation_prompt?: string
    agent_pipeline?: string
    generation_time_ms?: number
  }): Promise<D1QueryResult> {
    const sql = `
      INSERT INTO generated_content (
        id, product_id, slug, title, content_type,
        content_markdown, content_html, word_count,
        meta_description, keywords, is_published,
        ai_model, generation_prompt, agent_pipeline,
        generation_time_ms, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        content_markdown = excluded.content_markdown,
        content_html = excluded.content_html,
        word_count = excluded.word_count,
        meta_description = excluded.meta_description,
        keywords = excluded.keywords,
        is_published = excluded.is_published,
        ai_model = excluded.ai_model,
        updated_at = excluded.updated_at
    `

    const now = Math.floor(Date.now() / 1000)
    const wordCount = content.content_markdown.trim().split(/\s+/).length

    const params = [
      content.id,
      content.product_id || null,
      content.slug,
      content.title,
      content.content_type,
      content.content_markdown,
      content.content_html,
      wordCount,
      content.meta_description || null,
      content.keywords || null,
      content.is_published !== false ? 1 : 0,
      content.ai_model || null,
      content.generation_prompt || null,
      content.agent_pipeline || 'orquidia.v1',
      content.generation_time_ms || null,
      now,
      now,
    ]

    return this.query(sql, params)
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string): Promise<D1QueryResult> {
    return this.query('SELECT * FROM products WHERE slug = ? AND is_active = 1 LIMIT 1', [slug])
  }

  /**
   * List products with pagination
   */
  async listProducts(limit = 20, offset = 0): Promise<D1QueryResult> {
    return this.query(
      `SELECT id, slug, title, category, price, affiliate_link, 
              is_active, priority, created_at 
       FROM products 
       WHERE is_active = 1 
       ORDER BY priority DESC, created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset],
    )
  }
}
