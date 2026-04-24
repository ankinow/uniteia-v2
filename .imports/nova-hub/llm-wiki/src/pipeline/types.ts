/**
 * Pipeline Types and Interfaces
 *
 * Core type definitions for the LLM-Wiki pipeline orchestrator.
 */

// Re-export JobSpec from new location
export type { JobSpec, JobSpecInput } from "../types/job";

/**
 * Stage execution status
 */
export type StageStatus =
	| "pending"
	| "running"
	| "completed"
	| "failed"
	| "skipped";

/**
 * Gate check result
 */
export interface GateResult {
	passed: boolean;
	reason?: string;
	timestamp: string;
}

/**
 * Stage execution result
 */
export interface StageResult {
	stage: number;
	name: string;
	status: StageStatus;
	startedAt: string;
	completedAt?: string;
	duration?: number;
	gateResult?: GateResult;
	error?: string;
	output?: unknown;
}

/**
 * Pipeline execution result
 */
export interface PipelineResult {
	success: boolean;
	jobSpec: JobSpec;
	stages: StageResult[];
	startedAt: string;
	completedAt: string;
	totalDuration: number;
	error?: string;
}

/**
 * Stage definition
 */
export interface Stage {
	id: number;
	name: string;
	description: string;
	execute: (job: JobSpec, context: StageContext) => Promise<unknown>;
	gateCheck?: (job: JobSpec, result: unknown) => Promise<GateResult>;
}

/**
 * Stage execution context
 */
export interface StageContext {
	previousResults: Map<number, unknown>;
	log: (level: string, message: string, data?: unknown) => void;
}

/**
 * Pipeline configuration
 */
export interface PipelineConfig {
	maxRetries: number;
	retryDelayMs: number;
	stopOnFailure: boolean;
	enableMetrics: boolean;
}

/**
 * Default pipeline configuration
 */
export const DEFAULT_CONFIG: PipelineConfig = {
	maxRetries: 0,
	retryDelayMs: 1000,
	stopOnFailure: true,
	enableMetrics: true,
};
