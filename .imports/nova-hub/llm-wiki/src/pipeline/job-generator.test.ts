/**
 * Job Generator Tests
 *
 * Tests for generateJobSpec, validation, and serialization.
 */

import { describe, test, expect } from "bun:test";
import {
	generateJobSpec,
	jobSpecToJson,
	parseJobSpec,
} from "./job-generator";
import type { JobSpecInput } from "../types/job";

describe("generateJobSpec", () => {
	test("generates valid JobSpec with minimal input", () => {
		const input: JobSpecInput = {
			entity: "Test",
			intent: "wiki_entry",
		};

		const jobSpec = generateJobSpec(input);

		expect(jobSpec.spec).toBe("llm-wiki/1.0.0");
		expect(jobSpec.entity).toBe("Test");
		expect(jobSpec.intent).toBe("wiki_entry");
		expect(jobSpec.locale).toBe("pt-BR");
		expect(jobSpec.output).toBe("output");
		expect(jobSpec.pipeline_version).toBe("1.0.0");
		expect(jobSpec.generated_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
	});

	test("generates valid JobSpec with all options", () => {
		const input: JobSpecInput = {
			entity: "Galaxy.ai",
			intent: "comparison",
			locale: "en-US",
			output: "./wiki",
		};

		const jobSpec = generateJobSpec(input);

		expect(jobSpec.entity).toBe("Galaxy.ai");
		expect(jobSpec.intent).toBe("comparison");
		expect(jobSpec.locale).toBe("en-US");
		expect(jobSpec.output).toBe("./wiki");
	});

	test("trims whitespace from entity and intent", () => {
		const input: JobSpecInput = {
			entity: "  Test Entity  ",
			intent: "  wiki_entry  ",
		};

		const jobSpec = generateJobSpec(input);

		expect(jobSpec.entity).toBe("Test Entity");
		expect(jobSpec.intent).toBe("wiki_entry");
	});

	test("throws error for empty entity", () => {
		const input: JobSpecInput = {
			entity: "",
			intent: "wiki_entry",
		};

		expect(() => generateJobSpec(input)).toThrow(
			"Entity name is required and cannot be empty"
		);
	});

	test("throws error for whitespace-only entity", () => {
		const input: JobSpecInput = {
			entity: "   ",
			intent: "wiki_entry",
		};

		expect(() => generateJobSpec(input)).toThrow(
			"Entity name is required and cannot be empty"
		);
	});

	test("throws error for empty intent", () => {
		const input: JobSpecInput = {
			entity: "Test",
			intent: "",
		};

		expect(() => generateJobSpec(input)).toThrow(
			"Intent is required and cannot be empty"
		);
	});

	test("throws error for entity exceeding max length", () => {
		const input: JobSpecInput = {
			entity: "a".repeat(201),
			intent: "wiki_entry",
		};

		expect(() => generateJobSpec(input)).toThrow(
			"Entity name exceeds maximum length of 200 characters"
		);
	});

	test("throws error for invalid intent format", () => {
		const input: JobSpecInput = {
			entity: "Test",
			intent: "invalid-intent!",
		};

		expect(() => generateJobSpec(input)).toThrow(
			"Intent must start with a letter and contain only alphanumeric characters and underscores"
		);
	});

	test("accepts intent with leading/trailing whitespace", () => {
		const input: JobSpecInput = {
			entity: "Test",
			intent: "  wiki_entry  ", // whitespace is trimmed before validation
		};

		const jobSpec = generateJobSpec(input);
		expect(jobSpec.intent).toBe("wiki_entry");
	});

	test("accepts valid intent formats", () => {
		const validIntents = ["wiki_entry", "comparison", "update", "validation", "test123"];

		for (const intent of validIntents) {
			const input: JobSpecInput = {
				entity: "Test",
				intent,
			};

			const jobSpec = generateJobSpec(input);
			expect(jobSpec.intent).toBe(intent);
		}
	});

	test("throws error for intent starting with number", () => {
		const input: JobSpecInput = {
			entity: "Test",
			intent: "1wiki_entry",
		};

		expect(() => generateJobSpec(input)).toThrow(
			"Intent must start with a letter"
		);
	});
});

describe("jobSpecToJson", () => {
	test("serializes JobSpec to formatted JSON", () => {
		const input: JobSpecInput = {
			entity: "Test",
			intent: "wiki_entry",
		};

		const jobSpec = generateJobSpec(input);
		const json = jobSpecToJson(jobSpec);

		expect(json).toContain('"spec": "llm-wiki/1.0.0"');
		expect(json).toContain('"entity": "Test"');
		expect(json).toContain('"intent": "wiki_entry"');
	});

	test("produces valid JSON that can be parsed", () => {
		const input: JobSpecInput = {
			entity: "Test",
			intent: "wiki_entry",
		};

		const jobSpec = generateJobSpec(input);
		const json = jobSpecToJson(jobSpec);
		const parsed = JSON.parse(json);

		expect(parsed.entity).toBe("Test");
		expect(parsed.intent).toBe("wiki_entry");
	});
});

describe("parseJobSpec", () => {
	test("parses valid JobSpec JSON", () => {
		const json = JSON.stringify({
			spec: "llm-wiki/1.0.0",
			entity: "Test",
			intent: "wiki_entry",
			locale: "pt-BR",
			output: "output",
			pipeline_version: "1.0.0",
			generated_at: "2024-01-01T00:00:00.000Z",
		});

		const jobSpec = parseJobSpec(json);

		expect(jobSpec.spec).toBe("llm-wiki/1.0.0");
		expect(jobSpec.entity).toBe("Test");
		expect(jobSpec.intent).toBe("wiki_entry");
	});

	test("throws error for invalid JSON", () => {
		expect(() => parseJobSpec("not json")).toThrow("Invalid JSON");
	});

	test("throws error for null input", () => {
		expect(() => parseJobSpec("null")).toThrow(
			"JobSpec must be a non-null object"
		);
	});

	test("throws error for missing required field", () => {
		const json = JSON.stringify({
			spec: "llm-wiki/1.0.0",
			entity: "Test",
			// missing intent
			locale: "pt-BR",
			output: "output",
			pipeline_version: "1.0.0",
			generated_at: "2024-01-01T00:00:00.000Z",
		});

		expect(() => parseJobSpec(json)).toThrow(
			"Missing or invalid field: intent"
		);
	});

	test("throws error for non-string field", () => {
		const json = JSON.stringify({
			spec: "llm-wiki/1.0.0",
			entity: 123, // should be string
			intent: "wiki_entry",
			locale: "pt-BR",
			output: "output",
			pipeline_version: "1.0.0",
			generated_at: "2024-01-01T00:00:00.000Z",
		});

		expect(() => parseJobSpec(json)).toThrow(
			"Missing or invalid field: entity"
		);
	});
});

describe("round-trip", () => {
	test("JobSpec survives JSON round-trip", () => {
		const input: JobSpecInput = {
			entity: "Galaxy.ai",
			intent: "wiki_entry",
			locale: "en-US",
			output: "./wiki",
		};

		const original = generateJobSpec(input);
		const json = jobSpecToJson(original);
		const parsed = parseJobSpec(json);

		expect(parsed.spec).toBe(original.spec);
		expect(parsed.entity).toBe(original.entity);
		expect(parsed.intent).toBe(original.intent);
		expect(parsed.locale).toBe(original.locale);
		expect(parsed.output).toBe(original.output);
		expect(parsed.pipeline_version).toBe(original.pipeline_version);
		expect(parsed.generated_at).toBe(original.generated_at);
	});
});
