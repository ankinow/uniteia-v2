/**
 * Stage 0: Job Spec Execution
 *
 * Validates input, generates JobSpec, and creates artifact directories.
 * This is the first stage in the pipeline.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { JobSpec, JobSpecInput } from "../types/job";
import { generateJobSpec, jobSpecToJson } from "../pipeline/job-generator";
import type { Stage, StageContext, GateResult } from "../pipeline/types";

/**
 * Generate a URL-safe slug from entity name
 *
 * @param entity - Entity name to slugify
 * @returns URL-safe slug
 */
function generateSlug(entity: string): string {
  return entity
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-") // Collapse multiple dashes
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}

/**
 * Stage 0 output
 */
export interface Stage0Output {
  jobSpec: JobSpec;
  slug: string;
  jobFile: string;
  artifactDir: string;
}

/**
 * Execute Stage 0: Job Spec
 *
 * Validates input, generates JobSpec, creates directories.
 *
 * @param input - Job spec input
 * @param outputDir - Base output directory (default: "output")
 * @returns Stage output with job spec and paths
 */
export async function executeStage0(
  input: JobSpecInput,
  outputDir: string = "output"
): Promise<Stage0Output> {
  // Generate JobSpec (includes validation)
  const jobSpec = generateJobSpec(input);

  // Generate slug for directory naming
  const slug = generateSlug(jobSpec.entity);

  // Define paths
  const jobFile = join(outputDir, "jobs", `${slug}.json`);
  const artifactDir = join(outputDir, "artifacts", slug);

  // Create directories
  await mkdir(join(outputDir, "jobs"), { recursive: true });
  await mkdir(artifactDir, { recursive: true });

  // Write job spec to file
  const jsonContent = jobSpecToJson(jobSpec);
  await writeFile(jobFile, jsonContent, "utf-8");

  // Log creation for observability
  logStage0Completion(jobSpec.spec, slug, jobFile, artifactDir);

  return {
    jobSpec,
    slug,
    jobFile,
    artifactDir,
  };
}

/**
 * Log Stage 0 completion
 */
function logStage0Completion(
  specVersion: string,
  slug: string,
  jobFile: string,
  artifactDir: string
): void {
  const logEntry = {
    level: "info",
    timestamp: new Date().toISOString(),
    message: "Stage 0 completed: Job spec created",
    stage: 0,
    spec_version: specVersion,
    slug,
    job_file: jobFile,
    artifact_dir: artifactDir,
  };
  console.error(JSON.stringify(logEntry));
}

/**
 * Create Stage 0 for pipeline orchestrator
 */
export function createStage0(): Stage {
  return {
    id: 0,
    name: "job-spec",
    description: "Validate input and create job spec with artifact directories",
    execute: async (job: JobSpec, context: StageContext) => {
      // JobSpec is already generated at this point
      // This stage creates the artifact directories
      const slug = generateSlug(job.entity);
      const artifactDir = join(job.output, "artifacts", slug);

      context.log("info", "Creating artifact directories", {
        slug,
        artifactDir,
      });

      await mkdir(join(job.output, "artifacts"), { recursive: true });
      await mkdir(artifactDir, { recursive: true });

      const output: Stage0Output = {
        jobSpec: job,
        slug,
        jobFile: join(job.output, "jobs", `${slug}.json`),
        artifactDir,
      };

      return output;
    },
    gateCheck: async (job: JobSpec, result: unknown): Promise<GateResult> => {
      const output = result as Stage0Output;

      // Verify artifact directory exists
      try {
        const fs = await import("node:fs/promises");
        await fs.access(output.artifactDir);

        return {
          passed: true,
          reason: "Job spec created and artifact directory exists",
          timestamp: new Date().toISOString(),
        };
      } catch {
        return {
          passed: false,
          reason: "Artifact directory was not created",
          timestamp: new Date().toISOString(),
        };
      }
    },
  };
}
