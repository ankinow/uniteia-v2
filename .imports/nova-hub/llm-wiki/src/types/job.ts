/**
 * Job Specification Types
 *
 * Core type definitions for LLM-Wiki job specifications.
 * A JobSpec defines the parameters for a pipeline execution.
 */

/**
 * Job specification for pipeline execution
 *
 * Represents a complete job specification that can be passed to the pipeline
 * orchestrator. Generated from CLI arguments or configuration files.
 */
export interface JobSpec {
	/** Schema version identifier */
	spec: string;
	/** Entity name (product, service, platform) */
	entity: string;
	/** Intent type (wiki_entry, comparison, etc) */
	intent: string;
	/** Locale for output (e.g., pt-BR, en-US) */
	locale: string;
	/** Output directory for generated artifacts */
	output: string;
	/** Pipeline version that generated this job */
	pipeline_version: string;
	/** ISO 8601 timestamp when job was generated */
	generated_at: string;
}

/**
 * Input parameters for generating a JobSpec
 *
 * Minimal input required to create a valid job specification.
 * Optional fields have sensible defaults.
 */
export interface JobSpecInput {
	/** Entity name (required) */
	entity: string;
	/** Intent type (required) */
	intent: string;
	/** Locale for output (default: pt-BR) */
	locale?: string;
	/** Output directory (default: output) */
	output?: string;
}

/**
 * Intent types supported by the pipeline
 */
export type IntentType = "wiki_entry" | "comparison" | "update" | "validation";

/**
 * Supported locale codes
 */
export type LocaleCode = "pt-BR" | "en-US" | "es-ES";

/**
 * Default values for JobSpec generation
 */
export const DEFAULT_SPEC_VERSION = "llm-wiki/1.0.0";
export const DEFAULT_PIPELINE_VERSION = "1.0.0";
export const DEFAULT_LOCALE: LocaleCode = "pt-BR";
export const DEFAULT_OUTPUT_DIR = "output";
