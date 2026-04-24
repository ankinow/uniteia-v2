/**
 * Job Generator Module
 *
 * Generates valid JobSpec objects from minimal input parameters.
 * Includes validation, ID generation, and observability logging.
 */

import { validateFrontmatter, getValidationErrors } from "./schema-validator";
import type { JobSpec, JobSpecInput } from "../types/job";
import {
	DEFAULT_SPEC_VERSION,
	DEFAULT_PIPELINE_VERSION,
	DEFAULT_LOCALE,
	DEFAULT_OUTPUT_DIR,
} from "../types/job";

/**
 * Generate a unique job ID
 *
 * Format: job_<timestamp>_<random>
 * This ensures uniqueness across concurrent executions.
 */
function generateJobId(): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 8);
	return `job_${timestamp}_${random}`;
}

/**
 * Validate job spec input before generation
 *
 * @param input - Job spec input to validate
 * @throws Error if validation fails
 */
function validateInput(input: JobSpecInput): void {
	if (!input.entity || input.entity.trim().length === 0) {
		throw new Error("Entity name is required and cannot be empty");
	}

	if (!input.intent || input.intent.trim().length === 0) {
		throw new Error("Intent is required and cannot be empty");
	}

	// Trim before validation
	const trimmedEntity = input.entity.trim();
	const trimmedIntent = input.intent.trim();

	// Validate entity length (reasonable bounds)
	if (trimmedEntity.length > 200) {
		throw new Error("Entity name exceeds maximum length of 200 characters");
	}

	// Validate intent format (alphanumeric with underscores)
	const validIntentPattern = /^[a-z][a-z0-9_]*$/i;
	if (!validIntentPattern.test(trimmedIntent)) {
		throw new Error(
			"Intent must start with a letter and contain only alphanumeric characters and underscores"
		);
	}
}

/**
 * Generate a complete JobSpec from minimal input
 *
 * @param input - Job spec input parameters
 * @returns Validated JobSpec object
 * @throws Error if input validation fails
 */
export function generateJobSpec(input: JobSpecInput): JobSpec {
	const jobId = generateJobId();
	const now = new Date().toISOString();

	// Validate input
	validateInput(input);

	// Generate job spec with defaults
	const jobSpec: JobSpec = {
		spec: DEFAULT_SPEC_VERSION,
		entity: input.entity.trim(),
		intent: input.intent.trim(),
		locale: input.locale || DEFAULT_LOCALE,
		output: input.output || DEFAULT_OUTPUT_DIR,
		pipeline_version: DEFAULT_PIPELINE_VERSION,
		generated_at: now,
	};

	// Log job generation (observability)
	logJobGeneration(jobId, jobSpec);

	return jobSpec;
}

/**
 * Log job generation for observability
 *
 * @param jobId - Unique job identifier
 * @param jobSpec - Generated job specification
 */
function logJobGeneration(jobId: string, jobSpec: JobSpec): void {
	const logEntry = {
		level: "info",
		timestamp: new Date().toISOString(),
		message: "Job spec generated",
		job_id: jobId,
		entity: jobSpec.entity,
		intent: jobSpec.intent,
		locale: jobSpec.locale,
		output: jobSpec.output,
		spec_version: jobSpec.spec,
	};

	// Log to stderr to not interfere with stdout JSON output
	console.error(JSON.stringify(logEntry));
}

/**
 * Convert JobSpec to JSON string
 *
 * @param jobSpec - Job specification to serialize
 * @returns JSON string representation
 */
export function jobSpecToJson(jobSpec: JobSpec): string {
	return JSON.stringify(jobSpec, null, 2);
}

/**
 * Parse JobSpec from JSON string
 *
 * @param json - JSON string to parse
 * @returns Parsed JobSpec object
 * @throws Error if JSON is invalid or doesn't match JobSpec shape
 */
export function parseJobSpec(json: string): JobSpec {
	let parsed: unknown;

	try {
		parsed = JSON.parse(json);
	} catch (error) {
		throw new Error(
			`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`
		);
	}

	// Basic shape validation
	if (typeof parsed !== "object" || parsed === null) {
		throw new Error("JobSpec must be a non-null object");
	}

	const obj = parsed as Record<string, unknown>;
	const requiredFields: (keyof JobSpec)[] = [
		"spec",
		"entity",
		"intent",
		"locale",
		"output",
		"pipeline_version",
		"generated_at",
	];

	for (const field of requiredFields) {
		if (!(field in obj) || typeof obj[field] !== "string") {
			throw new Error(`Missing or invalid field: ${field}`);
		}
	}

	return obj as JobSpec;
}
