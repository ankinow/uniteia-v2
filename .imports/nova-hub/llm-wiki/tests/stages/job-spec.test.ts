/**
 * Stage 0: Job Spec Tests
 *
 * Tests for job spec validation, directory creation, and file output.
 */

import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { executeStage0, createStage0 } from "../../src/stages/0-job-spec";
import type { JobSpecInput } from "../../src/types/job";
import { generateJobSpec } from "../../src/pipeline/job-generator";

describe("executeStage0", () => {
  const testOutputDir = join(process.cwd(), "test-output-stage0");

  beforeEach(() => {
    // Clean up test directory before each test
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up test directory after each test
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  test("creates job file and artifact directory", async () => {
    const input: JobSpecInput = {
      entity: "TestEntity",
      intent: "wiki_entry",
    };

    const result = await executeStage0(input, testOutputDir);

    // Verify slug generation
    expect(result.slug).toBe("testentity");

    // Verify paths
    expect(result.jobFile).toBe(join(testOutputDir, "jobs", "testentity.json"));
    expect(result.artifactDir).toBe(
      join(testOutputDir, "artifacts", "testentity")
    );

    // Verify job file exists and contains valid JSON
    expect(existsSync(result.jobFile)).toBe(true);
    const jobContent = readFileSync(result.jobFile, "utf-8");
    const parsedJob = JSON.parse(jobContent);
    expect(parsedJob.entity).toBe("TestEntity");
    expect(parsedJob.intent).toBe("wiki_entry");

    // Verify artifact directory exists
    expect(existsSync(result.artifactDir)).toBe(true);

    // Verify job spec in output
    expect(result.jobSpec.entity).toBe("TestEntity");
    expect(result.jobSpec.intent).toBe("wiki_entry");
  });

  test("generates slug from entity with spaces", async () => {
    const input: JobSpecInput = {
      entity: "Test Entity Name",
      intent: "wiki_entry",
    };

    const result = await executeStage0(input, testOutputDir);

    expect(result.slug).toBe("test-entity-name");
    expect(result.jobFile).toContain("test-entity-name.json");
    expect(result.artifactDir).toContain("test-entity-name");
  });

  test("generates slug from entity with special characters", async () => {
    const input: JobSpecInput = {
      entity: "Test.Entity!@#$%",
      intent: "wiki_entry",
    };

    const result = await executeStage0(input, testOutputDir);

    // Special characters should be removed
    expect(result.slug).toBe("testentity");
  });

  test("creates nested directories recursively", async () => {
    const input: JobSpecInput = {
      entity: "NestedTest",
      intent: "wiki_entry",
    };

    // Use a nested output path
    const nestedOutput = join(testOutputDir, "deep", "nested", "path");
    const result = await executeStage0(input, nestedOutput);

    // Verify nested directories were created
    expect(existsSync(result.jobFile)).toBe(true);
    expect(existsSync(result.artifactDir)).toBe(true);
  });

  test("uses custom locale and output from input", async () => {
    const input: JobSpecInput = {
      entity: "CustomLocale",
      intent: "wiki_entry",
      locale: "en-US",
      output: "./custom-output",
    };

    const result = await executeStage0(input, testOutputDir);

    // Verify job spec has custom locale
    expect(result.jobSpec.locale).toBe("en-US");
  });

  test("throws error for empty entity", async () => {
    const input: JobSpecInput = {
      entity: "",
      intent: "wiki_entry",
    };

    await expect(executeStage0(input, testOutputDir)).rejects.toThrow(
      "Entity name is required and cannot be empty"
    );
  });

  test("throws error for empty intent", async () => {
    const input: JobSpecInput = {
      entity: "TestEntity",
      intent: "",
    };

    await expect(executeStage0(input, testOutputDir)).rejects.toThrow(
      "Intent is required and cannot be empty"
    );
  });

  test("throws error for invalid intent format", async () => {
    const input: JobSpecInput = {
      entity: "TestEntity",
      intent: "invalid-intent!",
    };

    await expect(executeStage0(input, testOutputDir)).rejects.toThrow(
      "Intent must start with a letter"
    );
  });

  test("handles entity with leading/trailing whitespace", async () => {
    const input: JobSpecInput = {
      entity: "  TestEntity  ",
      intent: "wiki_entry",
    };

    const result = await executeStage0(input, testOutputDir);

    // Whitespace should be trimmed
    expect(result.jobSpec.entity).toBe("TestEntity");
    expect(result.slug).toBe("testentity");
  });

  test("returns valid Stage0Output structure", async () => {
    const input: JobSpecInput = {
      entity: "OutputTest",
      intent: "wiki_entry",
    };

    const result = await executeStage0(input, testOutputDir);

    // Verify all output fields are present
    expect(result).toHaveProperty("jobSpec");
    expect(result).toHaveProperty("slug");
    expect(result).toHaveProperty("jobFile");
    expect(result).toHaveProperty("artifactDir");

    // Verify job spec structure
    expect(result.jobSpec).toHaveProperty("spec");
    expect(result.jobSpec).toHaveProperty("entity");
    expect(result.jobSpec).toHaveProperty("intent");
    expect(result.jobSpec).toHaveProperty("locale");
    expect(result.jobSpec).toHaveProperty("output");
    expect(result.jobSpec).toHaveProperty("pipeline_version");
    expect(result.jobSpec).toHaveProperty("generated_at");
  });
});

describe("createStage0", () => {
  test("creates valid Stage object", () => {
    const stage = createStage0();

    expect(stage.id).toBe(0);
    expect(stage.name).toBe("job-spec");
    expect(stage.description).toContain("Validate input");
    expect(typeof stage.execute).toBe("function");
    expect(stage.gateCheck).toBeDefined();
  });

  test("execute creates artifact directories", async () => {
    const stage = createStage0();
    const testOutputDir = join(process.cwd(), "test-output-stage");
    const job = generateJobSpec({
      entity: "StageTest",
      intent: "wiki_entry",
      output: testOutputDir,
    });

    // Mock context
    const context = {
      previousResults: new Map(),
      log: () => {},
    };

    const result = await stage.execute(job, context);

    // Clean up
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }

    expect(result).toHaveProperty("jobSpec");
    expect(result).toHaveProperty("slug");
    expect(result).toHaveProperty("artifactDir");
  });

  test("gateCheck passes when artifact directory exists", async () => {
    const stage = createStage0();
    const testOutputDir = join(process.cwd(), "test-output-gate");
    const job = generateJobSpec({
      entity: "GateTest",
      intent: "wiki_entry",
      output: testOutputDir,
    });

    // Execute stage to create directories
    const context = {
      previousResults: new Map(),
      log: () => {},
    };

    const result = await stage.execute(job, context);

    // Run gate check
    const gateResult = await stage.gateCheck!(job, result);

    // Clean up
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }

    expect(gateResult.passed).toBe(true);
    expect(gateResult.reason).toContain("artifact directory exists");
  });

  test("gateCheck fails when artifact directory missing", async () => {
    const stage = createStage0();

    const result = {
      jobSpec: {} as any,
      slug: "test",
      jobFile: "/test/job.json",
      artifactDir: "/nonexistent/path",
    };

    const job = generateJobSpec({
      entity: "GateFailTest",
      intent: "wiki_entry",
    });

    const gateResult = await stage.gateCheck!(job, result);

    expect(gateResult.passed).toBe(false);
    expect(gateResult.reason).toContain("not created");
  });
});

describe("slug generation edge cases", () => {
  const testOutputDir = join(process.cwd(), "test-output-slug");

  beforeEach(() => {
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    if (existsSync(testOutputDir)) {
      rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  test("handles consecutive special characters", async () => {
    const input: JobSpecInput = {
      entity: "Test!!!Entity###Name",
      intent: "wiki_entry",
    };

    const result = await executeStage0(input, testOutputDir);
    expect(result.slug).toBe("testentityname");
  });

  test("handles multiple spaces", async () => {
    const input: JobSpecInput = {
      entity: "Test    Entity    Name",
      intent: "wiki_entry",
    };

    const result = await executeStage0(input, testOutputDir);
    expect(result.slug).toBe("test-entity-name");
  });

  test("handles mixed case", async () => {
    const input: JobSpecInput = {
      entity: "TeStEnTiTyNaMe",
      intent: "wiki_entry",
    };

    const result = await executeStage0(input, testOutputDir);
    expect(result.slug).toBe("testentityname");
  });

  test("handles underscores and hyphens", async () => {
    const input: JobSpecInput = {
      entity: "Test_Entity-Name",
      intent: "wiki_entry",
    };

    const result = await executeStage0(input, testOutputDir);
    // Underscores and hyphens should be preserved
    expect(result.slug).toBe("test_entity-name");
  });
});
