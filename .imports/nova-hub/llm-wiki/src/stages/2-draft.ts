/**
 * Stage 2: Draft Generation
 *
 * Generates a structured wiki entry draft (draft_v1.md) in the canonical
 * LLM-Wiki schema format from research artifacts (sources.json, extracts.json,
 * research_brief.md). Uses template-based synthesis with no LLM calls.
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { stringify } from "yaml";
import type { JobSpec } from "../types/job";
import type { Stage, StageContext, GateResult } from "../pipeline/types";
import type { Source, Extract, ResearchBrief } from "../types/evidence";
import type {
  WikiEntry,
  DraftConfig,
  DraftOutput,
  DraftValidation,
  EntityType,
  FieldCounts,
  Pricing,
  PipelineMetadata,
} from "../types/draft";
import {
  DEFAULT_DRAFT_CONFIG,
  classifyEntityType,
  checkFieldDensity,
  isWikiEntry,
} from "../types/draft";
import {
  validateFrontmatter,
  getValidationErrors,
  getSchemaId,
} from "../pipeline/schema-validator";

/**
 * File reader function type (injected for testability)
 */
export type FileReaderFn = (path: string) => Promise<string>;

/**
 * Stage 2 output
 */
export interface Stage2Output {
  /** Generated wiki entry */
  entry: WikiEntry;
  /** Path to draft_v1.md */
  draftFile: string;
  /** Artifact directory path */
  artifactDir: string;
  /** Validation result */
  validation: DraftValidation;
  /** Field counts for density checking */
  fieldCounts: FieldCounts;
}

/**
 * Stage 2 configuration
 */
export interface Stage2Config {
  /** Draft configuration */
  draftConfig?: Partial<DraftConfig>;
  /** File reader function (uses default if not provided) */
  fileReaderFn?: FileReaderFn;
}

/**
 * Read research artifacts from artifact directory
 *
 * Loads sources.json, extracts.json, and research_brief.md from the
 * artifact directory and returns structured data for draft generation.
 *
 * @param artifactDir - Artifact directory path
 * @param fileReader - Optional file reader function (for testing)
 * @returns Loaded research artifacts
 */
export async function readResearchArtifacts(
  artifactDir: string,
  fileReader?: FileReaderFn
): Promise<{
  sources: Source[];
  extracts: Extract[];
  brief: ResearchBrief;
}> {
  const reader = fileReader || readFile;

  // Read sources.json
  const sourcesPath = join(artifactDir, "sources.json");
  const sourcesData = await reader(sourcesPath);
  const sources: Source[] = JSON.parse(sourcesData.toString());

  // Read extracts.json
  const extractsPath = join(artifactDir, "extracts.json");
  const extractsData = await reader(extractsPath);
  const extracts: Extract[] = JSON.parse(extractsData.toString());

  // Read research_brief.md (parse frontmatter or just extract entity)
  const briefPath = join(artifactDir, "research_brief.md");
  const briefData = await reader(briefPath);
  const briefContent = briefData.toString();

  // Parse research brief from markdown
  const brief = parseResearchBriefMarkdown(briefContent, sources, extracts);

  return { sources, extracts, brief };
}

/**
 * Parse research brief from markdown content
 *
 * Extracts structured data from research_brief.md markdown file.
 *
 * @param content - Markdown content
 * @param sources - Sources array
 * @param extracts - Extracts array
 * @returns Research brief object
 */
function parseResearchBriefMarkdown(
  content: string,
  sources: Source[],
  extracts: Extract[]
): ResearchBrief {
  // Extract entity from title (e.g., "# Research Brief: EntityName")
  const entityMatch = content.match(/^#\s+Research Brief:\s+(.+)$/m);
  const entity = entityMatch ? entityMatch[1].trim() : "Unknown Entity";

  // Extract key findings from markdown
  const keyFindings: string[] = [];
  const findingsSection = content.match(/## Key Findings\s+([\s\S]*?)(?=##|$)/);
  if (findingsSection) {
    const findingLines = findingsSection[1]
      .split("\n")
      .filter((line) => line.trim().startsWith("-"))
      .map((line) => line.replace(/^\s*-\s*/, "").trim());
    keyFindings.push(...findingLines);
  }

  // Extract gaps from markdown
  let gaps: string[] | undefined;
  const gapsSection = content.match(/## Research Gaps\s+([\s\S]*?)(?=##|$)/);
  if (gapsSection) {
    gaps = gapsSection[1]
      .split("\n")
      .filter((line) => line.trim().startsWith("-"))
      .map((line) => line.replace(/^\s*-\s*/, "").trim());
  }

  return {
    entity,
    generated_at: new Date().toISOString(),
    source_count: sources.length,
    successful_extractions: extracts.filter((e) => e.status === "success").length,
    confidence_score:
      sources.length > 0
        ? extracts.filter((e) => e.status === "success").length / sources.length
        : 0,
    sources,
    extracts,
    key_findings: keyFindings,
    gaps,
  };
}

/**
 * Synthesize wiki entry from research artifacts
 *
 * Transforms research evidence into structured wiki entry fields using
 * template heuristics:
 * - Entity mentions → value_proposition
 * - Key findings → what_it_offers
 * - Gaps → problems_solved
 *
 * @param entity - Entity name
 * @param brief - Research brief
 * @param sources - Collected sources
 * @param extracts - Extracted evidence
 * @param config - Draft configuration
 * @returns Synthesized wiki entry
 */
export function synthesizeWikiEntry(
  entity: string,
  brief: ResearchBrief,
  sources: Source[],
  extracts: Extract[],
  config: DraftConfig = DEFAULT_DRAFT_CONFIG
): WikiEntry {
  const startTime = Date.now();

  // Classify entity type using heuristics
  const type = classifyEntityType(entity, brief, config.typeHeuristics);

  // Generate value proposition from entity name and key findings
  const valueProposition = generateValueProposition(entity, brief);

  // Generate what_it_offers from key findings
  const whatItOffers = generateWhatItOffers(brief);

  // Generate problems_solved from gaps or inferred from findings
  const problemsSolved = generateProblemsSolved(brief);

  // Generate target audience from extracts
  const targetAudience = generateTargetAudience(entity, brief);

  // Generate when_it_matters from extracts
  const whenItMatters = generateWhenItMatters(entity, brief);

  // Generate when_less_matters (contrasting contexts)
  const whenLessMatters = generateWhenLessMatters(entity, brief);

  // Generate short formula (concise summary)
  const shortFormula = generateShortFormula(entity, brief);

  // Extract pricing information if available
  const pricing = extractPricing(extracts, sources);

  // Extract alternatives if mentioned
  const alternatives = extractAlternatives(extracts);

  // Extract integrations if mentioned
  const integrations = extractIntegrations(extracts);

  // Generate pipeline metadata
  const pipelineMetadata: PipelineMetadata = {
    pipeline_version: "1.0.0",
    spec_version: getSchemaId(),
    generated_at: new Date().toISOString(),
    duration_ms: Date.now() - startTime,
    stages_completed: ["research", "draft"],
  };

  const entry: WikiEntry = {
    spec: "llm-wiki/1.0.0",
    title: entity,
    type,
    value_proposition: valueProposition,
    what_it_offers: whatItOffers,
    problems_solved: problemsSolved,
    target_audience: targetAudience,
    when_it_matters: whenItMatters,
    when_less_matters: whenLessMatters,
    short_formula: shortFormula,
    sources: sources,
    pricing,
    alternatives,
    integrations,
    pipeline_metadata: pipelineMetadata,
  };

  return entry;
}

/**
 * Generate value proposition from entity and key findings
 */
function generateValueProposition(entity: string, brief: ResearchBrief): string {
  // Use first key finding as basis, or create generic proposition
  if (brief.key_findings.length > 0) {
    const firstFinding = brief.key_findings[0];
    // Simplify to one sentence if needed
    const sentence = firstFinding.split(/[.!?]+/)[0].trim();
    if (sentence.length >= 10 && sentence.length <= 500) {
      return sentence;
    }
  }

  // Fallback: create generic proposition based on entity type
  return `${entity} is a solution that addresses specific needs in its domain.`;
}

/**
 * Generate what_it_offers from key findings
 */
function generateWhatItOffers(brief: ResearchBrief): string[] {
  const items: string[] = [];

  // Extract capabilities from key findings
  for (const finding of brief.key_findings) {
    // Look for capability indicators
    if (
      finding.toLowerCase().includes("offers") ||
      finding.toLowerCase().includes("provides") ||
      finding.toLowerCase().includes("includes") ||
      finding.toLowerCase().includes("features") ||
      finding.toLowerCase().includes("supports") ||
      finding.toLowerCase().includes("enables")
    ) {
      items.push(finding.trim());
    }
  }

  // If not enough items, use all key findings
  if (items.length < 3) {
    items.length = 0;
    for (const finding of brief.key_findings.slice(0, 5)) {
      items.push(finding.trim());
    }
  }

  // Ensure minimum of 3 items
  while (items.length < 3) {
    items.push(`Capability ${items.length + 1} derived from research`);
  }

  return items.slice(0, 10); // Cap at 10 items
}

/**
 * Generate problems_solved from gaps or inferred from findings
 */
function generateProblemsSolved(brief: ResearchBrief): string[] {
  const problems: string[] = [];

  // Use gaps if available
  if (brief.gaps && brief.gaps.length > 0) {
    for (const gap of brief.gaps) {
      // Transform gap into problem statement
      problems.push(`Addresses: ${gap}`);
    }
  }

  // If not enough, infer from key findings
  if (problems.length < 2) {
    for (const finding of brief.key_findings) {
      // Look for problem indicators
      if (
        finding.toLowerCase().includes("solves") ||
        finding.toLowerCase().includes("addresses") ||
        finding.toLowerCase().includes("reduces") ||
        finding.toLowerCase().includes("improves") ||
        finding.toLowerCase().includes("eliminates")
      ) {
        problems.push(finding.trim());
      }
    }
  }

  // If still not enough, create generic problems
  while (problems.length < 2) {
    problems.push(`Problem area ${problems.length + 1} identified through research`);
  }

  return problems.slice(0, 10); // Cap at 10 items
}

/**
 * Generate target audience from extracts
 */
function generateTargetAudience(entity: string, brief: ResearchBrief): string {
  // Look for audience indicators in extracts
  for (const extract of brief.extracts) {
    const content = extract.content.toLowerCase();
    if (
      content.includes("for developers") ||
      content.includes("for teams") ||
      content.includes("for enterprises") ||
      content.includes("for individuals") ||
      content.includes("target audience")
    ) {
      // Extract relevant sentence
      const sentences = extract.content.split(/[.!?]+/);
      for (const sentence of sentences) {
        if (sentence.toLowerCase().match(/for\s+(developers|teams|enterprises|users|individuals)/)) {
          return sentence.trim();
        }
      }
    }
  }

  // Fallback: generic audience based on entity type
  return `Users and organizations interested in ${entity}`;
}

/**
 * Generate when_it_matters from extracts
 */
function generateWhenItMatters(entity: string, brief: ResearchBrief): string {
  const contexts: string[] = [];

  for (const extract of brief.extracts) {
    const content = extract.content.toLowerCase();
    if (
      content.includes("when") ||
      content.includes("useful for") ||
      content.includes("ideal for") ||
      content.includes("best suited")
    ) {
      const sentences = extract.content.split(/[.!?]+/);
      for (const sentence of sentences) {
        if (
          sentence.toLowerCase().includes("when") ||
          sentence.toLowerCase().includes("useful") ||
          sentence.toLowerCase().includes("ideal") ||
          sentence.toLowerCase().includes("suited")
        ) {
          contexts.push(sentence.trim());
        }
      }
    }
  }

  if (contexts.length === 0) {
    return `When seeking solutions related to ${entity}`;
  }

  return contexts.slice(0, 3).join("; ");
}

/**
 * Generate when_less_matters (contrasting contexts)
 */
function generateWhenLessMatters(entity: string, brief: ResearchBrief): string {
  // Look for limitations or alternative suggestions
  for (const extract of brief.extracts) {
    const content = extract.content.toLowerCase();
    if (
      content.includes("limitation") ||
      content.includes("not suitable") ||
      content.includes("not recommended") ||
      content.includes("alternative")
    ) {
      const sentences = extract.content.split(/[.!?]+/);
      for (const sentence of sentences) {
        if (
          sentence.toLowerCase().includes("not") ||
          sentence.toLowerCase().includes("limitation") ||
          sentence.toLowerCase().includes("alternative")
        ) {
          return sentence.trim();
        }
      }
    }
  }

  // Fallback: generic contrast
  return `When requirements differ significantly from ${entity}'s core capabilities`;
}

/**
 * Generate short formula (concise summary)
 */
function generateShortFormula(entity: string, brief: ResearchBrief): string {
  // Create a concise summary formula
  if (brief.key_findings.length > 0) {
    const keyTerms = brief.key_findings
      .slice(0, 3)
      .map((f) => {
        const words = f.split(" ").slice(0, 5);
        return words.join(" ");
      })
      .join(" + ");

    return `${entity}: ${keyTerms}`;
  }

  return `${entity}: A solution for its domain`;
}

/**
 * Extract pricing information from extracts
 */
function extractPricing(extracts: Extract[], sources: Source[]): Pricing | undefined {
  for (const extract of extracts) {
    const content = extract.content.toLowerCase();

    // Look for pricing indicators
    if (
      content.includes("pricing") ||
      content.includes("subscription") ||
      content.includes("free tier") ||
      content.includes("$") ||
      content.includes("cost")
    ) {
      // Try to extract pricing model
      let model: Pricing["model"] = "subscription";
      if (content.includes("free")) model = "free";
      else if (content.includes("freemium")) model = "freemium";
      else if (content.includes("one-time")) model = "one-time";
      else if (content.includes("usage-based")) model = "usage-based";
      else if (content.includes("enterprise")) model = "enterprise";

      // Try to extract price
      const priceMatch = extract.content.match(/\$(\d+)(?:\/(mo|month|year))?/i);
      const startingPrice = priceMatch ? `$${priceMatch[1]}/${priceMatch[2] || "mo"}` : undefined;

      // Look up source URL from source_id
      const sourceUrl = sources.find(s => s.excerpt_id === extract.source_id)?.url;
      return {
        model,
        starting_price: startingPrice,
        has_free_tier: content.includes("free"),
        source: sourceUrl,
      };
    }
  }

  return undefined;
}

/**
 * Extract alternatives from extracts
 */
function extractAlternatives(extracts: Extract[]): string[] | undefined {
  const alternatives: string[] = [];

  for (const extract of extracts) {
    const content = extract.content;
    // Look for alternative mentions
    if (content.toLowerCase().includes("alternative") || content.toLowerCase().includes("vs")) {
      // Extract capitalized words that could be alternative names
      const matches = content.match(/[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*/g);
      if (matches) {
        alternatives.push(
          ...matches.filter((m) => m.length > 3 && !["The", "This", "That", "These"].includes(m))
        );
      }
    }
  }

  return alternatives.length >= 2 ? [...new Set(alternatives)].slice(0, 5) : undefined;
}

/**
 * Extract integrations from extracts
 */
function extractIntegrations(extracts: Extract[]): string[] | undefined {
  const integrations: string[] = [];

  for (const extract of extracts) {
    const content = extract.content;
    // Look for integration indicators
    if (
      content.toLowerCase().includes("integrate") ||
      content.toLowerCase().includes("integration") ||
      content.toLowerCase().includes("api") ||
      content.toLowerCase().includes("connect")
    ) {
      // Extract capitalized words that could be integration names
      const matches = content.match(/[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*/g);
      if (matches) {
        integrations.push(
          ...matches.filter((m) => m.length > 3 && !["The", "This", "That", "These"].includes(m))
        );
      }
    }
  }

  return integrations.length > 0 ? [...new Set(integrations)].slice(0, 10) : undefined;
}

/**
 * Generate draft markdown with YAML frontmatter
 *
 * Renders the wiki entry as markdown with proper YAML frontmatter
 * using the yaml library for proper escaping.
 *
 * @param entry - Wiki entry to render
 * @returns Markdown content with YAML frontmatter
 */
export function generateDraftMarkdown(entry: WikiEntry): string {
  // Prepare frontmatter data (exclude _body field)
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

  // Generate YAML frontmatter with proper escaping
  // Use simple quote double style for compatibility
  const yamlFrontmatter = stringify(frontmatter, {
    lineWidth: 0, // Don't wrap lines
    quotingType: '"', // Use double quotes
    forceQuotes: false, // Only quote when necessary
  });

  // Combine frontmatter and body
  const markdown = `---
${yamlFrontmatter}---
${
  entry._body
    ? `\n${entry._body}\n`
    : `
## Overview

${entry.value_proposition}

## What It Offers

${entry.what_it_offers.map((item) => `- ${item}`).join("\n")}

## Problems Solved

${entry.problems_solved.map((item) => `- ${item}`).join("\n")}

## Target Audience

${entry.target_audience}

## When It Matters

${entry.when_it_matters}

## When Less Matters

${entry.when_less_matters}

---
*Generated by LLM-Wiki Pipeline*
`
}
`;

  return markdown;
}

/**
 * Execute Stage 2: Draft Generation
 *
 * Generates a structured wiki entry draft from research artifacts.
 *
 * @param job - Job specification
 * @param artifactDir - Artifact directory path
 * @param config - Optional configuration overrides
 * @returns Stage output with wiki entry and validation
 */
export async function executeStage2(
  job: JobSpec,
  artifactDir: string,
  config: Stage2Config = {}
): Promise<Stage2Output> {
  const startTime = Date.now();
  const draftConfig = { ...DEFAULT_DRAFT_CONFIG, ...config.draftConfig };

  logStage2Start(job.spec, job.entity, artifactDir);

  // Read research artifacts
  const { sources, extracts, brief } = await readResearchArtifacts(
    artifactDir,
    config.fileReaderFn
  );

  logArtifactsLoaded(artifactDir, sources.length, extracts.length, brief.key_findings.length);

  // Synthesize wiki entry
  const entry = synthesizeWikiEntry(job.entity, brief, sources, extracts, draftConfig);

  // Validate schema compliance
  const schemaValid = draftConfig.validateSchema ? validateFrontmatter(entry) : true;
  const schemaErrors = schemaValid ? [] : getValidationErrors();

  // Check field density
  const densityResult = checkFieldDensity(entry, draftConfig);

  // Generate draft markdown
  const draftMarkdown = generateDraftMarkdown(entry);
  const draftFile = join(artifactDir, "draft_v1.md");
  await writeFile(draftFile, draftMarkdown, "utf-8");

  // Compile validation result
  const validation: DraftValidation = {
    passed: schemaValid && densityResult.met,
    schemaValid,
    densityMet: densityResult.met,
    errors: [
      ...schemaErrors.map((err) => ({
        field: err.instancePath || "unknown",
        rule: err.keyword || "validation",
        message: err.message || "Schema validation error",
        value: err.data,
      })),
      ...densityResult.errors,
    ],
    warnings: [],
  };

  const duration = Date.now() - startTime;

  logStage2Completion(
    job.spec,
    job.entity,
    draftFile,
    densityResult.counts,
    validation.passed ? "pass" : "fail",
    duration
  );

  return {
    entry,
    draftFile,
    artifactDir,
    validation,
    fieldCounts: densityResult.counts,
  };
}

/**
 * Log Stage 2 start
 */
function logStage2Start(specVersion: string, entity: string, artifactDir: string): void {
  console.error(
    JSON.stringify({
      level: "info",
      timestamp: new Date().toISOString(),
      message: "Stage 2 started: Draft generation",
      stage: 2,
      spec_version: specVersion,
      entity,
      artifact_dir: artifactDir,
    })
  );
}

/**
 * Log artifacts loaded
 */
function logArtifactsLoaded(
  artifactDir: string,
  sourceCount: number,
  extractCount: number,
  findingCount: number
): void {
  console.error(
    JSON.stringify({
      level: "info",
      timestamp: new Date().toISOString(),
      message: "Research artifacts loaded",
      stage: 2,
      artifact_dir: artifactDir,
      source_count: sourceCount,
      extract_count: extractCount,
      finding_count: findingCount,
    })
  );
}

/**
 * Log Stage 2 completion
 */
function logStage2Completion(
  specVersion: string,
  entity: string,
  draftFile: string,
  fieldCounts: FieldCounts,
  gateResult: "pass" | "fail",
  durationMs: number
): void {
  console.error(
    JSON.stringify({
      level: "info",
      timestamp: new Date().toISOString(),
      message: "Stage 2 completed: Draft generation",
      stage: 2,
      spec_version: specVersion,
      entity,
      artifact_dir: basename(draftFile),
      field_counts: fieldCounts,
      duration_ms: durationMs,
      gate_result: gateResult,
    })
  );
}

/**
 * Create Stage 2 for pipeline orchestrator
 */
export function createStage2(config: Stage2Config = {}): Stage {
  return {
    id: 2,
    name: "draft",
    description: "Generate wiki entry draft from research artifacts",

    execute: async (job: JobSpec, context: StageContext) => {
      const slug = job.entity
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const artifactDir = join(job.output, "artifacts", slug);

      context.log("info", "Starting draft stage", {
        entity: job.entity,
        artifact_dir: artifactDir,
      });

      const output = await executeStage2(job, artifactDir, config);

      context.log("info", "Draft stage completed", {
        draft_file: output.draftFile,
        field_counts: output.fieldCounts,
        validation_passed: output.validation.passed,
      });

      return output;
    },

    gateCheck: async (job: JobSpec, result: unknown): Promise<GateResult> => {
      const output = result as Stage2Output;

      if (!output.validation.passed) {
        const errors = output.validation.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join("; ");

        return {
          passed: false,
          reason: `Draft validation failed: ${errors}`,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        passed: true,
        reason: `Draft generated successfully with ${output.fieldCounts.what_it_offers} offerings, ${output.fieldCounts.problems_solved} problems, ${output.fieldCounts.sources} sources`,
        timestamp: new Date().toISOString(),
      };
    },
  };
}

// Re-export types for consumers
export { type WikiEntry, type DraftConfig, type DraftOutput } from "../types/draft";
