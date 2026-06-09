/**
 * Manifest Schema — Validação Zod do content-manifest.yaml
 *
 * Única fonte de verdade para todos os artigos × locales.
 * Substitui: NICHES_INDEX_DATA, ARTICLES[], getCanvasYamlForSlug()
 */

import { z } from 'zod'

// ─── Locale strings (8 locales obrigatórios) ───
const localeRecord = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    en: schema,
    pt: schema,
    es: schema,
    fr: schema,
    de: schema,
    it: schema,
    ja: schema,
    zh: schema,
  })

// ─── Canvas node ───
const canvasNodeSchema = z.object({
  id: z.string().min(1).describe('Unique node identifier (e.g. "hero", "brain")'),
  section: z.union([z.string().min(1), z.number()]).describe('Human-readable section label'),
  type: z
    .enum([
      'hero',
      'card',
      'grid',
      'insight',
      'timeline',
      'quote',
      'text',
      'image',
      'list',
      'table',
    ])
    .describe('Visual node type'),
})

// ─── Canvas layout ───
const canvasSchema = z.object({
  tone: z.enum(['warm-gray', 'parchment', 'obsidian', 'neural-blue', 'coral']),
  layout: z.enum([
    'neural-branch',
    'timeline-spiral',
    'editorial-collage',
    'constellation',
    'storyboard',
  ]),
  nodes: z.array(canvasNodeSchema).min(1).max(12),
  connectors: z
    .array(
      z.object({
        from: z.string().min(1),
        to: z.string().min(1),
        label: z.string().optional(),
      })
    )
    .optional(),
})

// ─── Article ───
const articleSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  niche: z.string().min(1),
  tags: z.array(z.string()).min(1).max(5),
  verdict: z.enum(['trusted', 'caution', 'flagged']).default('trusted'),
  quality_score: z.number().min(0).max(100).default(85),
  subjects: z.array(z.string()).optional(),
  referral_links: z.array(z.string()).optional(),
  canvas: canvasSchema.optional(), // omitir para auto-geração
  locales: localeRecord(
    z.object({
      title: z.string().min(1),
      subtitle: z.string().optional(),
      body: z.string().min(1),
    })
  ),
})

// ─── Niche index ───
const nicheIndexSchema = z.object({
  subject: z.string(),
  locales: localeRecord(
    z.object({
      title: z.string().min(1),
      subtitle: z.string().optional(),
      body: z.string().min(1),
    })
  ),
})

// ─── Top-level manifest ───
export const manifestSchema = z.object({
  version: z.literal('1.0'),
  niches: z.record(z.string(), nicheIndexSchema),
  articles: z.array(articleSchema).min(1),
})

export type Manifest = z.infer<typeof manifestSchema>
export type ArticleEntry = z.infer<typeof articleSchema>
export type CanvasDef = z.infer<typeof canvasSchema>
export type CanvasNode = z.infer<typeof canvasNodeSchema>
