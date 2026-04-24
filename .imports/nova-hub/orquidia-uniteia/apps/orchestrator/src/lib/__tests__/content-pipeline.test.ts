/**
 * Content Pipeline Test Suite
 * SOTA 2026: Tests for AI-powered content generation workflows
 */

import { beforeEach, describe, expect, mock, test } from 'bun:test'

// =============================================================================
// Mock Setup
// =============================================================================

const mockDbFirst = mock(() => Promise.resolve(null))
const mockDbAll = mock(() => Promise.resolve({ results: [] }))
const mockDbRun = mock(() => Promise.resolve({ success: true }))

const mockDb = {
  prepare: mock(() => ({
    bind: mock((..._args: unknown[]) => ({
      first: mockDbFirst,
      all: mockDbAll,
      run: mockDbRun,
    })),
  })),
}

const mockGeneratorGenerate = mock(() =>
  Promise.resolve({
    title: 'Best Wireless Headphones 2026',
    content: '<h1>Best Wireless Headphones</h1><p>Great sound quality...</p>',
    metaDescription: 'Discover the best wireless headphones for 2026',
    seoKeywords: ['headphones', 'wireless', 'bluetooth'],
    model: 'gemini-2.0-flash',
  }),
)

const mockOrchestratorInitialize = mock(() => undefined)

// Mock @orquestra/ai-core
mock.module('@orquestra/ai-core', () => ({
  ContentGenerator: mock(() => ({ generate: mockGeneratorGenerate })),
  OrchestratorAgent: mock(() => ({ initialize: mockOrchestratorInitialize })),
}))

const mockLogAuditEvent = mock(() => Promise.resolve())
const mockLogContentGeneration = mock(() => Promise.resolve())

mock.module('../audit', () => ({
  logAuditEvent: mockLogAuditEvent,
  logContentGeneration: mockLogContentGeneration,
}))

const mockUpsertGeneratedContent = mock(() => Promise.resolve({ success: true }))

mock.module('../db', () => ({
  contentQueries: {
    upsertGeneratedContent: mockUpsertGeneratedContent,
  },
}))

const mockEvent = {
  context: {
    cloudflare: {
      env: {
        DB: mockDb as unknown as D1Database,
        GEMINI_API_KEY: 'test-gemini-key',
        ENVIRONMENT: 'production',
        CF_ACCESS_TEAM_NAME: 'test-team',
        CF_ACCESS_AUD: 'test-aud',
        ADMIN_EMAILS: 'admin@test.com',
      },
    },
  },
  node: {
    req: {
      headers: {
        'cf-connecting-ip': '1.2.3.4',
        'cf-access-jwt-assertion': 'valid-jwt',
      } as Record<string, string>,
    },
  },
}

mock.module('vinxi/http', () => ({
  getEvent: () => mockEvent,
}))

// Mock jose for auth-middleware dependency
mock.module('jose', () => ({
  jwtVerify: mock(() =>
    Promise.resolve({
      payload: {
        sub: 'user-123',
        email: 'admin@test.com',
        groups: ['admin'],
      },
    }),
  ),
  createRemoteJWKSet: mock(() => ({})),
}))

const {
  createWorkflow,
  generatePageContent,
  executeWorkflow,
  submitForReview,
  publishContent,
  archiveContent,
  getContentPagesByStatus,
} = await import('../content-pipeline')

// =============================================================================
// TESTS
// =============================================================================

describe('Content Pipeline', () => {
  beforeEach(() => {
    mockDbFirst.mockReset()
    mockDbAll.mockReset()
    mockDbAll.mockImplementation(() => Promise.resolve({ results: [] }))
    mockDbRun.mockReset()
    mockDbRun.mockImplementation(() => Promise.resolve({ success: true }))
    mockDb.prepare.mockClear()

    mockGeneratorGenerate.mockReset()
    mockGeneratorGenerate.mockImplementation(() =>
      Promise.resolve({
        title: 'Best Wireless Headphones 2026',
        content: '<h1>Best Wireless Headphones</h1><p>Great sound quality...</p>',
        metaDescription: 'Discover the best wireless headphones for 2026',
        seoKeywords: ['headphones', 'wireless', 'bluetooth'],
        model: 'gemini-2.0-flash',
      }),
    )

    mockLogAuditEvent.mockReset()
    mockLogAuditEvent.mockImplementation(() => Promise.resolve())
    mockLogContentGeneration.mockReset()
    mockLogContentGeneration.mockImplementation(() => Promise.resolve())
    mockUpsertGeneratedContent.mockReset()
    mockUpsertGeneratedContent.mockImplementation(() => Promise.resolve({ success: true }))

    // Reset env
    mockEvent.context.cloudflare.env.DB = mockDb as unknown as D1Database
    mockEvent.context.cloudflare.env.GEMINI_API_KEY = 'test-gemini-key'
    mockEvent.node.req.headers['cf-access-jwt-assertion'] = 'valid-jwt'
  })

  // ---------------------------------------------------------------------------
  // createWorkflow
  // ---------------------------------------------------------------------------

  describe('createWorkflow', () => {
    test('creates workflow and returns UUID', async () => {
      const result = await createWorkflow({
        name: 'Test Workflow',
        templateType: 'hub',
      })

      expect(result.workflowId).toBeTruthy()
      expect(typeof result.workflowId).toBe('string')
      // UUID format: 8-4-4-4-12
      expect(result.workflowId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      )
    })

    test('logs audit event on creation', async () => {
      await createWorkflow({
        name: 'Audit Workflow',
        templateType: 'comparison',
        maxPages: 5,
      })

      expect(mockLogAuditEvent).toHaveBeenCalledWith(
        'workflow_start',
        'workflow',
        expect.objectContaining({
          details: expect.objectContaining({
            maxPages: 5,
          }),
        }),
      )
    })

    test('throws when DB not available', async () => {
      mockEvent.context.cloudflare.env.DB = undefined as unknown as D1Database

      await expect(createWorkflow({ name: 'Test', templateType: 'hub' })).rejects.toThrow(
        'Database not available',
      )
    })

    test('throws when not authenticated', async () => {
      // No JWT + no dev mode = unauthenticated
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = ''
      mockEvent.node.req.headers.authorization = ''

      await expect(createWorkflow({ name: 'Test', templateType: 'hub' })).rejects.toThrow(
        'Authentication required',
      )
    })
  })

  // ---------------------------------------------------------------------------
  // generatePageContent
  // ---------------------------------------------------------------------------

  describe('generatePageContent', () => {
    test('generates content with AI and saves to DB', async () => {
      const page = await generatePageContent('workflow-1', {
        name: 'Headphones Review',
        templateType: 'hub',
        tone: 'enthusiastic',
      })

      expect(page.id).toBeTruthy()
      expect(page.slug).toBe('best-wireless-headphones-2026')
      expect(page.title).toBe('Best Wireless Headphones 2026')
      expect(page.content_html).toContain('Best Wireless Headphones')
      expect(page.meta_description).toBe('Discover the best wireless headphones for 2026')
      expect(page.keywords).toEqual(['headphones', 'wireless', 'bluetooth'])
      expect(page.content_type).toBe('hub')
      expect(page.ai_model).toBe('gemini-2.0-flash')
      expect(page.is_published).toBe(false)
      expect(page.views).toBe(0)
    })

    test('saves content via contentQueries.upsertGeneratedContent', async () => {
      await generatePageContent('workflow-2', {
        name: 'Test Product',
        templateType: 'guide',
      })

      expect(mockUpsertGeneratedContent).toHaveBeenCalledWith(
        mockDb,
        expect.objectContaining({
          slug: 'best-wireless-headphones-2026',
          title: 'Best Wireless Headphones 2026',
          contentType: 'guide',
          publish: false,
        }),
      )
    })

    test('logs content generation audit event', async () => {
      await generatePageContent('workflow-3', {
        name: 'Review',
        templateType: 'hub',
      })

      expect(mockLogContentGeneration).toHaveBeenCalledWith(
        expect.any(String), // pageId
        'workflow-3', // workflowId
        'gemini-2.0-flash', // model
      )
    })

    test('uses product data when provided', async () => {
      await generatePageContent(
        'workflow-4',
        {
          name: 'Product Review',
          templateType: 'hub',
          tone: 'professional',
        },
        {
          title: 'Sony WH-1000XM6',
          category: 'Electronics',
          features: ['ANC', '30h battery', 'Bluetooth 5.3'],
          description: 'Premium noise cancelling headphones',
          affiliateLink: 'https://mercadolivre.com.br/...',
        },
      )

      expect(mockGeneratorGenerate).toHaveBeenCalledWith(
        expect.objectContaining({
          productName: 'Sony WH-1000XM6',
          category: 'Electronics',
          features: ['ANC', '30h battery', 'Bluetooth 5.3'],
          contentType: 'guide',
          tone: 'professional',
        }),
      )
    })

    test('maps template types to content types correctly', async () => {
      // comparison → comparison
      mockGeneratorGenerate.mockImplementation(() =>
        Promise.resolve({
          title: 'Comparison Title',
          content: '<p>comparing</p>',
          metaDescription: 'Compare products',
          seoKeywords: ['compare'],
          model: 'gemini-2.0-flash',
        }),
      )

      const page = await generatePageContent('wf', {
        name: 'Compare',
        templateType: 'comparison',
      })
      expect(page.content_type).toBe('comparison')
    })

    test('throws when DB not available', async () => {
      mockEvent.context.cloudflare.env.DB = undefined as unknown as D1Database

      await expect(
        generatePageContent('wf', { name: 'Test', templateType: 'hub' }),
      ).rejects.toThrow('Database not available')
    })

    test('throws when not authenticated', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = ''
      mockEvent.node.req.headers.authorization = ''

      await expect(
        generatePageContent('wf', { name: 'Test', templateType: 'hub' }),
      ).rejects.toThrow('Authentication required')
    })

    test('throws when GEMINI_API_KEY not configured', async () => {
      mockEvent.context.cloudflare.env.GEMINI_API_KEY = ''

      await expect(
        generatePageContent('wf', { name: 'Test', templateType: 'hub' }),
      ).rejects.toThrow('GEMINI_API_KEY not configured')
    })
  })

  // ---------------------------------------------------------------------------
  // executeWorkflow
  // ---------------------------------------------------------------------------

  describe('executeWorkflow', () => {
    test('executes workflow and returns completed result', async () => {
      const result = await executeWorkflow('workflow-exec-1', {
        name: 'Workflow Exec',
        templateType: 'guide',
        keywords: ['audio', 'bluetooth', 'premium', 'wireless'],
        maxPages: 2,
      })

      expect(result.workflowId).toBe('workflow-exec-1')
      expect(result.status).toBe('completed')
      expect(result.totalPages).toBe(2)
      expect(result.completedPages).toBe(2)
      expect(result.failedPages).toBe(0)
      expect(result.pages).toHaveLength(2)
      expect(result.pages[0].status).toBe('draft')
      expect(result.pages[0].canonicalPath).toContain('/guias/')
    })

    test('logs workflow_complete audit event on success', async () => {
      await executeWorkflow('workflow-exec-2', {
        name: 'Workflow Exec',
        templateType: 'guide',
        keywords: ['audio', 'bluetooth', 'premium', 'wireless'],
        maxPages: 2,
      })

      expect(mockLogAuditEvent).toHaveBeenCalledWith(
        'workflow_complete',
        'workflow',
        expect.objectContaining({
          resourceId: 'workflow-exec-2',
          details: { completed: 2, failed: 0, total: 2 },
          success: true,
        }),
      )
    })

    test('handles generation failure gracefully', async () => {
      mockGeneratorGenerate.mockImplementation(() => {
        throw new Error('API quota exceeded')
      })

      const result = await executeWorkflow('workflow-fail-1', {
        name: 'Workflow Fail',
        templateType: 'hub',
        keywords: ['alpha', 'beta', 'gamma', 'delta'],
        maxPages: 2,
      })

      expect(result.status).toBe('failed')
      expect(result.completedPages).toBe(0)
      expect(result.failedPages).toBe(2)
      expect(result.pages[0].pageId).toBe('failed-0')
      expect(result.pages[0].error).toContain('API quota exceeded')
    })

    test('logs workflow_failed on generation error', async () => {
      mockGeneratorGenerate.mockImplementation(() => {
        throw new Error('Rate limited')
      })

      await executeWorkflow('workflow-fail-2', {
        name: 'Workflow Fail',
        templateType: 'hub',
        keywords: ['alpha', 'beta'],
        maxPages: 2,
      })

      expect(mockLogAuditEvent).toHaveBeenCalledWith(
        'workflow_failed',
        'workflow',
        expect.objectContaining({
          success: false,
        }),
      )
    })

    test('throws when DB not available', async () => {
      mockEvent.context.cloudflare.env.DB = undefined as unknown as D1Database

      await expect(
        executeWorkflow('wf', { name: 'WF', templateType: 'hub', maxPages: 2 }),
      ).rejects.toThrow('Database not available')
    })
  })

  // ---------------------------------------------------------------------------
  // submitForReview
  // ---------------------------------------------------------------------------

  describe('submitForReview', () => {
    test('logs review audit event', async () => {
      await submitForReview('page-123')

      expect(mockLogAuditEvent).toHaveBeenCalledWith(
        'content_review',
        'generated_content',
        expect.objectContaining({
          resourceId: 'page-123',
          details: { action: 'submit_for_review' },
        }),
      )
    })

    test('throws when DB not available', async () => {
      mockEvent.context.cloudflare.env.DB = undefined as unknown as D1Database

      await expect(submitForReview('page-123')).rejects.toThrow('Database not available')
    })

    test('throws when not authenticated', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = ''
      mockEvent.node.req.headers.authorization = ''

      await expect(submitForReview('page-123')).rejects.toThrow('Authentication required')
    })
  })

  // ---------------------------------------------------------------------------
  // publishContent
  // ---------------------------------------------------------------------------

  describe('publishContent', () => {
    test('logs publish audit event', async () => {
      await publishContent('page-456')

      expect(mockLogAuditEvent).toHaveBeenCalledWith(
        'publish',
        'generated_content',
        expect.objectContaining({
          resourceId: 'page-456',
          details: { published_by: 'admin@test.com' },
        }),
      )
    })

    test('throws when DB not available', async () => {
      mockEvent.context.cloudflare.env.DB = undefined as unknown as D1Database

      await expect(publishContent('page-456')).rejects.toThrow('Database not available')
    })

    test('throws when not authenticated', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = ''
      mockEvent.node.req.headers.authorization = ''

      await expect(publishContent('page-456')).rejects.toThrow('Authentication required')
    })

    test('throws when not admin', async () => {
      // Force non-admin state via mock
      // Note: since auth mock always returns admin@test.com and ADMIN_EMAILS includes it,
      // we need to change ADMIN_EMAILS to not include admin@test.com
      mockEvent.context.cloudflare.env.ADMIN_EMAILS = 'other@test.com'

      // Also need to mock jose to return a non-admin email
      const { jwtVerify: jwtVerifyMock } = await import('jose')
      ;(jwtVerifyMock as ReturnType<typeof mock>).mockImplementation(() =>
        Promise.resolve({
          payload: {
            sub: 'user-789',
            email: 'regular@test.com',
            groups: [],
          },
        }),
      )

      await expect(publishContent('page-456')).rejects.toThrow('Admin access required')
    })
  })

  // ---------------------------------------------------------------------------
  // archiveContent
  // ---------------------------------------------------------------------------

  describe('archiveContent', () => {
    test('logs archive audit event', async () => {
      await archiveContent('page-789')

      expect(mockLogAuditEvent).toHaveBeenCalledWith(
        'unpublish',
        'generated_content',
        expect.objectContaining({
          resourceId: 'page-789',
          details: { action: 'archive' },
        }),
      )
    })

    test('throws when DB not available', async () => {
      mockEvent.context.cloudflare.env.DB = undefined as unknown as D1Database

      await expect(archiveContent('page-789')).rejects.toThrow('Database not available')
    })

    test('throws when not authenticated', async () => {
      mockEvent.node.req.headers['cf-access-jwt-assertion'] = ''
      mockEvent.node.req.headers.authorization = ''

      await expect(archiveContent('page-789')).rejects.toThrow('Authentication required')
    })
  })

  // ---------------------------------------------------------------------------
  // getContentPagesByStatus
  // ---------------------------------------------------------------------------

  describe('getContentPagesByStatus', () => {
    test('returns empty array when no DB', async () => {
      mockEvent.context.cloudflare.env.DB = undefined as unknown as D1Database

      const pages = await getContentPagesByStatus('draft')
      expect(pages).toEqual([])
    })

    test('returns mapped content pages', async () => {
      mockDbAll.mockImplementation(() =>
        Promise.resolve({
          results: [
            {
              id: 'p1',
              slug: 'test-product',
              title: 'Test Product Review',
              content_html: '<h1>Test</h1>',
              meta_description: 'A test review',
              keywords: '["test","product"]',
              content_type: 'hub',
              ai_model: 'gemini-2.0-flash',
              is_published: 1,
              views: 42,
              created_at: 1700000000,
              updated_at: 1700001000,
            },
            {
              id: 'p2',
              slug: 'another-product',
              title: 'Another Product',
              content_html: '<h1>Another</h1>',
              meta_description: null,
              keywords: null,
              content_type: 'guide',
              ai_model: null,
              is_published: 0,
              views: 0,
              created_at: 1700002000,
              updated_at: 1700002000,
            },
          ],
        }),
      )

      const pages = await getContentPagesByStatus('published')

      expect(pages).toHaveLength(2)

      // First page
      expect(pages[0].id).toBe('p1')
      expect(pages[0].slug).toBe('test-product')
      expect(pages[0].is_published).toBe(true) // number 1 → boolean true
      expect(pages[0].keywords).toEqual(['test', 'product']) // JSON.parse
      expect(pages[0].views).toBe(42)

      // Second page
      expect(pages[1].id).toBe('p2')
      expect(pages[1].is_published).toBe(false) // number 0 → boolean false
      expect(pages[1].keywords).toBeUndefined() // null → undefined
      expect(pages[1].meta_description).toBeNull() // DB null preserved in mapping
    })

    test('handles empty results', async () => {
      mockDbAll.mockImplementation(() => Promise.resolve({ results: [] }))

      const pages = await getContentPagesByStatus('draft')
      expect(pages).toEqual([])
    })

    test('handles missing results field', async () => {
      mockDbAll.mockImplementation(() => Promise.resolve({}))

      const pages = await getContentPagesByStatus('draft')
      expect(pages).toEqual([])
    })

    test('uses default limit and offset', async () => {
      await getContentPagesByStatus('published')
      // Should call prepare with a query
      expect(mockDb.prepare).toHaveBeenCalled()
    })
  })
})

// =============================================================================
// generateSlug (tested indirectly via generatePageContent)
// =============================================================================

describe('generateSlug (via generatePageContent)', () => {
  test('converts title to URL-safe slug', async () => {
    mockGeneratorGenerate.mockImplementation(() =>
      Promise.resolve({
        title: 'Best Product for You!',
        content: '<p>test</p>',
        metaDescription: 'desc',
        seoKeywords: [],
        model: 'gemini',
      }),
    )

    const page = await generatePageContent('wf', {
      name: 'test',
      templateType: 'hub',
    })

    expect(page.slug).toBe('best-product-for-you')
  })

  test('truncates slug to 60 characters', async () => {
    const longTitle = `${'A'.repeat(100)} very long title that should be truncated at sixty chars`
    mockGeneratorGenerate.mockImplementation(() =>
      Promise.resolve({
        title: longTitle,
        content: '<p>test</p>',
        metaDescription: 'desc',
        seoKeywords: [],
        model: 'gemini',
      }),
    )

    const page = await generatePageContent('wf', {
      name: 'test',
      templateType: 'hub',
    })

    expect(page.slug.length).toBeLessThanOrEqual(60)
  })
})
