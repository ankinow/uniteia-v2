/**
 * @uniteia/shared - Zod Schemas Module
 * SOTA 2026: Runtime validation schemas with Zod
 */

import { z } from 'zod'

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Flexible ID validation - accepts UUID, ULID, Nanoid, or plain string
 * Matches D1 schema which uses text().primaryKey()
 */
export const FlexibleIdSchema = z
  .string()
  .uuid()
  .or(z.string().ulid())
  .or(z.string().nanoid())
  .or(z.string())

/**
 * Validate cursor format (base64-encoded JSON)
 */
export const CursorSchema = z
  .string()
  .optional()
  .refine((val) => {
    if (!val) return true
    try {
      const decoded = Buffer.from(val, 'base64').toString()
      const parsed = JSON.parse(decoded)
      return typeof parsed === 'object' && parsed !== null
    } catch {
      return false
    }
  }, 'Invalid cursor format')

// ============================================================================
// PRODUCT SCHEMAS
// ============================================================================

export const ProductSchema = z.object({
  id: FlexibleIdSchema,
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be URL-safe'),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000).optional(),
  image: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  price: z.number().positive().optional(),
  price_original: z.number().positive().optional(),
  discount_percentage: z.number().min(0).max(100).optional(),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  score: z.number().min(0).max(100).default(0),
  priority: z.number().int().min(0).default(50),
  is_active: z.boolean().default(true),
  is_published: z.boolean().default(false),
  created_at: z.number().int().optional(),
  updated_at: z.number().int().optional(),
  specs: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
  meta_title: z.string().max(60).optional(),
  meta_description: z.string().max(160).optional(),
  keywords: z.union([z.string(), z.array(z.string())]).optional(),
})

export const ProductCreateSchema = ProductSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const ProductUpdateSchema = ProductSchema.partial().omit({
  id: true,
  created_at: true,
})

// ============================================================================
// API SCHEMAS
// ============================================================================

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  cursor: CursorSchema,
})

export const SearchParamsSchema = PaginationSchema.extend({
  query: z.string().min(1).max(200).optional(),
  category: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  sortBy: z.enum(['relevance', 'price_asc', 'price_desc', 'score', 'newest']).default('relevance'),
})

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
    meta: z
      .object({
        page: z.number().optional(),
        limit: z.number().optional(),
        total: z.number().optional(),
        hasMore: z.boolean().optional(),
      })
      .optional(),
  })

// ============================================================================
// CATEGORY SCHEMAS
// ============================================================================

export const CategorySchema = z.object({
  id: FlexibleIdSchema,
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  parent_id: z.string().uuid().optional(),
  priority: z.number().int().default(0),
  product_count: z.number().int().default(0),
})

// ============================================================================
// CONTENT SCHEMAS
// ============================================================================

export const ArticleSchema = z.object({
  id: FlexibleIdSchema,
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  content_markdown: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  author: z.string().optional(),
  published_at: z.number().int().optional(),
  updated_at: z.number().int(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  featured_image: z.string().url().optional(),
  is_published: z.boolean().default(false),
})

export const StructuredReviewSchema = z.object({
  verdict: z.string().min(1).max(1000),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  score: z.number().min(0).max(100),
  summary: z.string().optional(),
  analysis: z.string().optional(),
})

// ============================================================================
// MCP SCHEMAS
// ============================================================================

export const MCPRequestSchema = z.object({
  method: z.string(),
  params: z.record(z.unknown()).optional(),
})

export const MCPToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.object({
    type: z.literal('object'),
    properties: z.record(
      z.object({
        type: z.enum(['string', 'number', 'boolean', 'array', 'object']),
        description: z.string().optional(),
        enum: z.array(z.string()).optional(),
        default: z.unknown().optional(),
      }),
    ),
    required: z.array(z.string()).optional(),
  }),
})

// ============================================================================
// TYPE EXPORTS (inferred from schemas)
// Note: Base types (Article, Category, SearchParams, StructuredReview)
// are exported from ./types/index.ts to avoid duplication
// ============================================================================

export type ProductInput = z.infer<typeof ProductSchema>
export type ProductCreate = z.infer<typeof ProductCreateSchema>
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>
