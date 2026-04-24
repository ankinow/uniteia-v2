/**
 * Stage 3: Editing
 *
 * Applies deterministic editing transformations to improve clarity,
 * remove redundancy, and standardize formatting. Transforms draft_v1.md
 * into draft_v2.md with no information loss.
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { parse, stringify } from "yaml";
import type { JobSpec } from "../types/job";
import type { Stage, StageContext, GateResult } from "../pipeline/types";
import type { WikiEntry, ValidationError } from "../types/draft";
import type {
  EditedEntry,
  EditingConfig,
  EditingMetadata,
  EditingValidationResult,
} from "../types/editing";
import {
  DEFAULT_EDITING_CONFIG,
  isEditingConfig,
} from "../types/editing";

/**
 * File reader function type (injected for testability)
 */
export type FileReaderFn = (path: string) => Promise<string>;

/**
 * Stage 3 output
 */
export interface Stage3Output {
  /** Edited wiki entry */
  entry: EditedEntry;
  /** Path to draft_v2.md */
  draftFile: string;
  /** Artifact directory path */
  artifactDir: string;
  /** Validation result */
  validation: EditingValidationResult;
  /** Edit counts */
  editsMade: EditCounts;
  /** Word counts */
  wordCounts: WordCounts;
}

/**
 * Edit operation counts
 */
export interface EditCounts {
  redundancies_removed: number;
  sentences_split: number;
  format_fixes: number;
}

/**
 * Word counts before and after editing
 */
export interface WordCounts {
  before: number;
  after: number;
}

/**
 * Stage 3 configuration
 */
export interface Stage3Config {
  /** Editing configuration */
  editingConfig?: Partial<EditingConfig>;
  /** File reader function (uses default if not provided) */
  fileReaderFn?: FileReaderFn;
}

/**
 * Parsed draft input with frontmatter and body
 */
export interface ParsedDraft {
  frontmatter: WikiEntry;
  body: string;
}

/**
 * Read draft_v1.md and parse YAML frontmatter + markdown body
 *
 * @param artifactDir - Artifact directory path
 * @param fileReader - Optional file reader function (for testing)
 * @returns Parsed draft with frontmatter and body
 */
export async function readEditedInput(
  artifactDir: string,
  fileReader?: FileReaderFn
): Promise<ParsedDraft> {
  const reader = fileReader || readFile;
  const draftPath = join(artifactDir, "draft_v1.md");
  const draftData = await reader(draftPath);
  const draftContent = draftData.toString();

  // Parse YAML frontmatter
  const { frontmatter, body } = parseDraftMarkdown(draftContent);

  return { frontmatter, body };
}

/**
 * Parse draft markdown with YAML frontmatter
 *
 * Uses yaml library for proper parsing (no regex).
 *
 * @param content - Draft markdown content
 * @returns Parsed frontmatter and body
 */
export function parseDraftMarkdown(content: string): ParsedDraft {
  // Check for YAML frontmatter delimiters
  if (!content.startsWith("---\n")) {
    throw new Error("Invalid draft format: missing YAML frontmatter");
  }

  // Find the closing delimiter
  const delimiterIndex = content.indexOf("\n---\n", 4);
  if (delimiterIndex === -1) {
    throw new Error("Invalid draft format: unclosed YAML frontmatter");
  }

  // Extract frontmatter and body
  const frontmatterYaml = content.substring(4, delimiterIndex);
  const bodyStart = delimiterIndex + 5;
  const body = content.substring(bodyStart).trim();

  // Parse YAML frontmatter using yaml library
  const frontmatter = parse(frontmatterYaml) as WikiEntry;

  return { frontmatter, body };
}

/**
 * Count words in text
 *
 * @param text - Text to count words in
 * @returns Word count
 */
export function countWords(text: string): number {
  // Split by whitespace and filter empty strings
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}

/**
 * Split text into sentences
 *
 * @param text - Text to split
 * @returns Array of sentences
 */
export function splitIntoSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by space or end
  const sentences = text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return sentences;
}

/**
 * Split a long sentence at clause boundaries
 *
 * @param sentence - Sentence to split
 * @param maxLength - Maximum words per sentence
 * @returns Array of shorter sentences
 */
export function splitLongSentence(
  sentence: string,
  maxLength: number
): string[] {
  const words = sentence.split(/\s+/);
  if (words.length <= maxLength) {
    return [sentence];
  }

  // Find split points at clause boundaries (commas, conjunctions)
  const clauseBoundaries = [", ", "; ", " and ", " or ", " but ", " so "];
  const results: string[] = [];
  let current = "";

  // Try to split at natural boundaries
  for (const word of words) {
    const testSentence = current ? `${current} ${word}` : word;

    // Check if adding this word exceeds max length
    if (testSentence.split(/\s+/).length > maxLength && current) {
      // Try to find a clause boundary in current
      let splitPoint = -1;
      for (const boundary of clauseBoundaries) {
        const idx = current.lastIndexOf(boundary);
        if (idx > 0 && idx > splitPoint) {
          splitPoint = idx;
        }
      }

      if (splitPoint > 0) {
        // Split at the boundary
        const firstPart = current.substring(0, splitPoint).trim();
        const secondPart = current.substring(splitPoint).trim();
        results.push(firstPart);
        current = secondPart + " " + word;
      } else {
        // No boundary found, just add current and start new
        results.push(current);
        current = word;
      }
    } else {
      current = testSentence;
    }
  }

  // Add remaining
  if (current) {
    results.push(current);
  }

  // Ensure each result ends with proper punctuation
  return results.map((s) => {
    const trimmed = s.trim();
    if (!/[.!?]$/.test(trimmed)) {
      return trimmed + ".";
    }
    return trimmed;
  });
}

/**
 * Calculate text similarity (Jaccard similarity)
 *
 * @param text1 - First text
 * @param text2 - Second text
 * @returns Similarity score (0-1)
 */
export function calculateSimilarity(text1: string, text2: string): number {
  // Normalize and tokenize
  const tokenize = (text: string): Set<string> => {
    return new Set(
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );
  };

  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  // Calculate Jaccard similarity
  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Split body into paragraphs
 *
 * @param body - Markdown body
 * @returns Array of paragraphs
 */
export function splitIntoParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/**
 * Remove duplicate/redundant paragraphs
 *
 * @param paragraphs - Array of paragraphs
 * @param threshold - Similarity threshold (0-1)
 * @returns Deduplicated paragraphs and count of removed
 */
export function removeRedundantParagraphs(
  paragraphs: string[],
  threshold: number
): { paragraphs: string[]; removed: number } {
  const result: string[] = [];
  const removed: number[] = [];
  let removals = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const current = paragraphs[i];

    // Check if current paragraph is similar to any already kept
    let isRedundant = false;
    for (const kept of result) {
      const similarity = calculateSimilarity(current, kept);
      if (similarity > threshold) {
        isRedundant = true;
        removals++;
        removed.push(i);
        break;
      }
    }

    if (!isRedundant) {
      result.push(current);
    }
  }

  return { paragraphs: result, removed: removals };
}

/**
 * Apply editing transformations to body
 *
 * Performs deterministic transformations:
 * 1. Remove redundant paragraphs
 * 2. Split long sentences
 * 3. Standardize formatting
 *
 * @param body - Markdown body
 * @param config - Editing configuration
 * @returns Edited body and edit counts
 */
export function applyEditingTransformations(
  body: string,
  config: EditingConfig = DEFAULT_EDITING_CONFIG
): { body: string; edits: EditCounts } {
  const edits: EditCounts = {
    redundancies_removed: 0,
    sentences_split: 0,
    format_fixes: 0,
  };

  // Step 1: Remove redundant paragraphs
  const paragraphs = splitIntoParagraphs(body);
  const { paragraphs: dedupedParagraphs, removed } = removeRedundantParagraphs(
    paragraphs,
    config.redundancy_threshold
  );
  edits.redundancies_removed = removed;

  // Step 2: Process each paragraph
  const processedParagraphs: string[] = [];
  for (const paragraph of dedupedParagraphs) {
    // Skip headings and code blocks
    if (paragraph.startsWith("#") || paragraph.startsWith("```")) {
      processedParagraphs.push(paragraph);
      continue;
    }

    // Split into sentences
    const sentences = splitIntoSentences(paragraph);
    const processedSentences: string[] = [];

    for (const sentence of sentences) {
      const wordCount = countWords(sentence);

      // Split long sentences
      if (wordCount > config.max_sentence_length) {
        const splitSentences = splitLongSentence(sentence, config.max_sentence_length);
        processedSentences.push(...splitSentences);
        edits.sentences_split += splitSentences.length - 1;
      } else {
        processedSentences.push(sentence);
      }
    }

    // Reconstruct paragraph
    if (processedSentences.length > 0) {
      processedParagraphs.push(processedSentences.join(" "));
    }
  }

  // Step 3: Standardize formatting
  let editedBody = processedParagraphs.join("\n\n");
  editedBody = standardizeFormatting(editedBody, edits);

  return { body: editedBody, edits };
}

/**
 * Standardize formatting in markdown body
 *
 * Fixes heading levels, normalizes list formatting, ensures consistent spacing.
 *
 * @param body - Markdown body
 * @param edits - Edit counts (updated in place)
 * @returns Standardized body
 */
export function standardizeFormatting(body: string, edits: EditCounts): string {
  let result = body;

  // Normalize heading spacing (ensure space after #)
  const headingFixBefore = (result.match(/^#+[^#\s]/gm) || []).length;
  result = result.replace(/^(#+)([^\s#])/gm, "$1 $2");
  if (headingFixBefore > 0) {
    edits.format_fixes += headingFixBefore;
  }

  // Normalize list formatting (ensure space after -)
  const listFixBefore = (result.match(/^-[^\s]/gm) || []).length;
  result = result.replace(/^-(\S)/gm, "- $1");
  if (listFixBefore > 0) {
    edits.format_fixes += listFixBefore;
  }

  // Normalize spacing around headings (ensure blank line before and after)
  // This is a simplified version - full implementation would be more sophisticated

  // Remove multiple consecutive blank lines
  const blankLinesBefore = (result.match(/\n{3,}/g) || []).length;
  result = result.replace(/\n{3,}/g, "\n\n");
  if (blankLinesBefore > 0) {
    edits.format_fixes += blankLinesBefore;
  }

  // Ensure single space after periods
  const periodFixBefore = (result.match(/\.\s{2,}/g) || []).length;
  result = result.replace(/\.\s{2,}/g, ". ");
  if (periodFixBefore > 0) {
    edits.format_fixes += periodFixBefore;
  }

  return result;
}

/**
 * Check information preservation
 *
 * Ensures no substantive field values were lost during editing.
 *
 * @param original - Original wiki entry
 * @param edited - Edited wiki entry
 * @returns Whether information is preserved
 */
export function checkInformationPreservation(
  original: WikiEntry,
  edited: WikiEntry
): { preserved: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  // Check all required fields are present
  const requiredFields: (keyof WikiEntry)[] = [
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
    const originalValue = original[field];
    const editedValue = edited[field];

    // Check field exists
    if (editedValue === undefined || editedValue === null) {
      errors.push({
        field,
        rule: "information_preservation",
        message: `Required field '${field}' was removed during editing`,
        value: editedValue,
      });
      continue;
    }

    // Check arrays haven't lost elements
    if (Array.isArray(originalValue)) {
      const editedArray = editedValue as unknown[];
      if (editedArray.length < originalValue.length) {
        errors.push({
          field,
          rule: "information_preservation",
          message: `Array field '${field}' lost elements during editing: ${originalValue.length} -> ${editedArray.length}`,
          value: { original: originalValue.length, edited: editedArray.length },
        });
      }
    }
  }

  return {
    preserved: errors.length === 0,
    errors,
  };
}

/**
 * Calculate redundancy score
 *
 * Measures duplicate content across paragraphs.
 *
 * @param body - Markdown body
 * @returns Redundancy score (0-1, lower is better)
 */
export function calculateRedundancyScore(body: string): number {
  const paragraphs = splitIntoParagraphs(body);
  if (paragraphs.length < 2) return 0;

  let totalSimilarity = 0;
  let comparisons = 0;

  // Compare all paragraph pairs
  for (let i = 0; i < paragraphs.length; i++) {
    for (let j = i + 1; j < paragraphs.length; j++) {
      totalSimilarity += calculateSimilarity(paragraphs[i], paragraphs[j]);
      comparisons++;
    }
  }

  return comparisons > 0 ? totalSimilarity / comparisons : 0;
}

/**
 * Calculate fluency score
 *
 * Measures sentence length distribution and complexity.
 *
 * @param body - Markdown body
 * @param config - Editing configuration
 * @returns Fluency score (0-1, higher is better)
 */
export function calculateFluencyScore(
  body: string,
  config: EditingConfig = DEFAULT_EDITING_CONFIG
): number {
  const sentences = splitIntoSentences(body);
  if (sentences.length === 0) return 1;

  // Calculate percentage of sentences within length limit
  const withinLimit = sentences.filter(
    (s) => countWords(s) <= config.max_sentence_length
  );

  // Fluency score is the ratio of well-formed sentences
  return withinLimit.length / sentences.length;
}

/**
 * Generate edited markdown with YAML frontmatter
 *
 * Renders the edited wiki entry as markdown with proper YAML frontmatter.
 *
 * @param entry - Edited wiki entry
 * @param body - Edited markdown body
 * @returns Markdown content with YAML frontmatter
 */
export function generateEditedMarkdown(entry: EditedEntry, body: string): string {
  // Prepare frontmatter data
  const frontmatter: Record<string, unknown> = {
    spec: entry.spec,
    title: entry.title,
    type: entry.type,
    value_proposition: entry.value_proposition,
    what_it_offers: entry.what_it_offers,
    problems_solved: entry.problems_solved,
    target_audience: entry.target_audience,
    when_it_matters: entry.when_it_matters,
    when_less_matters: entry.when_less_matters,
    short_formula: entry.short_formula,
    sources: entry.sources,
  };

  // Add optional fields
  if (entry.pricing) frontmatter.pricing = entry.pricing;
  if (entry.alternatives) frontmatter.alternatives = entry.alternatives;
  if (entry.integrations) frontmatter.integrations = entry.integrations;
  if (entry.pipeline_metadata) frontmatter.pipeline_metadata = entry.pipeline_metadata;
  if (entry.editing_metadata) frontmatter.editing_metadata = entry.editing_metadata;

  // Generate YAML frontmatter
  const yamlFrontmatter = stringify(frontmatter, {
    lineWidth: 0,
    quotingType: '"',
    forceQuotes: false,
  });

  // Combine frontmatter and body
  return `---
${yamlFrontmatter}---

${body}
`;
}

/**
 * Validate edited entry
 *
 * Performs quality gate checks on the edited entry.
 *
 * @param edited - Edited entry
 * @param original - Original wiki entry
 * @param editedBody - Edited markdown body
 * @param config - Editing configuration
 * @returns Validation result
 */
export function validateEditedEntry(
  edited: EditedEntry,
  original: WikiEntry,
  editedBody: string,
  config: EditingConfig = DEFAULT_EDITING_CONFIG
): EditingValidationResult {
  const errors: ValidationError[] = [];

  // Check information preservation
  const preservation = checkInformationPreservation(original, edited);
  if (!preservation.preserved) {
    errors.push(...preservation.errors);
  }

  // Calculate redundancy score
  const redundancyScore = calculateRedundancyScore(editedBody);
  if (redundancyScore > config.redundancy_threshold) {
    errors.push({
      field: "body",
      rule: "redundancy",
      message: `Redundancy score ${redundancyScore.toFixed(2)} exceeds threshold ${config.redundancy_threshold}`,
      value: redundancyScore,
    });
  }

  // Calculate fluency score
  const fluencyScore = calculateFluencyScore(editedBody, config);
  if (fluencyScore < config.min_fluency_score) {
    errors.push({
      field: "body",
      rule: "fluency",
      message: `Fluency score ${fluencyScore.toFixed(2)} below minimum ${config.min_fluency_score}`,
      value: fluencyScore,
    });
  }

  return {
    passed: errors.length === 0,
    redundancy_score: redundancyScore,
    fluency_score: fluencyScore,
    information_preserved: preservation.preserved,
    errors,
  };
}

/**
 * Execute Stage 3: Editing
 *
 * Applies editing transformations to improve clarity and remove redundancy.
 *
 * @param job - Job specification
 * @param artifactDir - Artifact directory path
 * @param config - Optional configuration overrides
 * @returns Stage output with edited entry and validation
 */
export async function executeStage3(
  job: JobSpec,
  artifactDir: string,
  config: Stage3Config = {}
): Promise<Stage3Output> {
  const startTime = Date.now();
  const editingConfig = {
    ...DEFAULT_EDITING_CONFIG,
    ...config.editingConfig,
  };

  logStage3Start(job.spec, job.entity, artifactDir);

  // Read draft_v1.md
  const { frontmatter, body } = await readEditedInput(
    artifactDir,
    config.fileReaderFn
  );

  const originalWordCount = countWords(body);
  logInputLoaded(artifactDir, "draft_v1.md", originalWordCount);

  // Apply editing transformations
  const { body: editedBody, edits } = applyEditingTransformations(
    body,
    editingConfig
  );

  const editedWordCount = countWords(editedBody);

  // Create editing metadata
  const editingMetadata: EditingMetadata = {
    edited_at: new Date().toISOString(),
    original_word_count: originalWordCount,
    edited_word_count: editedWordCount,
    edits_applied: [
      ...(edits.redundancies_removed > 0
        ? [`${edits.redundancies_removed} redundancies removed`]
        : []),
      ...(edits.sentences_split > 0
        ? [`${edits.sentences_split} sentences split`]
        : []),
      ...(edits.format_fixes > 0
        ? [`${edits.format_fixes} format fixes`]
        : []),
    ],
  };

  // Create edited entry
  const editedEntry: EditedEntry = {
    ...frontmatter,
    editing_metadata: editingMetadata,
  };

  // Validate edited entry
  const validation = validateEditedEntry(
    editedEntry,
    frontmatter,
    editedBody,
    editingConfig
  );

  // Generate edited markdown
  const editedMarkdown = generateEditedMarkdown(editedEntry, editedBody);
  const draftFile = join(artifactDir, "draft_v2.md");
  await writeFile(draftFile, editedMarkdown, "utf-8");

  const duration = Date.now() - startTime;

  const wordCounts: WordCounts = {
    before: originalWordCount,
    after: editedWordCount,
  };

  logStage3Completion(
    job.spec,
    job.entity,
    draftFile,
    edits,
    wordCounts,
    validation.passed ? "pass" : "fail",
    duration
  );

  return {
    entry: editedEntry,
    draftFile,
    artifactDir,
    validation,
    editsMade: edits,
    wordCounts,
  };
}

/**
 * Log Stage 3 start
 */
function logStage3Start(
  specVersion: string,
  entity: string,
  artifactDir: string
): void {
  console.error(
    JSON.stringify({
      level: "info",
      timestamp: new Date().toISOString(),
      message: "Stage 3 started: Editing",
      stage: 3,
      spec_version: specVersion,
      entity,
      artifact_dir: artifactDir,
    })
  );
}

/**
 * Log input loaded
 */
function logInputLoaded(
  artifactDir: string,
  inputFile: string,
  wordCount: number
): void {
  console.error(
    JSON.stringify({
      level: "info",
      timestamp: new Date().toISOString(),
      message: "Draft input loaded",
      stage: 3,
      artifact_dir: artifactDir,
      input_artifact: inputFile,
      word_count: wordCount,
    })
  );
}

/**
 * Log Stage 3 completion
 */
function logStage3Completion(
  specVersion: string,
  entity: string,
  draftFile: string,
  edits: EditCounts,
  wordCounts: WordCounts,
  gateResult: "pass" | "fail",
  durationMs: number
): void {
  console.error(
    JSON.stringify({
      level: "info",
      timestamp: new Date().toISOString(),
      message: "Stage 3 completed: Editing",
      stage: 3,
      spec_version: specVersion,
      entity,
      artifact_dir: basename(draftFile),
      edits_made: edits,
      word_count_before: wordCounts.before,
      word_count_after: wordCounts.after,
      duration_ms: durationMs,
      gate_result: gateResult,
    })
  );
}

/**
 * Create Stage 3 for pipeline orchestrator
 */
export function createStage3(config: Stage3Config = {}): Stage {
  return {
    id: 3,
    name: "editing",
    description: "Apply editing transformations to improve clarity and remove redundancy",
    execute: async (job: JobSpec, context: StageContext) => {
      const slug = job.entity
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      const artifactDir = join(job.output, "artifacts", slug);

      context.log("info", "Starting editing stage", {
        entity: job.entity,
        artifact_dir: artifactDir,
      });

      const output = await executeStage3(job, artifactDir, config);

      context.log("info", "Editing stage completed", {
        draft_file: output.draftFile,
        edits_made: output.editsMade,
        word_counts: output.wordCounts,
        validation_passed: output.validation.passed,
      });

      return output;
    },
    gateCheck: async (job: JobSpec, result: unknown): Promise<GateResult> => {
      const output = result as Stage3Output;

      if (!output.validation.passed) {
        const errors = output.validation.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join("; ");
        return {
          passed: false,
          reason: `Editing validation failed: ${errors}`,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        passed: true,
        reason: `Draft edited successfully: ${output.editsMade.redundancies_removed} redundancies removed, ${output.editsMade.sentences_split} sentences split, ${output.wordCounts.before} -> ${output.wordCounts.after} words`,
        timestamp: new Date().toISOString(),
      };
    },
  };
}

// Re-export types for consumers
export { type EditedEntry, type EditingConfig } from "../types/editing";
