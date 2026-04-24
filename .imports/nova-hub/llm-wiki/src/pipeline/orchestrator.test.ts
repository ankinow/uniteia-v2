/**
 * Test: Pipeline Orchestrator executes stages 0-1 without crash
 */

import { test, expect, describe } from "bun:test";
import { Orchestrator, createStage } from "./orchestrator";
import type { JobSpec, StageContext } from "./types";

describe("Orchestrator", () => {
  test("run(job) executes stages 0-1 without crash", async () => {
    // Create mock job spec
    const mockJob: JobSpec = {
      spec: "llm-wiki/1.0.0",
      entity: "Test",
      intent: "wiki_entry",
      locale: "pt-BR",
      output: "output",
      pipeline_version: "1.0.0",
      generated_at: new Date().toISOString(),
    };

    // Create orchestrator
    const orchestrator = new Orchestrator();

    // Stage 0: Validation stage
    const stage0 = createStage(
      0,
      "validation",
      "Validates job spec",
      async (job: JobSpec, context: StageContext) => {
        context.log("info", "Validating job spec");
        return { valid: true, entity: job.entity };
      },
      async (_job: JobSpec, result: unknown) => {
        const r = result as { valid: boolean };
        return {
          passed: r.valid,
          reason: r.valid ? undefined : "Job spec validation failed",
          timestamp: new Date().toISOString(),
        };
      }
    );

    // Stage 1: Setup stage
    const stage1 = createStage(
      1,
      "setup",
      "Sets up pipeline environment",
      async (job: JobSpec, context: StageContext) => {
        context.log("info", "Setting up environment");
        // Access previous stage result
        const stage0Result = context.previousResults.get(0);
        return { setup: true, entity: (stage0Result as any)?.entity };
      }
    );

    // Register stages
    orchestrator.register(stage0);
    orchestrator.register(stage1);

    // Run pipeline
    const result = await orchestrator.run(mockJob);

    // Verify no crash and stages executed
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.stages).toHaveLength(2);
    expect(result.stages[0].status).toBe("completed");
    expect(result.stages[1].status).toBe("completed");
    expect(result.totalDuration).toBeGreaterThanOrEqual(0);
  });

  test("logs stage start/end and gate pass/fail", async () => {
    const mockJob: JobSpec = {
      spec: "llm-wiki/1.0.0",
      entity: "Test",
      intent: "wiki_entry",
      locale: "pt-BR",
      output: "output",
      pipeline_version: "1.0.0",
      generated_at: new Date().toISOString(),
    };

    // Capture logs
    const logs: any[] = [];
    const originalLog = console.log;
    console.log = (msg: string) => {
      try {
        logs.push(JSON.parse(msg));
      } catch {
        logs.push({ message: msg });
      }
    };

    try {
      const orchestrator = new Orchestrator();

      const stage0 = createStage(
        0,
        "test_stage",
        "Test stage",
        async () => ({ result: "ok" }),
        async () => ({
          passed: true,
          reason: undefined,
          timestamp: new Date().toISOString(),
        })
      );

      orchestrator.register(stage0);
      await orchestrator.run(mockJob);

      // Verify logs contain stage start/end and gate pass/fail
      const stageStartLogs = logs.filter((l) => l.message?.includes("started"));
      const stageEndLogs = logs.filter((l) => l.message?.includes("ended"));
      const gateLogs = logs.filter((l) => l.message?.includes("Gate check"));

      expect(stageStartLogs.length).toBeGreaterThan(0);
      expect(stageEndLogs.length).toBeGreaterThan(0);
      expect(gateLogs.length).toBeGreaterThan(0);

      // Verify gate log shows pass
      const gateLog = gateLogs[0];
      expect(gateLog.data?.passed).toBe(true);
    } finally {
      console.log = originalLog;
    }
  });

  test("handles stage failure gracefully", async () => {
    const mockJob: JobSpec = {
      spec: "llm-wiki/1.0.0",
      entity: "Test",
      intent: "wiki_entry",
      locale: "pt-BR",
      output: "output",
      pipeline_version: "1.0.0",
      generated_at: new Date().toISOString(),
    };

    const orchestrator = new Orchestrator();

    const failingStage = createStage(
      0,
      "failing_stage",
      "A stage that fails",
      async () => {
        throw new Error("Intentional failure for testing");
      }
    );

    orchestrator.register(failingStage);
    const result = await orchestrator.run(mockJob);

    expect(result.success).toBe(false);
    expect(result.stages[0].status).toBe("failed");
    expect(result.stages[0].error).toContain("Intentional failure");
  });

  test("gate check failure marks stage as failed", async () => {
    const mockJob: JobSpec = {
      spec: "llm-wiki/1.0.0",
      entity: "Test",
      intent: "wiki_entry",
      locale: "pt-BR",
      output: "output",
      pipeline_version: "1.0.0",
      generated_at: new Date().toISOString(),
    };

    const orchestrator = new Orchestrator();

    const stageWithFailingGate = createStage(
      0,
      "gate_fail_stage",
      "Stage with failing gate",
      async () => ({ value: 42 }),
      async () => ({
        passed: false,
        reason: "Gate check rejected the result",
        timestamp: new Date().toISOString(),
      })
    );

    orchestrator.register(stageWithFailingGate);
    const result = await orchestrator.run(mockJob);

    expect(result.success).toBe(false);
    expect(result.stages[0].status).toBe("failed");
    expect(result.stages[0].gateResult?.passed).toBe(false);
    expect(result.error).toContain("Gate check failed");
  });
});
