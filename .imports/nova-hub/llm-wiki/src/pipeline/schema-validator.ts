/**
 * Schema Validator Module
 *
 * Loads and compiles the LLM-Wiki schema once (singleton pattern),
 * providing validation functions for frontmatter data.
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../../_archive/spec/llm-wiki.schema.json' with { type: 'json' };

// Singleton validator instance
let ajv: Ajv | null = null;
let validateFn: Ajv.ValidateFunction | null = null;
let lastErrors: Ajv.ErrorObject[] = [];

/**
 * Initialize the AJV validator (lazy singleton)
 */
function initializeValidator(): void {
  if (ajv === null) {
    ajv = new Ajv({
      strict: false, // Allow unknown keywords
      allErrors: true,
    });
    // Add format validation for uri, date, date-time, etc.
    addFormats(ajv);
    validateFn = ajv.compile(schema);
  }
}

/**
 * Validate frontmatter data against the LLM-Wiki schema
 *
 * @param data - Unknown data to validate
 * @returns true if valid, false otherwise
 */
export function validateFrontmatter(data: unknown): boolean {
  initializeValidator();

  if (!validateFn) {
    throw new Error('Schema validator not initialized');
  }

  const valid = validateFn(data) as boolean;

  if (!valid && validateFn.errors) {
    lastErrors = validateFn.errors;
  } else {
    lastErrors = [];
  }

  return valid;
}

/**
 * Get validation errors from the last validation call
 *
 * @returns Array of AJV error objects
 */
export function getValidationErrors(): Ajv.ErrorObject[] {
  return [...lastErrors];
}

/**
 * Get the schema $id for version tracking
 *
 * @returns Schema identifier string
 */
export function getSchemaId(): string {
  return (schema as { $id?: string }).$id || 'unknown';
}
