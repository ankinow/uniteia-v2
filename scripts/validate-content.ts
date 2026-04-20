#!/usr/bin/env bun
/**
 * Build-time content validation script
 * Validates JSON content files against the llm-wiki-v1 JSON Schema
 * 
 * Usage:
 *   bun run scripts/validate-content.ts <content-file.json>
 *   bun run scripts/validate-content.ts src/content/**/*.json
 * 
 * Exit codes:
 *   0 - All content valid
 *   1 - Validation failed
 *   2 - No files found or invalid arguments
 */

import Ajv2020, { type DefinedError } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { readFileSync, globSync } from 'fs';
import { resolve, relative } from 'path';
import { validateSlug, findBannedSlugTerm } from '../src/utils/url-validation';

// Load schema
const SCHEMA_PATH = resolve(import.meta.dir, '../schemas/llm-wiki-v1.schema.json');
const ROOT_DIR = resolve(import.meta.dir, '..');

interface ValidationResult {
  file: string;
  valid: boolean;
  errors?: string[];
  slugWarnings?: string[];
}

function loadSchema(): unknown {
  try {
    const schemaContent = readFileSync(SCHEMA_PATH, 'utf-8');
    return JSON.parse(schemaContent);
  } catch (error) {
    console.error(`❌ Failed to load schema from ${SCHEMA_PATH}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(2);
  }
}

function validateContentFile(filePath: string, ajv: Ajv2020): ValidationResult {
  const result: ValidationResult = {
    file: relative(ROOT_DIR, filePath),
    valid: true,
    errors: [],
    slugWarnings: [],
  };

  let content: unknown;
  try {
    const fileContent = readFileSync(filePath, 'utf-8');
    content = JSON.parse(fileContent);
  } catch (error) {
    result.valid = false;
    result.errors = [`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`];
    return result;
  }

  // Validate against schema
  const valid = ajv.validate('https://uniteia.com/schemas/llm-wiki-v1.schema.json', content);
  
  if (!valid) {
    result.valid = false;
    result.errors = (ajv.errors as DefinedError[]).map((err) => {
      const path = err.instancePath || 'root';
      return `${path}: ${err.message}`;
    });
  }

  // Additional slug validation (beyond schema pattern)
  if (content && typeof content === 'object' && 'slug' in content && typeof content.slug === 'string') {
    const slugValidation = validateSlug(content.slug);
    if (!slugValidation.valid && slugValidation.error) {
      result.valid = false;
      result.errors?.push(slugValidation.error);
    }

    // Check for banned terms (warning, not error for schema validation)
    const bannedTerm = findBannedSlugTerm(content.slug);
    if (bannedTerm) {
      result.slugWarnings?.push(`Slug contains potentially problematic term "${bannedTerm}"`);
    }
  }

  return result;
}

function main(args: string[]): void {
  if (args.length === 0) {
    console.error('Usage: bun run scripts/validate-content.ts <content-file.json>...');
    console.error('   or: bun run scripts/validate-content.ts "src/content/**/*.json"');
    process.exit(2);
  }

  // Expand glob patterns
  const files = args.flatMap((arg) => {
    if (arg.includes('*')) {
      return globSync(arg, { cwd: ROOT_DIR });
    }
    return [resolve(ROOT_DIR, arg)];
  });

  if (files.length === 0) {
    console.error('❌ No files found matching the provided patterns');
    process.exit(2);
  }

  console.log(`📋 Validating ${files.length} content file(s) against llm-wiki-v1 schema...`);
  console.log('');

  // Initialize AJV with Draft 2020-12 support
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);

  // Load and compile schema
  const schema = loadSchema();
  ajv.addSchema(schema);

  const results: ValidationResult[] = files.map((file) => 
    validateContentFile(file, ajv)
  );

  // Report results
  let passCount = 0;
  let failCount = 0;
  let warningCount = 0;

  for (const result of results) {
    if (result.valid) {
      passCount++;
      if (result.slugWarnings && result.slugWarnings.length > 0) {
        warningCount++;
        console.log(`⚠️  ${result.file} - valid (with warnings)`);
        for (const warning of result.slugWarnings) {
          console.log(`   ${warning}`);
        }
      } else {
        console.log(`✅ ${result.file}`);
      }
    } else {
      failCount++;
      console.log(`❌ ${result.file}`);
      if (result.errors) {
        for (const error of result.errors) {
          console.log(`   ${error}`);
        }
      }
    }
  }

  console.log('');
  console.log(`📊 Results: ${passCount} passed, ${failCount} failed, ${warningCount} warnings`);

  if (failCount > 0) {
    console.log('');
    console.error('❌ Content validation failed');
    process.exit(1);
  }

  console.log('✅ All content validated successfully');
  process.exit(0);
}

main(process.argv.slice(2));
