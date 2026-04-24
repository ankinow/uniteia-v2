/**
 * @uniteia/shared/types/cloudflare
 * Project-specific Cloudflare environment binding interfaces.
 *
 * NOTE: Base types (D1Database, KVNamespace, Ai, R2Bucket, etc.) come from
 * @cloudflare/workers-types (configured in orchestrator tsconfig).
 * This file only defines project-specific Env shapes and app variables.
 */

// ============================================================================
// BASE CLOUDFLARE BINDINGS
// ============================================================================

/**
 * CloudflareEnv: Standard Cloudflare Worker bindings for UniTeiaAI
 */
export interface CloudflareEnv {
  // KV Namespaces
  KV_STATIC_HTML: KVNamespace
  KV_METADATA: KVNamespace
  LLM_CACHE: KVNamespace
  CACHE: KVNamespace

  // D1 Database
  DB: D1Database

  // AI Bindings
  AI: Ai
  VECTORIZE: VectorizeIndex

  // R2 Storage
  IMAGES: R2Bucket

  // Durable Objects
  SEARCH_INDEX: DurableObjectNamespace
  HEALTH_MONITOR: DurableObjectNamespace
  MCP_SESSIONS: DurableObjectNamespace

  // Queues
  CONTENT_QUEUE: Queue

  // Secrets
  DATADOG_API_KEY: string
  NOTION_API_KEY: string
  NOTION_DATABASE_ID: string
  ML_AFFILIATE_ID: string
}

/**
 * GatewayEnv: Extended CloudflareEnv with gateway-specific bindings
 */
export interface GatewayEnv extends CloudflareEnv {
  // Additional KV Namespaces
  KV_PRICING: KVNamespace

  // Rate Limiting (Paid plan feature)
  RATE_LIMITER?: RateLimit

  // Workflows
  DAILY_BRIEFING_WORKFLOW: Workflow
  LINK_VALIDATOR_WORKFLOW: Workflow

  // Analytics
  ANALYTICS_ENGINE?: AnalyticsEngineDataset

  // Additional Secrets
  SHOPEE_APP_ID?: string
  SHOPEE_SECRET?: string
  AMAZON_ACCESS_KEY?: string
  AMAZON_SECRET_KEY?: string
}

/**
 * AppVariables: Hono context variables set by middleware
 */
export interface AppVariables {
  isAIAgent: boolean
  userAgent: string
  requestId: string
  startTime: number
  attribution?: import('./product').AffiliateAttribution
}
