import { rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ContentLoaderError } from '~/types/content'
import { loadContent } from '~/utils/content-loader'

/**
 * Unit tests for loadContent() — the extracted content pipeline utility.
 *
 * These tests exercise loadContent() directly without Qwik's routeLoader$,
 * proving the utility is reusable and testable in isolation.
 */

/** Temporary directory for schema-invalid fixtures */
const TEMP_DIR = resolve(import.meta.dirname, '..', '..', 'llm-wiki', 'en')

describe('loadContent', () => {
  /**
   * Test 1: loadContent('test-article', 'en') resolves with valid LlmWikiContent
   */
  it('loads a valid English article and returns typed LlmWikiContent', async () => {
    const result = await loadContent('test-article', 'en')

    expect(result).toBeDefined()
    expect(result.slug).toBe('test-article')
    expect(result.lang).toBe('en')
    expect(result.title).toBe('Test Article for Integration Verification')
    expect(result.content).toBeTypeOf('string')
    expect(result.content.length).toBeGreaterThanOrEqual(100)
    expect(result.subjects).toBeInstanceOf(Array)
    expect(result.subjects.length).toBeGreaterThanOrEqual(1)
    expect(result.referral_links).toBeInstanceOf(Array)
    expect(result.verdict).toBe('trusted')
    expect(result.quality_score).toBe(92)
  })

  /**
   * Test 2: loadContent('test-article', 'es') resolves (proves es fixture works)
   */
  it('loads a valid Spanish article and returns typed LlmWikiContent', async () => {
    const result = await loadContent('test-article', 'es')

    expect(result).toBeDefined()
    expect(result.slug).toBe('test-article')
    expect(result.lang).toBe('es')
    expect(result.title).toBe('Artículo de Prueba para Verificación de Integración')
    expect(result.content.length).toBeGreaterThanOrEqual(100)
    expect(result.subjects).toContain('pruebas')
  })

  /**
   * Test 3: loadContent('nonexistent-article', 'en') rejects with ContentLoaderError phase='read'
   */
  it('throws ContentLoaderError with phase "read" for a missing article', async () => {
    await expect(loadContent('nonexistent-article', 'en')).rejects.toThrow(ContentLoaderError)

    try {
      await loadContent('nonexistent-article', 'en')
    } catch (err) {
      expect(err).toBeInstanceOf(ContentLoaderError)
      const cle = err as ContentLoaderError
      expect(cle.phase).toBe('read')
      expect(cle.slug).toBe('nonexistent-article')
      expect(cle.lang).toBe('en')
      expect(cle.errors).toBeInstanceOf(Array)
      expect(cle.errors.length).toBeGreaterThanOrEqual(1)
    }
  })

  /**
   * Test 4: Invalid frontmatter (missing required fields) triggers phase='schema'
   *
   * Creates a temp .md file with incomplete frontmatter, then cleans up.
   */
  describe('schema validation failure', () => {
    const tempSlug = 'temp-invalid-schema'
    const tempFilePath = resolve(TEMP_DIR, `${tempSlug}.md`)

    beforeEach(async () => {
      // Create a minimal .md file that is parseable but fails schema validation
      // Missing required fields: slug, lang, title, subjects, referral_links
      const content = `---
content: "This is some content that is long enough to pass the 100 char minimum requirement for the content field but the rest of the required fields are missing entirely from this frontmatter."
---
Some body text here.`
      await writeFile(tempFilePath, content, 'utf-8')
    })

    afterEach(async () => {
      try {
        await rm(tempFilePath)
      } catch {
        // File may already be removed
      }
    })

    it('throws ContentLoaderError with phase "schema" for invalid frontmatter', async () => {
      await expect(loadContent(tempSlug, 'en')).rejects.toThrow(ContentLoaderError)

      try {
        await loadContent(tempSlug, 'en')
      } catch (err) {
        expect(err).toBeInstanceOf(ContentLoaderError)
        const cle = err as ContentLoaderError
        expect(cle.phase).toBe('schema')
        expect(cle.slug).toBe(tempSlug)
        expect(cle.errors).toBeInstanceOf(Array)
        expect(cle.errors.length).toBeGreaterThanOrEqual(1)
      }
    })
  })

  /**
   * Test 5: Slug containing banned terms triggers phase='slug'
   *
   * "test-admin" contains the banned term "admin" and matches the slug pattern,
   * so it will pass read/parse/schema but fail at the slug phase.
   */
  it('throws ContentLoaderError with phase "slug" for a slug with banned terms', async () => {
    // "test-admin" contains banned term "admin"
    // This slug won't have a file, so it would fail at 'read' first.
    // We need to test slug validation directly — but loadContent runs slug
    // validation AFTER schema validation. Since the file won't exist, we'd
    // get a 'read' error. To test 'slug' phase, we'd need a file that passes
    // read+parse+schema but has a banned slug in its frontmatter.
    // However, the slug validation is on the *parameter* slug, not frontmatter.
    // Since "test-admin" doesn't exist as a file, the 'read' phase fails first.
    //
    // Strategy: create a temp file with slug "test-admin" in frontmatter,
    // which will pass read, parse, and schema (if valid), then fail at slug
    // validation because the parameter slug "test-admin" contains "admin".
    const tempSlug = 'test-admin'
    const tempFilePath = resolve(TEMP_DIR, `${tempSlug}.md`)

    try {
      const content = `---
slug: test-admin
lang: en
title: Admin Test Article
verdict: trusted
quality_score: 85
subjects:
  - testing
referral_links: []
metadata:
  created_at: "2025-01-15T10:00:00Z"
  updated_at: "2025-01-20T14:30:00Z"
  author: Test
  version: 1
---
This is a test article with a banned slug term in the parameter. The content must exceed one hundred characters to pass schema validation of the content field. This paragraph ensures we meet that requirement comfortably.`
      await writeFile(tempFilePath, content, 'utf-8')

      await expect(loadContent(tempSlug, 'en')).rejects.toThrow(ContentLoaderError)

      try {
        await loadContent(tempSlug, 'en')
      } catch (err) {
        expect(err).toBeInstanceOf(ContentLoaderError)
        const cle = err as ContentLoaderError
        expect(cle.phase).toBe('slug')
        expect(cle.slug).toBe(tempSlug)
        expect(cle.errors).toBeInstanceOf(Array)
        expect(cle.errors.length).toBeGreaterThanOrEqual(1)
        expect(cle.errors[0]).toContain('banned')
      }
    } finally {
      try {
        await rm(tempFilePath)
      } catch {
        // cleanup
      }
    }
  })
})
