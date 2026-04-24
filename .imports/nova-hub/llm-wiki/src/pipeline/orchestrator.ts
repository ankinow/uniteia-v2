/**
 * Pipeline Orchestrator
 * 
 * Executes stages sequentially with gate checks and observability.
 */

import type {
  JobSpec,
  Stage,
  StageResult,
  StageStatus,
  PipelineResult,
  PipelineConfig,
  StageContext,
  GateResult,
} from "./types";
import { DEFAULT_CONFIG } from "./types";

/**
 * Orchestrator for executing pipeline stages
 */
export class Orchestrator {
  private stages: Stage[] = [];
  private config: PipelineConfig;

  constructor(config: Partial<PipelineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Register a stage in the pipeline
   */
  register(stage: Stage): void {
    this.stages.push(stage);
    // Sort stages by ID to ensure sequential execution
    this.stages.sort((a, b) => a.id - b.id);
  }

  /**
   * Run the pipeline with the given job spec
   */
  async run(job: JobSpec): Promise<PipelineResult> {
    const startTime = Date.now();
    const startedAt = new Date().toISOString();
    const results: StageResult[] = [];
    const previousResults = new Map<number, unknown>();

    this.log("info", "Pipeline started", {
      entity: job.entity,
      intent: job.intent,
      totalStages: this.stages.length,
    });

    let success = true;
    let error: string | undefined;

    for (const stage of this.stages) {
      const stageResult = await this.executeStage(
        stage,
        job,
        previousResults
      );
      
      results.push(stageResult);

      if (stageResult.status === "failed") {
        success = false;
        error = `Stage ${stage.id} (${stage.name}) failed: ${stageResult.error}`;
        
        if (this.config.stopOnFailure) {
          this.log("error", "Pipeline stopped due to stage failure", {
            stageId: stage.id,
            stageName: stage.name,
            error: stageResult.error,
          });
          break;
        }
      }

      // Store result for next stages
      if (stageResult.output !== undefined) {
        previousResults.set(stage.id, stageResult.output);
      }
    }

    const endTime = Date.now();
    const completedAt = new Date().toISOString();
    const totalDuration = endTime - startTime;

    this.log("info", "Pipeline completed", {
      success,
      totalDuration,
      stagesCompleted: results.filter((r) => r.status === "completed").length,
      stagesFailed: results.filter((r) => r.status === "failed").length,
    });

    return {
      success,
      jobSpec: job,
      stages: results,
      startedAt,
      completedAt,
      totalDuration,
      error,
    };
  }

  /**
   * Execute a single stage with gate check
   */
  private async executeStage(
    stage: Stage,
    job: JobSpec,
    previousResults: Map<number, unknown>
  ): Promise<StageResult> {
    const startedAt = new Date().toISOString();
    const startTime = Date.now();

    this.log("info", `Stage ${stage.id} started`, {
      stageId: stage.id,
      stageName: stage.name,
    });

    const context: StageContext = {
      previousResults,
      log: (level, message, data) => this.log(level, message, data),
    };

    let status: StageStatus = "pending";
    let output: unknown;
    let gateResult: GateResult | undefined;
    let error: string | undefined;

    try {
      // Execute the stage
      output = await stage.execute(job, context);
      status = "completed";

      // Run gate check if defined
      if (stage.gateCheck) {
        gateResult = await stage.gateCheck(job, output);
        
        this.log("info", `Gate check for stage ${stage.id}`, {
          stageId: stage.id,
          passed: gateResult.passed,
          reason: gateResult.reason,
        });

        if (!gateResult.passed) {
          status = "failed";
          error = `Gate check failed: ${gateResult.reason}`;
        }
      }
    } catch (err) {
      status = "failed";
      error = err instanceof Error ? err.message : String(err);
      
      this.log("error", `Stage ${stage.id} failed with exception`, {
        stageId: stage.id,
        stageName: stage.name,
        error,
      });
    }

    const endTime = Date.now();
    const completedAt = new Date().toISOString();
    const duration = endTime - startTime;

    this.log("info", `Stage ${stage.id} ended`, {
      stageId: stage.id,
      stageName: stage.name,
      status,
      duration,
    });

    return {
      stage: stage.id,
      name: stage.name,
      status,
      startedAt,
      completedAt,
      duration,
      gateResult,
      error,
      output,
    };
  }

  /**
   * Structured logging for observability
   */
  private log(level: string, message: string, data?: unknown): void {
    const logEntry = {
      level,
      timestamp: new Date().toISOString(),
      message,
      ...(data !== undefined && { data }),
    };
    console.log(JSON.stringify(logEntry));
  }
}

/**
 * Create a basic stage
 */
export function createStage(
  id: number,
  name: string,
  description: string,
  execute: Stage["execute"],
  gateCheck?: Stage["gateCheck"]
): Stage {
  return {
    id,
    name,
    description,
    execute,
    gateCheck,
  };
}
