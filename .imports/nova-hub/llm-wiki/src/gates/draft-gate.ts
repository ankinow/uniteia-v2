/**
 * Draft Quality Gate
 *
 * Validates draft structure and minimum field density requirements.
 * This gate ensures that generated wiki entries meet the quality bar
 * before being committed to the wiki.
 *
 * Checks:
 * 1. Missing required fields
 * 2. Schema validation (all required fields present, correct types)
 * 3. Field density (minimum items in what_it_offers, problems_solved, sources)
 * 4. Content quality (non-empty, meaningful content)
 */
import type { WikiEntry, DraftConfig, FieldCounts, ValidationError } from "../types/draft";
import { DEFAULT_DRAFT_CONFIG, checkFieldDensity, isWikiEntry } from "../types/draft";
import { validateFrontmatter, getValidationErrors } from "../pipeline/schema-validator";

/**
 * Gate result after validation
 */
export interface DraftGateResult {
  /** Whether the draft passes all quality checks */
  pass: boolean;
  /** Schema validation passed */
  schemaValid: boolean;
  /** Field density requirements met */
  densityMet: boolean;
  /** Field counts for density checking */
  fieldCounts: FieldCounts;
  /** Missing required fields (if any) */
  missingFields: string[];
  /** Validation errors (if any) */
  errors: ValidationError[];
  /** Timestamp of gate check */
  timestamp: string;
  /** Gate check duration in milliseconds */
  durationMs: number;
}

/**
 * Validate draft against quality gate
 *
 * Performs comprehensive validation of a draft wiki entry:
 * 1. Missing required fields check
 * 2. Schema validation against LLM-Wiki schema
 * 3. Field density requirements (min items in arrays)
 * 4. Content quality checks (non-empty meaningful fields)
 *
 * @param draft - Draft wiki entry to validate
 * @param config - Draft configuration with minimum requirements
 * @returns Gate result with pass/fail and detailed metrics
 */
export function validateDraftGate(
  draft: unknown,
  config: DraftConfig = DEFAULT_DRAFT_CONFIG
): DraftGateResult {
  const startTime = Date.now();

  // Initialize result structure
  const result: DraftGateResult = {
    pass: false,
    schemaValid: false,
    densityMet: false,
    fieldCounts: { what_it_offers: 0, problems_solved: 0, sources: 0 },
    missingFields: [],
    errors: [],
    timestamp: new Date().toISOString(),
    durationMs: 0,
  };

  // Must be an object first
  if (typeof draft !== "object" || draft === null) {
    result.errors.push({
      field: "draft",
      rule: "type_check",
      message: "Draft is not an object",
      value: typeof draft,
    });
    result.durationMs = Date.now() - startTime;
    logGateResult(result);
    return result;
  }

  const obj = draft as Record<string, unknown>;

  // 1. Check for missing required fields BEFORE type guard
  // This allows us to provide specific error messages
  const requiredFields = [
    "spec",
    "title",
    "type",
    "value_proposition",
    "what_it_offers",
    "problems_solved",
    "target_audience",
    "when_it_matters",
    "when_less_matters",
    "short_formula",
    "sources",
  ];

  for (const field of requiredFields) {
    if (obj[field] === undefined || obj[field] === null) {
      result.missingFields.push(field);
      result.errors.push({
        field,
        rule: "required",
        message: `Missing required field: ${field}`,
        value: obj[field],
      });
    }
  }

  // If missing fields, fail early
  if (result.missingFields.length > 0) {
    result.durationMs = Date.now() - startTime;
    logGateResult(result);
    return result;
  }

  // Now check if it's a valid WikiEntry (field types)
  if (!isWikiEntry(draft)) {
    result.errors.push({
      field: "draft",
      rule: "type_check",
      message: "Draft has invalid field types",
      value: typeof draft,
    });
    result.durationMs = Date.now() - startTime;
    logGateResult(result);
    return result;
  }

  const entry = draft as WikiEntry;

  // 2. Schema validation
  if (config.validateSchema) {
    const schemaValid = validateFrontmatter(entry);
    result.schemaValid = schemaValid;
    if (!schemaValid) {
      const schemaErrors = getValidationErrors();
      for (const err of schemaErrors) {
        result.errors.push({
          field: err.instancePath || "unknown",
          rule: err.keyword || "validation",
          message: err.message || "Schema validation error",
          value: err.data,
        });
      }
    }
  } else {
    result.schemaValid = true; // Skip validation
  }

  // 3. Field density check
  if (config.enforceDensity) {
    const densityResult = checkFieldDensity(entry, config);
    result.densityMet = densityResult.met;
    result.fieldCounts = densityResult.counts;
    if (!densityResult.met) {
      result.errors.push(...densityResult.errors);
    }
  } else {
    // Just count fields without enforcing minimums
    result.fieldCounts = {
      what_it_offers: entry.what_it_offers.length,
      problems_solved: entry.problems_solved.length,
      sources: entry.sources.length,
    };
    result.densityMet = true; // Skip enforcement
  }

  // 4. Content quality checks (non-empty meaningful content)
  const contentErrors = checkContentQuality(entry);
  result.errors.push(...contentErrors);

  // Determine overall pass/fail
  result.pass = result.schemaValid && result.densityMet && result.errors.length === 0 && result.missingFields.length === 0;

  result.durationMs = Date.now() - startTime;

  // Log gate result
  logGateResult(result);

  return result;
}

/**
 * Check content quality
 *
 * Validates that fields have meaningful content, not just placeholder text.
 *
 * @param entry - Wiki entry to check
 * @returns Array of validation errors (if any)
 */
function checkContentQuality(entry: WikiEntry): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for placeholder content
  const placeholderPatterns = [
    /^TBD$/i,
    /^TODO$/i,
    /^FIXME$/i,
    /^placeholder$/i,
    /^unknown$/i,
    /^n\/a$/i,
    /^\s*$/, // Empty or whitespace only
  ];

  // Check value_proposition
  if (placeholderPatterns.some((p) => p.test(entry.value_proposition))) {
    errors.push({
      field: "value_proposition",
      rule: "content_quality",
      message: "Value proposition appears to be placeholder content",
      value: entry.value_proposition,
    });
  }

  // Check target_audience
  if (placeholderPatterns.some((p) => p.test(entry.target_audience))) {
    errors.push({
      field: "target_audience",
      rule: "content_quality",
      message: "Target audience appears to be placeholder content",
      value: entry.target_audience,
    });
  }

  // Check that what_it_offers items are meaningful
  for (let i = 0; i < entry.what_it_offers.length; i++) {
    const item = entry.what_it_offers[i];
    if (placeholderPatterns.some((p) => p.test(item))) {
      errors.push({
        field: `what_it_offers[${i}]`,
        rule: "content_quality",
        message: "What it offers item appears to be placeholder content",
        value: item,
      });
    }
  }

  // Check that problems_solved items are meaningful
  for (let i = 0; i < entry.problems_solved.length; i++) {
    const item = entry.problems_solved[i];
    if (placeholderPatterns.some((p) => p.test(item))) {
      errors.push({
        field: `problems_solved[${i}]`,
        rule: "content_quality",
        message: "Problems solved item appears to be placeholder content",
        value: item,
      });
    }
  }

  return errors;
}

/**
 * Log gate result to stderr
 *
 * Outputs structured JSON log for observability and debugging.
 *
 * @param result - Gate result to log
 */
function logGateResult(result: DraftGateResult): void {
  console.error(
    JSON.stringify({
      level: result.pass ? "info" : "warn",
      timestamp: result.timestamp,
      message: result.pass ? "Draft gate passed" : "Draft gate failed",
      gate: "draft",
      pass: result.pass,
      schema_valid: result.schemaValid,
      density_met: result.densityMet,
      field_counts: result.fieldCounts,
      missing_fields: result.missingFields,
      error_count: result.errors.length,
      duration_ms: result.durationMs,
    })
  );
}

/**
 * Export types for consumers
 */
export type { DraftGateResult as DraftGateResultType };
