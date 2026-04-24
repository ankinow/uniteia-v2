/**
 * @uniteia/shared - Types Module
 * SOTA 2026: Centralized TypeScript types for the entire monorepo
 *
 * This module exports all shared types used across apps and packages.
 * Single source of truth for data structures.
 *
 * Architecture:
 * - Base types: Minimal required fields
 * - Extended types: Domain-specific additions
 * - DTO types: API serialization
 */

// ============================================================================
// PRODUCT TYPES — Layered Architecture
// ============================================================================

/**
 * ProductBase: Minimal required fields for any product representation
 */
export interface ProductBase {
  id: string
  slug: string
  title: string
  category: string
  is_active: boolean
}

/**
 * Product: Full product type for business logic
 */
export interface Product extends ProductBase {
  description: string
  image: string
  thumbnail_url?: string
  price?: number
  price_original?: number
  original_price?: number // Alias for D1 compatibility
  discount_percentage?: number
  subcategory?: string
  brand?: string
  score: number
  priority: number
  is_published: boolean
  created_at: number
  updated_at: number

  // AI-generated content
  structuredReview?: StructuredReview
  specs?: Record<string, string | number>
  specs_json?: string // Serialized for D1

  // SEO & GEO
  meta_title?: string
  meta_description?: string
  keywords?: string[]

  // Marketplace-specific
  ml_item_id?: string
  rating?: number
  currency?: string
  metadata_json?: string
}

/**
 * ProductDTO: API response format
 */
export interface ProductDTO extends Omit<Product, 'specs_json' | 'metadata_json'> {
  url: string
  savings?: number
}

/**
 * ProductSEO: Schema.org compliant
 */
export interface ProductSEO {
  '@context': 'https://schema.org'
  '@type': 'Product'
  name: string
  description: string
  image: string
  url: string
  brand?: { '@type': 'Brand'; name: string }
  offers?: {
    '@type': 'Offer'
    price: number
    priceCurrency: string
    availability: string
    url: string
  }
}

export interface StructuredReview {
  verdict: string
  pros: string[]
  cons: string[]
  score: number
  summary?: string
  analysis?: string
}

// ============================================================================
// CONTENT TYPES
// ============================================================================

export interface Article {
  id: string
  slug: string
  title: string
  content_markdown: string
  excerpt?: string
  author?: string
  published_at?: number
  updated_at: number
  category: string
  tags?: string[]
  featured_image?: string
  is_published: boolean
}

export interface Category {
  id: string
  slug: string
  name: string
  description?: string
  icon?: string
  parent_id?: string
  priority: number
  product_count: number
}

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: ApiMeta
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface ApiMeta {
  page?: number
  limit?: number
  total?: number
  hasMore?: boolean
}

export interface PaginationParams {
  page?: number
  limit?: number
  cursor?: string
}

export interface SearchParams extends PaginationParams {
  query: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'score' | 'newest'
}

// ============================================================================
// CLOUDFLARE BINDINGS TYPES
// ============================================================================
// NOTE: Cloudflare-specific types (CloudflareEnv, GatewayEnv) are exported from
// '@uniteia/shared/types/cloudflare' to avoid type errors in non-CF environments.
// Import from there if you need KVNamespace, D1Database, etc.
// ============================================================================

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface AnalyticsEvent {
  event_type: string
  event_data: Record<string, unknown>
  timestamp: number
  session_id?: string
  user_agent?: string
  ip_hash?: string
}

export interface NeuralInsight {
  id: string
  product_id: string
  insight_type: 'verdict' | 'pros_cons' | 'comparison' | 'trend'
  content_markdown: string
  confidence_score: number
  generated_at: number
  model_version?: string
}

// ============================================================================
// MCP PROTOCOL TYPES
// ============================================================================

export interface MCPTool {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, MCPParameter>
    required?: string[]
  }
}

export interface MCPParameter {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description?: string
  enum?: string[]
  default?: unknown
}

export interface MCPRequest {
  method: string
  params?: Record<string, unknown>
}

export interface MCPResponse<T = unknown> {
  result?: T
  error?: {
    code: number
    message: string
  }
}

// ============================================================================
// AI ORCHESTRATOR TYPES (Admin Panel)
// ============================================================================

/**
 * ChatMessage: Message in AI chat history
 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  timestamp: number
  metadata?: {
    model?: string
    tokens_used?: number
    latency_ms?: number
    tool_calls?: ToolCall[]
  }
}

/**
 * ToolCall: MCP/AI tool invocation
 */
export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
  result?: unknown
  status: 'pending' | 'running' | 'success' | 'error'
  error?: string
  started_at: number
  completed_at?: number
}

/**
 * Agent: AI agent configuration
 */
export interface Agent {
  id: string
  name: string
  description: string
  provider: AIProvider
  model: string
  system_prompt?: string
  temperature?: number
  max_tokens?: number
  tools?: string[]
  is_active: boolean
  created_at: number
  updated_at: number
}

/**
 * AIProvider: Supported AI providers
 */
export type AIProvider =
  | 'workers-ai'
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'together'
  | 'mistral'
  | 'local'

/**
 * AIProviderConfig: Provider-specific configuration
 */
export interface AIProviderConfig {
  provider: AIProvider
  api_key?: string
  base_url?: string
  model: string
  default_temperature?: number
  default_max_tokens?: number
  rate_limit?: {
    requests_per_minute: number
    tokens_per_minute: number
  }
}

/**
 * OrchestratorState: Admin orchestrator store state
 */
export interface OrchestratorState {
  agents: Agent[]
  active_agent_id?: string
  chat_history: ChatMessage[]
  pending_tool_calls: ToolCall[]
  providers: AIProviderConfig[]
  is_loading: boolean
  error?: string
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * DeepPartial: Make all properties and nested properties optional
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * RequireKeys: Make specific keys required
 */
export type RequireKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * Nullable: Allow null for a type
 */
export type Nullable<T> = T | null

/**
 * AsyncResult: Standard async operation result
 */
export type AsyncResult<T, E = Error> = { success: true; data: T } | { success: false; error: E }

/**
 * Brand: Nominal typing for primitives
 * @example type UserId = Brand<string, 'UserId'>
 */
export type Brand<T, B> = T & { __brand: B }

/**
 * ProductSlug: Branded type for product slugs
 */
export type ProductSlug = Brand<string, 'ProductSlug'>

/**
 * ProductId: Branded type for product IDs
 */
export type ProductId = Brand<string, 'ProductId'>

// Note: KVNamespace, Workflow, WorkflowInstance, RateLimit are already defined
// by @cloudflare/workers-types. Import them directly from that package if needed.
// We don't redeclare them here to avoid conflicts.
