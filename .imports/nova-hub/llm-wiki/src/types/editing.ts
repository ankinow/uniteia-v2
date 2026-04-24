/**
 * Editing Types
 *
 * Type definitions for Stage 3 (Editing) of the LLM-Wiki pipeline.
 * These types support clarity improvements, redundancy removal,
 * and fluency validation for wiki entries.
 */

import type { WikiEntry, ValidationError } from "./draft";

/**
 * Editing metadata
 *
 * Tracks editing session details and word count changes.
 */
export interface EditingMetadata {
  /** ISO 8601 timestamp when editing was performed */
  edited_at: string;
  /** Original word count before editing */
  original_word_count: number;
  /** Word count after editing */
  edited_word_count: number;
  /** List of edit operations applied */
  edits_applied: string[];
}

/**
 * Edited entry (Stage 3 output)
 *
 * Extends WikiEntry with editing metadata.
 * Must remain assignable to WikiEntry for pipeline flow compatibility.
 */
export interface EditedEntry extends WikiEntry {
  /** Editing session metadata */
  editing_metadata: EditingMetadata;
}

/**
 * Editing configuration
 *
 * Heuristics and thresholds for the editing stage.
 * Controls sentence length limits, redundancy detection,
 * and fluency requirements.
 */
export interface EditingConfig {
  /** Maximum allowed sentence length in words (default: 40) */
  max_sentence_length: number;
  /** Similarity threshold for redundancy detection (0-1, default: 0.3) */
  redundancy_threshold: number;
  /** Minimum fluency score required (0-1, default: 0.7) */
  min_fluency_score: number;
}

/**
 * Editing validation result
 *
 * Result of validating an edited entry against quality gates.
 * Tracks redundancy, fluency, and information preservation.
 */
export interface EditingValidationResult {
  /** Whether all validation checks passed */
  passed: boolean;
  /** Calculated redundancy score (0-1, lower is better) */
  redundancy_score: number;
  /** Calculated fluency score (0-1, higher is better) */
  fluency_score: number;
  /** Whether all key information was preserved */
  information_preserved: boolean;
  /** Validation errors (if any) */
  errors: ValidationError[];
}

/**
 * Default editing configuration
 *
 * Sensible defaults for editing heuristics based on
 * clarity and conciseness best practices.
 */
export const DEFAULT_EDITING_CONFIG: EditingConfig = {
  max_sentence_length: 40,
  redundancy_threshold: 0.3,
  min_fluency_score: 0.7,
};

/**
 * Type guard for EditingMetadata
 */
export function isEditingMetadata(value: unknown): value is EditingMetadata {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.edited_at === "string" &&
    typeof obj.original_word_count === "number" &&
    typeof obj.edited_word_count === "number" &&
    Array.isArray(obj.edits_applied) &&
    obj.edits_applied.every((item) => typeof item === "string")
  );
}

/**
 * Type guard for EditedEntry
 *
 * Validates that the value is a WikiEntry with editing_metadata.
 */
export function isEditedEntry(value: unknown): value is EditedEntry {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  
  // Must have editing_metadata
  if (!isEditingMetadata(obj.editing_metadata)) {
    return false;
  }
  
  // Must be a valid WikiEntry (core fields)
  // Import and use WikiEntry validation logic inline to avoid circular dependencies
  return (
    typeof obj.spec === "string" &&
    typeof obj.title === "string" &&
    typeof obj.type === "string" &&
    typeof obj.value_proposition === "string" &&
    Array.isArray(obj.what_it_offers) &&
    obj.what_it_offers.every((item) => typeof item === "string") &&
    Array.isArray(obj.problems_solved) &&
    obj.problems_solved.every((item) => typeof item === "string") &&
    typeof obj.target_audience === "string" &&
    typeof obj.when_it_matters === "string" &&
    typeof obj.when_less_matters === "string" &&
    typeof obj.short_formula === "string" &&
    Array.isArray(obj.sources) &&
    obj.sources.length > 0
  );
}

/**
 * Type guard for EditingConfig
 */
export function isEditingConfig(value: unknown): value is EditingConfig {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.max_sentence_length === "number" &&
    typeof obj.redundancy_threshold === "number" &&
    typeof obj.min_fluency_score === "number" &&
    obj.max_sentence_length > 0 &&
    obj.redundancy_threshold >= 0 &&
    obj.redundancy_threshold <= 1 &&
    obj.min_fluency_score >= 0 &&
    obj.min_fluency_score <= 1
  );
}

/**
 * Type guard for EditingValidationResult
 */
export function isEditingValidationResult(
  value: unknown
): value is EditingValidationResult {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.passed === "boolean" &&
    typeof obj.redundancy_score === "number" &&
    typeof obj.fluency_score === "number" &&
    typeof obj.information_preserved === "boolean" &&
    Array.isArray(obj.errors) &&
    obj.errors.every(
      (e) =>
        typeof e === "object" &&
        e !== null &&
        typeof (e as Record<string, unknown>).field === "string" &&
        typeof (e as Record<string, unknown>).rule === "string" &&
        typeof (e as Record<string, unknown>).message === "string"
    )
  );
}
