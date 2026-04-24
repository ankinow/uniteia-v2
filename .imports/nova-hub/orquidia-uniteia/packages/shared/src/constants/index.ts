/**
 * @uniteia/shared - Constants Module
 * SOTA 2026: Centralized constants for the entire monorepo
 *
 * Single source of truth for:
 * - API endpoints
 * - Cache TTLs
 * - Rate limits
 * - Feature flags
 * - Design tokens (CSS custom properties)
 */

// ============================================================================
// API CONSTANTS
// ============================================================================

export const API_VERSION = 'v1' as const

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  SEARCH: '/api/search',
  MCP: '/mcp',
  HEALTH: '/health',
  LLMS_TXT: '/llms.txt',
} as const

// ============================================================================
// CACHE CONSTANTS
// ============================================================================

export const CACHE_TTL = {
  /** Static HTML pages - 1 hour */
  HTML: 3600,
  /** Product metadata - 30 minutes */
  METADATA: 1800,
  /** LLM responses - 24 hours */
  LLM: 86400,
  /** Search results - 15 minutes */
  SEARCH: 900,
  /** Category list - 6 hours */
  CATEGORIES: 21600,
  /** Session data - 24 hours */
  SESSION: 86400,
} as const

export const CACHE_KEYS = {
  PRODUCT: (slug: string) => `product:${slug}`,
  CATEGORY: (slug: string) => `category:${slug}`,
  SEARCH: (query: string) => `search:${query}`,
  HTML: (path: string) => `html:${path}`,
  LLM: (prompt: string) => `llm:${prompt}`,
} as const

// ============================================================================
// RATE LIMITS
// ============================================================================

export const RATE_LIMITS = {
  /** API requests per minute */
  API: 60,
  /** Search requests per minute */
  SEARCH: 30,
  /** MCP requests per minute */
  MCP: 100,
} as const

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const

// ============================================================================
// AI MODELS
// ============================================================================

export const AI_MODELS = {
  /** Workers AI models */
  LLM: '@cf/meta/llama-3-8b-instruct',
  EMBEDDING: '@cf/baai/bge-base-en-v1.5',
  IMAGE: '@cf/bytedance/stable-diffusion-xl-lightning',
  /** Embedding dimensions */
  EMBEDDING_DIMENSIONS: 768,
} as const

// ============================================================================
// AI AGENT USER AGENTS (for DCI middleware)
// ============================================================================

export const AI_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'Amazonbot',
  'anthropic-ai',
  'Google-Extended',
  'PerplexityBot',
  'Bytespider',
  'CCBot',
  'FacebookBot',
  'cohere-ai',
  'Applebot-Extended',
  'Meta-ExternalFetcher',
  'YouBot',
  'AI2Bot',
  'Diffbot',
  'Omgilibot',
  'Seekr',
] as const

// ============================================================================
// MARKETPLACE CONSTANTS
// ============================================================================

export const MARKETPLACES = {
  MERCADO_LIVRE: {
    name: 'Mercado Livre',
    domain: 'mercadolivre.com',
  },
  AMAZON: {
    name: 'Amazon',
    domain: 'amazon.com.br',
  },
  SHOPEE: {
    name: 'Shopee',
    domain: 'shopee.com.br',
  },
} as const

// ============================================================================
// DESIGN TOKENS (CSS Custom Properties)
// ============================================================================

export const DESIGN_TOKENS = {
  colors: {
    // Ink palette (dark backgrounds)
    'ink-900': '#0a0a0b',
    'ink-800': '#0d0e12',
    'ink-700': '#141519',
    'ink-600': '#8b8b8b',
    'ink-wash': 'rgba(255, 255, 255, 0.05)',

    // Bone palette (light elements)
    'bone-paper': '#f5f5f0',
    'bone-shadow': '#e8e8e0',

    // Neural accent (cyan)
    'neural-cyan': '#00f0ff',
    'neural-intense': '#00e0ff',

    // Semantic colors
    biopunk: '#22c55e',
    chrono: '#ef4444',
    'dopamind-terra': '#E8793B',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  typography: {
    'font-mono': 'JetBrains Mono, monospace',
    'font-sans': 'Inter, system-ui, sans-serif',
    'font-display': 'Space Grotesk, sans-serif',
  },

  animation: {
    'duration-fast': '150ms',
    'duration-normal': '300ms',
    'duration-slow': '500ms',
    'easing-default': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'easing-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const

// ============================================================================
// HTTP STATUS CODES
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

// ============================================================================
// ERROR CODES
// ============================================================================

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
  AI_ERROR: 'AI_ERROR',
} as const

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURE_FLAGS = {
  /** Enable AI-powered content generation */
  AI_CONTENT: true,
  /** Enable semantic search with Vectorize */
  SEMANTIC_SEARCH: true,
  /** Enable MCP protocol endpoints */
  MCP_ENABLED: true,
  /** Enable Datadog telemetry */
  DATADOG_ENABLED: true,
  /** Enable DCI bi-modal serving */
  DCI_ENABLED: true,
  /** Enable self-healing link guardian */
  LINK_GUARDIAN: true,
} as const
