/**
 * Draft Generation Types
 *
 * Type definitions for Stage 2 (Draft) wiki entry generation.
 * These types support structured draft creation from research artifacts,
 * schema validation, and field density requirements.
 */

import type { Source, ResearchBrief } from "./evidence";

/**
 * Entity type classification
 */
export type EntityType =
  | "plataforma"
  | "ferramenta"
  | "curso"
  | "servico"
  | "produto"
  | "framework"
  | "metodologia";

/**
 * Pricing model types
 */
export type PricingModel =
  | "subscription"
  | "one-time"
  | "freemium"
  | "usage-based"
  | "enterprise"
  | "free";

/**
 * Pricing information (optional)
 */
export interface Pricing {
  model: PricingModel;
  starting_price?: string;
  currency?: string;
  has_free_tier?: boolean;
  source?: string;
}

/**
 * Pipeline metadata (auto-generated)
 */
export interface PipelineMetadata {
  pipeline_version: string;
  spec_version: string;
  generated_at: string;
  inputs_hash?: string;
  output_hash?: string;
  duration_ms?: number;
  stages_completed?: string[];
  quality_score?: number;
}

/**
 * Wiki Entry (canonical LLM-Wiki schema)
 *
 * Represents a complete wiki entry in the canonical schema format.
 * Used as the output of Stage 2 (Draft) generation.
 */
export interface WikiEntry {
  spec: string;
  title: string;
  type: EntityType;
  value_proposition: string;
  what_it_offers: string[];
  problems_solved: string[];
  target_audience: string;
  when_it_matters: string;
  when_less_matters: string;
  short_formula: string;
  sources: Source[];
  pricing?: Pricing;
  alternatives?: string[];
  integrations?: string[];
  pipeline_metadata?: PipelineMetadata;
  _body?: string;
}

/**
 * Draft configuration
 *
 * Configuration options for draft generation.
 * Controls field density requirements and validation thresholds.
 */
export interface DraftConfig {
  /** Minimum number of what_it_offers items (default: 3) */
  minWhatItOffers: number;
  /** Minimum number of problems_solved items (default: 2) */
  minProblemsSolved: number;
  /** Minimum number of sources (default: 1) */
  minSources: number;
  /** Whether to validate schema compliance */
  validateSchema: boolean;
  /** Whether to enforce field density requirements */
  enforceDensity: boolean;
  /** Entity type heuristics for type classification */
  typeHeuristics?: TypeHeuristic[];
}

/**
 * Type heuristic for entity classification
 *
 * Maps keywords/patterns to entity types for automatic classification.
 */
export interface TypeHeuristic {
  type: EntityType;
  keywords: string[];
  patterns?: RegExp[];
}

/**
 * Draft output
 *
 * Output from Stage 2 (Draft) generation.
 * Includes the generated entry and validation metadata.
 */
export interface DraftOutput {
  /** Generated wiki entry */
  entry: WikiEntry;
  /** Draft file path */
  draftFile: string;
  /** Artifact directory path */
  artifactDir: string;
  /** Validation result */
  validation: DraftValidation;
  /** Field counts for density checking */
  fieldCounts: FieldCounts;
}

/**
 * Draft validation result
 */
export interface DraftValidation {
  /** Whether the draft passes all checks */
  passed: boolean;
  /** Schema validation passed */
  schemaValid: boolean;
  /** Field density requirements met */
  densityMet: boolean;
  /** Validation errors (if any) */
  errors: ValidationError[];
  /** Validation warnings (non-blocking) */
  warnings: ValidationWarning[];
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  rule: string;
  message: string;
  value?: unknown;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

/**
 * Field counts for density checking
 */
export interface FieldCounts {
  what_it_offers: number;
  problems_solved: number;
  sources: number;
}

/**
 * Default type heuristics for entity classification
 */
export const DEFAULT_TYPE_HEURISTICS: TypeHeuristic[] = [
  {
    type: "plataforma",
    keywords: ["platform", "plataforma", "ecosystem", "marketplace"],
    patterns: [/\bplatform\b/i, /\bplataforma\b/i],
  },
  {
    type: "ferramenta",
    keywords: ["tool", "ferramenta", "utility", "cli", "sdk"],
    patterns: [/\btool\b/i, /\bferramenta\b/i, /\bcli\b/i, /\bsdk\b/i],
  },
  {
    type: "curso",
    keywords: ["course", "curso", "training", "learning", "education", "bootcamp"],
    patterns: [/\bcurso\b/i, /\bcourse\b/i, /\btraining\b/i, /\bbootcamp\b/i],
  },
  {
    type: "servico",
    keywords: ["service", "serviço", "api", "cloud", "managed"],
    patterns: [/\bservice\b/i, /\bserviço\b/i, /\bapi\b/i, /\bcloud\b/i],
  },
  {
    type: "produto",
    keywords: ["product", "produto", "software", "app", "application"],
    patterns: [/\bproduto\b/i, /\bproduct\b/i, /\bsoftware\b/i, /\bapp\b/i],
  },
  {
    type: "framework",
    keywords: ["framework", "library", "lib", "engine"],
    patterns: [/\bframework\b/i, /\blibrary\b/i, /\blib\b/i],
  },
  {
    type: "metodologia",
    keywords: ["methodology", "metodologia", "method", "approach", "practice"],
    patterns: [/\bmethodology\b/i, /\bmetodologia\b/i, /\bmethod\b/i],
  },
];

/**
 * Default draft configuration
 */
export const DEFAULT_DRAFT_CONFIG: DraftConfig = {
  minWhatItOffers: 3,
  minProblemsSolved: 2,
  minSources: 1,
  validateSchema: true,
  enforceDensity: true,
  typeHeuristics: DEFAULT_TYPE_HEURISTICS,
};

/**
 * Type guard for EntityType
 */
export function isEntityType(value: unknown): value is EntityType {
  const validTypes: EntityType[] = [
    "plataforma",
    "ferramenta",
    "curso",
    "servico",
    "produto",
    "framework",
    "metodologia",
  ];
  return typeof value === "string" && validTypes.includes(value as EntityType);
}

/**
 * Type guard for PricingModel
 */
export function isPricingModel(value: unknown): value is PricingModel {
  const validModels: PricingModel[] = [
    "subscription",
    "one-time",
    "freemium",
    "usage-based",
    "enterprise",
    "free",
  ];
  return typeof value === "string" && validModels.includes(value as PricingModel);
}

/**
 * Type guard for WikiEntry
 */
export function isWikiEntry(value: unknown): value is WikiEntry {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  return (
    typeof obj.spec === "string" &&
    typeof obj.title === "string" &&
    isEntityType(obj.type) &&
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
 * Type guard for DraftConfig
 */
export function isDraftConfig(value: unknown): value is DraftConfig {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  return (
    typeof obj.minWhatItOffers === "number" &&
    typeof obj.minProblemsSolved === "number" &&
    typeof obj.minSources === "number" &&
    typeof obj.validateSchema === "boolean" &&
    typeof obj.enforceDensity === "boolean"
  );
}

/**
 * Type guard for DraftOutput
 */
export function isDraftOutput(value: unknown): value is DraftOutput {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  return (
    isWikiEntry(obj.entry) &&
    typeof obj.draftFile === "string" &&
    typeof obj.artifactDir === "string" &&
    typeof obj.validation === "object" &&
    typeof obj.fieldCounts === "object"
  );
}

/**
 * Classify entity type using heuristics
 *
 * Analyzes text content and research brief to determine the most
 * appropriate entity type classification using keyword matching
 * and pattern matching.
 *
 * @param entity - Entity name
 * @param brief - Research brief with extracted content
 * @param heuristics - Type heuristics to use (defaults to DEFAULT_TYPE_HEURISTICS)
 * @returns Classified entity type (defaults to "produto" if no match)
 */
export function classifyEntityType(
  entity: string,
  brief: ResearchBrief,
  heuristics: TypeHeuristic[] = DEFAULT_TYPE_HEURISTICS
): EntityType {
  // Combine entity name and key findings for classification
  const text = [
    entity,
    ...brief.key_findings,
    ...brief.extracts.map((e) => e.content),
  ].join(" ");

  // Score each type based on matches
  const scores = new Map<EntityType, number>();

  for (const heuristic of heuristics) {
    let score = 0;

    // Keyword matching (case-insensitive)
    for (const keyword of heuristic.keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const matches = text.match(regex);
      if (matches) {
        score += matches.length;
      }
    }

    // Pattern matching
    if (heuristic.patterns) {
      for (const pattern of heuristic.patterns) {
        const matches = text.match(pattern);
        if (matches) {
          score += matches.length * 2; // Patterns weighted higher
        }
      }
    }

    if (score > 0) {
      scores.set(heuristic.type, score);
    }
  }

  // Return type with highest score, or default to "produto"
  if (scores.size === 0) {
    return "produto";
  }

  const sorted = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
}

/**
 * Check field density requirements
 *
 * Validates that the wiki entry meets minimum field density requirements:
 * - ≥3 what_it_offers
 * - ≥2 problems_solved
 * - ≥1 source
 *
 * @param entry - Wiki entry to check
 * @param config - Draft configuration with minimum requirements
 * @returns Field counts and whether requirements are met
 */
export function checkFieldDensity(
  entry: WikiEntry,
  config: DraftConfig = DEFAULT_DRAFT_CONFIG
): { counts: FieldCounts; met: boolean; errors: ValidationError[] } {
  const counts: FieldCounts = {
    what_it_offers: entry.what_it_offers.length,
    problems_solved: entry.problems_solved.length,
    sources: entry.sources.length,
  };

  const errors: ValidationError[] = [];

  if (counts.what_it_offers < config.minWhatItOffers) {
    errors.push({
      field: "what_it_offers",
      rule: "min_items",
      message: `Expected at least ${config.minWhatItOffers} items, got ${counts.what_it_offers}`,
      value: counts.what_it_offers,
    });
  }

  if (counts.problems_solved < config.minProblemsSolved) {
    errors.push({
      field: "problems_solved",
      rule: "min_items",
      message: `Expected at least ${config.minProblemsSolved} items, got ${counts.problems_solved}`,
      value: counts.problems_solved,
    });
  }

  if (counts.sources < config.minSources) {
    errors.push({
      field: "sources",
      rule: "min_items",
      message: `Expected at least ${config.minSources} source, got ${counts.sources}`,
      value: counts.sources,
    });
  }

  return {
    counts,
    met: errors.length === 0,
    errors,
  };
}
