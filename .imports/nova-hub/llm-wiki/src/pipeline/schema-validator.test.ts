/**
 * Schema Validator Tests
 *
 * Comprehensive tests for schema validation covering:
 * - Valid frontmatter passes
 * - Missing required field fails
 * - Wrong type fails
 * - minItems constraint violated fails
 * - Schema compilation succeeds
 */

import { describe, test, expect, beforeEach } from 'bun:test';
import {
  validateFrontmatter,
  getValidationErrors,
  getSchemaId,
} from './schema-validator';

describe('Schema Validator', () => {
  // Valid frontmatter example based on schema requirements
  const validFrontmatter = {
    spec: 'llm-wiki/1.0.0',
    title: 'Test Platform',
    type: 'plataforma' as const,
    value_proposition:
      'A comprehensive platform for structured content generation',
    what_it_offers: [
      'Automated content generation pipeline',
      'Schema validation engine',
      'Multi-format output support',
    ],
    problems_solved: [
      'Manual content creation is time-consuming and error-prone',
      'Inconsistent content structure across entries and authors',
    ],
    target_audience:
      'Content teams and technical writers who need structured documentation',
    when_it_matters:
      'When building knowledge bases that need consistent structure and validation',
    when_less_matters:
      'When creating simple one-off documents without structural requirements',
    short_formula:
      'Schema + Pipeline + Validation = Structured Content at Scale',
    sources: [
      {
        url: 'https://example.com/docs',
        kind: 'official' as const,
        accessed_at: '2025-01-15',
      },
    ],
  };

  beforeEach(() => {
    // Reset errors before each test
    getValidationErrors();
  });

  describe('Schema compilation', () => {
    test('schema compiles successfully', () => {
      // If schema compilation failed, getSchemaId would throw
      const schemaId = getSchemaId();
      expect(schemaId).toBe('llm-wiki/1.0.0');
    });

    test('getSchemaId returns valid version string', () => {
      const id = getSchemaId();
      expect(id).toMatch(/^llm-wiki\/\d+\.\d+\.\d+$/);
    });
  });

  describe('Valid frontmatter', () => {
    test('valid frontmatter passes validation', () => {
      const result = validateFrontmatter(validFrontmatter);
      expect(result).toBe(true);
      expect(getValidationErrors()).toHaveLength(0);
    });

    test('valid frontmatter with optional fields passes', () => {
      const withOptional = {
        ...validFrontmatter,
        pricing: {
          model: 'subscription' as const,
          starting_price: '$49/mo',
          has_free_tier: true,
        },
        alternatives: ['Alternative A', 'Alternative B'],
        integrations: ['Integration X', 'Integration Y'],
      };
      const result = validateFrontmatter(withOptional);
      expect(result).toBe(true);
      expect(getValidationErrors()).toHaveLength(0);
    });

    test('valid frontmatter with minimal required fields passes', () => {
      const minimal = {
        spec: 'llm-wiki/1.0.0',
        title: 'Minimal Entry',
        type: 'ferramenta' as const,
        value_proposition: 'Simple tool with minimal setup',
        what_it_offers: ['Feature 1', 'Feature 2', 'Feature 3'],
        problems_solved: [
          'Problem A that needs at least 10 chars',
          'Problem B that needs at least 10 chars',
        ],
        target_audience: 'Developers who need simple tools',
        when_it_matters: 'When simplicity is prioritized',
        when_less_matters: 'When complex features are needed',
        short_formula: 'Minimal + Simple = Effective',
        sources: [
          {
            url: 'https://example.com',
            kind: 'primary' as const,
            accessed_at: '2025-01-01',
          },
        ],
      };
      const result = validateFrontmatter(minimal);
      expect(result).toBe(true);
    });
  });

  describe('Missing required field failures', () => {
    test('missing title fails validation', () => {
      const { title, ...withoutTitle } = validFrontmatter;
      const result = validateFrontmatter(withoutTitle);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.keyword === 'required')).toBe(true);
      expect(
        errors.some((e) => (e.params as { missingProperty?: string }).missingProperty === 'title')
      ).toBe(true);
    });

    test('missing spec fails validation', () => {
      const { spec, ...withoutSpec } = validFrontmatter;
      const result = validateFrontmatter(withoutSpec);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'required')).toBe(true);
    });

    test('missing type fails validation', () => {
      const { type, ...withoutType } = validFrontmatter;
      const result = validateFrontmatter(withoutType);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'required')).toBe(true);
    });

    test('missing sources fails validation', () => {
      const { sources, ...withoutSources } = validFrontmatter;
      const result = validateFrontmatter(withoutSources);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'required')).toBe(true);
    });

    test('missing source.url fails validation', () => {
      const withInvalidSource = {
        ...validFrontmatter,
        sources: [
          {
            kind: 'primary',
            accessed_at: '2025-01-01',
          },
        ],
      };
      const result = validateFrontmatter(withInvalidSource);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'required')).toBe(true);
    });
  });

  describe('Wrong type failures', () => {
    test('title as number fails validation', () => {
      const withNumberTitle = { ...validFrontmatter, title: 123 };
      const result = validateFrontmatter(withNumberTitle);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'type')).toBe(true);
    });

    test('type as invalid enum fails validation', () => {
      const withInvalidType = { ...validFrontmatter, type: 'invalid_type' };
      const result = validateFrontmatter(withInvalidType);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'enum')).toBe(true);
    });

    test('what_it_offers as string fails validation', () => {
      const withStringArray = { ...validFrontmatter, what_it_offers: 'not an array' };
      const result = validateFrontmatter(withStringArray);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'type')).toBe(true);
    });

    test('sources as object instead of array fails', () => {
      const withObjectSources = {
        ...validFrontmatter,
        sources: {
          url: 'https://example.com',
          kind: 'primary',
          accessed_at: '2025-01-01',
        },
      };
      const result = validateFrontmatter(withObjectSources);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'type')).toBe(true);
    });

    test('value_proposition as array fails', () => {
      const withArrayValue = {
        ...validFrontmatter,
        value_proposition: ['value 1', 'value 2'],
      };
      const result = validateFrontmatter(withArrayValue);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'type')).toBe(true);
    });
  });

  describe('minItems constraint failures', () => {
    test('what_it_offers with < 3 items fails validation', () => {
      const withTooFew = {
        ...validFrontmatter,
        what_it_offers: ['Only one item', 'Second item'],
      };
      const result = validateFrontmatter(withTooFew);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'minItems')).toBe(true);
      expect(
        errors.some(
          (e) =>
            e.instancePath === '/what_it_offers' && e.keyword === 'minItems'
        )
      ).toBe(true);
    });

    test('what_it_offers with empty array fails validation', () => {
      const withEmpty = { ...validFrontmatter, what_it_offers: [] };
      const result = validateFrontmatter(withEmpty);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'minItems')).toBe(true);
    });

    test('problems_solved with < 2 items fails validation', () => {
      const withOneProblem = {
        ...validFrontmatter,
        problems_solved: ['Only one problem'],
      };
      const result = validateFrontmatter(withOneProblem);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'minItems')).toBe(true);
    });

    test('sources with empty array fails validation', () => {
      const withNoSources = { ...validFrontmatter, sources: [] };
      const result = validateFrontmatter(withNoSources);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'minItems')).toBe(true);
    });

    test('alternatives with only 1 item fails (minItems: 2)', () => {
      const withOneAlternative = {
        ...validFrontmatter,
        alternatives: ['Only one alternative'],
      };
      const result = validateFrontmatter(withOneAlternative);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'minItems')).toBe(true);
    });
  });

  describe('String length constraints', () => {
    test('title exceeding maxLength fails', () => {
      const longTitle = 'x'.repeat(201);
      const withLongTitle = { ...validFrontmatter, title: longTitle };
      const result = validateFrontmatter(withLongTitle);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'maxLength')).toBe(true);
    });

    test('title with zero length fails (minLength: 1)', () => {
      const withEmptyTitle = { ...validFrontmatter, title: '' };
      const result = validateFrontmatter(withEmptyTitle);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'minLength')).toBe(true);
    });

    test('value_proposition too short fails (minLength: 10)', () => {
      const withShortValue = { ...validFrontmatter, value_proposition: 'too short' };
      const result = validateFrontmatter(withShortValue);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'minLength')).toBe(true);
    });

    test('what_it_offers item too short fails (minLength: 5)', () => {
      const withShortItem = {
        ...validFrontmatter,
        what_it_offers: ['Feature 1', 'Feature 2', 'shrt'],
      };
      const result = validateFrontmatter(withShortItem);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'minLength')).toBe(true);
    });
  });

  describe('Format validation', () => {
    test('invalid URL format in source fails', () => {
      const withInvalidUrl = {
        ...validFrontmatter,
        sources: [
          {
            url: 'not-a-url',
            kind: 'primary',
            accessed_at: '2025-01-01',
          },
        ],
      };
      const result = validateFrontmatter(withInvalidUrl);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'format')).toBe(true);
    });

    test('invalid date format in accessed_at fails', () => {
      const withInvalidDate = {
        ...validFrontmatter,
        sources: [
          {
            url: 'https://example.com',
            kind: 'primary',
            accessed_at: 'not-a-date',
          },
        ],
      };
      const result = validateFrontmatter(withInvalidDate);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'format')).toBe(true);
    });

    test('invalid spec pattern fails', () => {
      const withInvalidSpec = { ...validFrontmatter, spec: 'invalid-spec' };
      const result = validateFrontmatter(withInvalidSpec);
      expect(result).toBe(false);

      const errors = getValidationErrors();
      expect(errors.some((e) => e.keyword === 'pattern')).toBe(true);
    });
  });

  describe('Error structure', () => {
    test('errors include field path information', () => {
      const { title, ...invalid } = validFrontmatter;
      validateFrontmatter(invalid);

      const errors = getValidationErrors();
      expect(errors[0]).toHaveProperty('instancePath');
      expect(errors[0]).toHaveProperty('keyword');
      expect(errors[0]).toHaveProperty('message');
      expect(errors[0]).toHaveProperty('params');
    });

    test('errors reset between validations', () => {
      validateFrontmatter(validFrontmatter);
      expect(getValidationErrors()).toHaveLength(0);

      const { title, ...invalid } = validFrontmatter;
      validateFrontmatter(invalid);
      expect(getValidationErrors().length).toBeGreaterThan(0);

      validateFrontmatter(validFrontmatter);
      expect(getValidationErrors()).toHaveLength(0);
    });
  });
});
