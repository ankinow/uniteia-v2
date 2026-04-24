/**
 * Frontmatter Parser Tests
 *
 * Comprehensive tests for YAML frontmatter extraction and parsing:
 * - Valid frontmatter extracted correctly
 * - No frontmatter returns null
 * - Malformed YAML throws descriptive error
 * - Body content preserved after frontmatter
 * - Integration with schema validator
 */

import { describe, test, expect } from 'bun:test';
import { join } from 'path';
import {
  parseFrontmatter,
  parseFrontmatterFromFile,
  YAMLParseError,
} from './frontmatter-parser';
import {
  validateFrontmatter,
  getValidationErrors,
} from './schema-validator';

describe('Frontmatter Parser', () => {
  describe('Valid frontmatter extraction', () => {
    test('extracts simple YAML frontmatter', () => {
      const content = `---
title: Test Entry
type: ferramenta
---
Body content here`;

      const result = parseFrontmatter(content);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({
        title: 'Test Entry',
        type: 'ferramenta',
      });
      expect(result!.body).toBe('Body content here');
    });

    test('extracts complex nested frontmatter', () => {
      const content = `---
spec: llm-wiki/1.0.0
title: Complex Entry
type: plataforma
value_proposition: A complex platform
what_it_offers:
  - Feature one
  - Feature two
  - Feature three
sources:
  - url: https://example.com
    kind: primary
    accessed_at: "2025-01-01"
---
Content starts here`;

      const result = parseFrontmatter(content);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({
        spec: 'llm-wiki/1.0.0',
        title: 'Complex Entry',
        type: 'plataforma',
        value_proposition: 'A complex platform',
        what_it_offers: ['Feature one', 'Feature two', 'Feature three'],
        sources: [
          {
            url: 'https://example.com',
            kind: 'primary',
            accessed_at: '2025-01-01',
          },
        ],
      });
    });

    test('handles frontmatter with various types', () => {
      const content = `---
string: value
number: 42
float: 3.14
boolean: true
list:
  - item1
  - item2
nested:
  key: value
---
Body`;

      const result = parseFrontmatter(content);
      expect(result).not.toBeNull();
      const data = result!.data as Record<string, unknown>;
      expect(data.string).toBe('value');
      expect(data.number).toBe(42);
      expect(data.float).toBe(3.14);
      expect(data.boolean).toBe(true);
      expect(data.list).toEqual(['item1', 'item2']);
      expect(data.nested).toEqual({ key: 'value' });
    });
  });

  describe('No frontmatter handling', () => {
    test('returns null for plain markdown', () => {
      const content = `# Title

Just regular markdown content without frontmatter.`;

      const result = parseFrontmatter(content);
      expect(result).toBeNull();
    });

    test('returns null when delimiter not at start', () => {
      const content = `Some text before

---
title: Not Frontmatter
---

This should be ignored.`;

      const result = parseFrontmatter(content);
      expect(result).toBeNull();
    });

    test('returns null for file starting with text', () => {
      const content = `Text at start
---
title: Still not frontmatter
---`;

      const result = parseFrontmatter(content);
      expect(result).toBeNull();
    });
  });

  describe('Empty frontmatter handling', () => {
    test('handles empty frontmatter between delimiters', () => {
      const content = `---
---
Body content`;

      const result = parseFrontmatter(content);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({});
      expect(result!.body).toBe('Body content');
    });

    test('handles whitespace-only frontmatter', () => {
      const content = `---
   
---
Body after whitespace`;

      const result = parseFrontmatter(content);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({});
      expect(result!.body).toBe('Body after whitespace');
    });
  });

  describe('Malformed YAML errors', () => {
    test('throws YAMLParseError for malformed YAML', () => {
      const content = `---
title: Valid
broken: [unclosed
---
Body`;

      expect(() => parseFrontmatter(content)).toThrow(YAMLParseError);
    });

    test('error includes line number when available', () => {
      const content = `---
title: Valid
broken:
  - item1
  - broken: [unclosed
---
Body`;

      try {
        parseFrontmatter(content);
        expect(true).toBe(false); // Should not reach here
      } catch (err) {
        expect(err).toBeInstanceOf(YAMLParseError);
        const yamlErr = err as YAMLParseError;
        expect(yamlErr.line).toBeDefined();
        expect(yamlErr.line).toBeGreaterThan(0);
      }
    });

    test('error message is descriptive', () => {
      const content = `---
invalid: yaml: colon: extra
---
Body`;

      try {
        parseFrontmatter(content);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(YAMLParseError);
        const yamlErr = err as YAMLParseError;
        expect(yamlErr.message).toContain('Failed to parse YAML frontmatter');
      }
    });

    test('error includes context for debugging', () => {
      const content = `---
title: Test
broken: [unclosed
---
Body`;

      try {
        parseFrontmatter(content);
        expect(true).toBe(false);
      } catch (err) {
        const yamlErr = err as YAMLParseError;
        expect(yamlErr.context).toBeDefined();
        expect(yamlErr.context).toContain('title');
      }
    });
  });

  describe('Body content preservation', () => {
    test('preserves body content exactly', () => {
      const body = `# Heading

Paragraph with **bold** and *italic*.

- List item 1
- List item 2

\`\`\`js
console.log('code block');
\`\`\``;

      const content = `---
title: Test
---
${body}`;

      const result = parseFrontmatter(content);
      expect(result!.body).toBe(body);
    });

    test('trims leading whitespace from body', () => {
      const content = `---
title: Test
---

   Body with leading spaces`;

      const result = parseFrontmatter(content);
      expect(result!.body).toBe('Body with leading spaces');
    });

    test('handles empty body', () => {
      const content = `---
title: Test
---`;

      const result = parseFrontmatter(content);
      expect(result!.body).toBe('');
    });

    test('handles body starting with code block', () => {
      const content = `---
title: Test
---
\`\`\`js
code();
\`\`\``;

      const result = parseFrontmatter(content);
      expect(result!.body).toContain('```js');
    });
  });

  describe('File parsing', () => {
    test('parses valid fixture file', async () => {
      const path = join(import.meta.dir, 'fixtures', 'valid-entry.md');
      const result = await parseFrontmatterFromFile(path);

      expect(result).not.toBeNull();
      expect(result!.data).toHaveProperty('title');
      expect(result!.data).toHaveProperty('spec');
      expect(result!.body).toContain('# Cursor AI');
    });

    test('returns null for file without frontmatter', async () => {
      // Create a temp file without frontmatter
      const path = join(import.meta.dir, 'fixtures', 'no-frontmatter.md');
      await Bun.write(path, '# Just Markdown\n\nNo frontmatter here.');

      const result = await parseFrontmatterFromFile(path);
      expect(result).toBeNull();

      // Cleanup
      await Bun.write(path, ''); // Clear the file
    });
  });

  describe('Integration with schema validator', () => {
    test('valid fixture passes schema validation', async () => {
      const path = join(import.meta.dir, 'fixtures', 'valid-entry.md');
      const result = await parseFrontmatterFromFile(path);

      expect(result).not.toBeNull();
      const isValid = validateFrontmatter(result!.data);
      expect(isValid).toBe(true);
      expect(getValidationErrors()).toHaveLength(0);
    });

    test('invalid fixture fails schema validation', async () => {
      const path = join(import.meta.dir, 'fixtures', 'invalid-entry.md');
      const result = await parseFrontmatterFromFile(path);

      expect(result).not.toBeNull();
      const isValid = validateFrontmatter(result!.data);
      expect(isValid).toBe(false);

      const errors = getValidationErrors();
      expect(errors.length).toBeGreaterThan(0);

      // Should have error about missing 'type' field
      expect(errors.some(e => e.keyword === 'required')).toBe(true);
      expect(
        errors.some(
          e =>
            e.keyword === 'required' &&
            (e.params as { missingProperty?: string }).missingProperty === 'type'
        )
      ).toBe(true);
    });

    test('end-to-end: parse, validate, extract body', async () => {
      const path = join(import.meta.dir, 'fixtures', 'valid-entry.md');
      const result = await parseFrontmatterFromFile(path);

      // Step 1: Parsing succeeded
      expect(result).not.toBeNull();

      // Step 2: Validation passes
      const isValid = validateFrontmatter(result!.data);
      expect(isValid).toBe(true);

      // Step 3: Body content is correct
      expect(result!.body).toContain('# Cursor AI');
      expect(result!.body).toContain('Key Features');
    });
  });

  describe('Edge cases', () => {
    test('handles leading whitespace before delimiter', () => {
      const content = `   ---
title: Test
---
Body`;

      const result = parseFrontmatter(content);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({ title: 'Test' });
    });

    test('handles CRLF line endings', () => {
      const content = '---\r\ntitle: Test\r\n---\r\nBody';

      const result = parseFrontmatter(content);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({ title: 'Test' });
    });

    test('handles trailing whitespace on delimiter lines', () => {
      const content = `---   
title: Test   
---   
Body`;

      const result = parseFrontmatter(content);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({ title: 'Test' });
    });

    test('handles YAML with comments', () => {
      const content = `---
# This is a comment
title: Test
type: ferramenta # inline comment
---
Body`;

      const result = parseFrontmatter(content);
      expect(result).not.toBeNull();
      expect(result!.data).toEqual({
        title: 'Test',
        type: 'ferramenta',
      });
    });
  });
});
