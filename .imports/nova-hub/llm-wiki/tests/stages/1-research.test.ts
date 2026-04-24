/**
 * Stage 1: Research Tests - Comprehensive test suite
 */
import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { executeStage1, createStage1, type Stage1Output, type SearchResult } from "../../src/stages/1-research";
import { generateJobSpec } from "../../src/pipeline/job-generator";
import { FetchError } from "../../src/pipeline/web-fetcher";

describe("executeStage1", () => {
	const testOutputDir = join(process.cwd(), "test-output-stage1");
	let testArtifactDir: string;

	const mockSearchFn = async (query: string, count: number): Promise<SearchResult[]> => {
		const results: SearchResult[] = [];
		for (let i = 0; i < Math.min(count, 5); i++) {
			results.push({ url: `https://example.com/${query.replace(/\s+/g, "-")}-${i}`, title: `Result ${i}`, snippet: `Snippet ${i}` });
		}
		return results;
	};

	const mockFetcherFn = async (url: string): Promise<{ body: string }> => {
		return { body: `<!DOCTYPE html><html><head><title>Test Page</title></head><body><h1>TestEntity Information</h1><p>TestEntity is a fictional product for testing. TestEntity contains multiple sentences about the entity for extraction testing.</p></body></html>` };
	};

	beforeEach(() => {
		if (existsSync(testOutputDir)) rmSync(testOutputDir, { recursive: true, force: true });
		testArtifactDir = join(testOutputDir, "artifacts", "testentity");
	});

	afterEach(() => {
		if (existsSync(testOutputDir)) rmSync(testOutputDir, { recursive: true, force: true });
	});

	test("creates sources.json, extracts.json, and research_brief.md", async () => {
		const job = generateJobSpec({ entity: "TestEntity", intent: "wiki_entry", output: testOutputDir });
		const result = await executeStage1(job, testArtifactDir, { searchFn: mockSearchFn, fetcherFn: mockFetcherFn, minSources: 1 });
		expect(existsSync(result.sourcesFile)).toBe(true);
		expect(existsSync(result.extractsFile)).toBe(true);
		expect(existsSync(result.briefFile)).toBe(true);
	});

	test("generates valid research brief structure", async () => {
		const job = generateJobSpec({ entity: "TestEntity", intent: "wiki_entry", output: testOutputDir });
		const result = await executeStage1(job, testArtifactDir, { searchFn: mockSearchFn, fetcherFn: mockFetcherFn, minSources: 1 });
		expect(result.researchBrief).toHaveProperty("entity");
		expect(result.researchBrief).toHaveProperty("source_count");
		expect(result.researchBrief).toHaveProperty("confidence_score");
	});

	test("generates markdown research brief", async () => {
		const job = generateJobSpec({ entity: "TestEntity", intent: "wiki_entry", output: testOutputDir });
		const result = await executeStage1(job, testArtifactDir, { searchFn: mockSearchFn, fetcherFn: mockFetcherFn, minSources: 1 });
		const briefContent = readFileSync(result.briefFile, "utf-8");
		expect(briefContent).toContain("# Research Brief");
		expect(briefContent).toContain("## Sources");
	});

	test("generates search queries from entity and intent", async () => {
		const queries: string[] = [];
		const capturingSearchFn = async (query: string, count: number) => { queries.push(query); return mockSearchFn(query, count); };
		const job = generateJobSpec({ entity: "OpenAI", intent: "wiki_entry", output: testOutputDir });
		await executeStage1(job, testArtifactDir, { searchFn: capturingSearchFn, fetcherFn: mockFetcherFn, minSources: 1 });
		expect(queries.some(q => q.toLowerCase().includes("openai"))).toBe(true);
	});

	test("calculates relevance scores between 0 and 1", async () => {
		const job = generateJobSpec({ entity: "TestEntity", intent: "wiki_entry", output: testOutputDir });
		const result = await executeStage1(job, testArtifactDir, { searchFn: mockSearchFn, fetcherFn: mockFetcherFn, minSources: 1 });
		for (const extract of result.researchBrief.extracts) {
			expect(extract.relevance_score).toBeGreaterThanOrEqual(0);
			expect(extract.relevance_score).toBeLessThanOrEqual(1);
		}
	});

	test("handles empty search results", async () => {
		const job = generateJobSpec({ entity: "TestEntity", intent: "wiki_entry", output: testOutputDir });
		const result = await executeStage1(job, testArtifactDir, { searchFn: async () => [], minSources: 1 });
		expect(result.researchBrief.source_count).toBe(0);
	});

	test("logs structured JSON", async () => {
		const job = generateJobSpec({ entity: "TestEntity", intent: "wiki_entry", output: testOutputDir });
		const origStderr = process.stderr.write;
		const origStdout = process.stdout.write;
		const calls: string[] = [];
		process.stderr.write = (c: any) => { calls.push(c.toString()); return true; };
		process.stdout.write = (c: any) => { calls.push(c.toString()); return true; };
		try {
			await executeStage1(job, testArtifactDir, { searchFn: mockSearchFn, fetcherFn: mockFetcherFn, minSources: 1 });
			const logs = calls.filter(c => c.includes("level")).map(c => { try { const m = c.match(/\{[^}]*"level"[^}]*\}/); return m ? JSON.parse(m[0]) : null; } catch { return null; } }).filter(e => e);
			expect(logs.length).toBeGreaterThan(0);
		} finally {
			process.stderr.write = origStderr;
			process.stdout.write = origStdout;
		}
	});

	// NEGATIVE TESTS
	test("handles network failures", async () => {
		const job = generateJobSpec({ entity: "TestEntity", intent: "wiki_entry", output: testOutputDir });
		const failSearch = async () => [{ url: "https://example.com/test", title: "Test", snippet: "Test" }];
		const failFetch = async (url: string) => { throw new FetchError("timeout", url, "Timeout"); };
		const result = await executeStage1(job, testArtifactDir, { searchFn: failSearch, fetcherFn: failFetch, minSources: 1 });
		expect(result.researchBrief.source_count).toBe(0);
	});

	test("handles HTTP errors", async () => {
		const job = generateJobSpec({ entity: "TestEntity", intent: "wiki_entry", output: testOutputDir });
		const errSearch = async () => [{ url: "https://example.com/404", title: "404", snippet: "404" }];
		const errFetch = async (url: string) => { throw new FetchError("invalid_response", url, "HTTP 404", 404); };
		const result = await executeStage1(job, testArtifactDir, { searchFn: errSearch, fetcherFn: errFetch, minSources: 1 });
		expect(result.researchBrief.source_count).toBe(0);
	});

	test("handles search function errors", async () => {
		const job = generateJobSpec({ entity: "TestEntity", intent: "wiki_entry", output: testOutputDir });
		const errSearch = async () => { throw new Error("API error"); };
		const result = await executeStage1(job, testArtifactDir, { searchFn: errSearch, fetcherFn: mockFetcherFn, minSources: 1 });
		expect(result.researchBrief.source_count).toBe(0);
	});

	test("handles duplicate URLs", async () => {
		const job = generateJobSpec({ entity: "TestEntity", intent: "wiki_entry", output: testOutputDir });
		const dupSearch = async () => [{ url: "https://example.com/same", title: "Same", snippet: "Same" }];
		const result = await executeStage1(job, testArtifactDir, { searchFn: dupSearch, fetcherFn: mockFetcherFn, minSources: 1 });
		expect(result.researchBrief.source_count).toBe(1);
	});

	test("handles malformed HTML", async () => {
		const job = generateJobSpec({ entity: "TestEntity", intent: "wiki_entry", output: testOutputDir });
		const malSearch = async () => [{ url: "https://example.com/test", title: "Test", snippet: "Test" }];
		const malFetch = async () => ({ body: "<html><body><p>Unclosed" });
		const result = await executeStage1(job, testArtifactDir, { searchFn: malSearch, fetcherFn: malFetch, minSources: 1 });
		expect(result.researchBrief.source_count).toBe(1);
	});

	test("handles empty response body", async () => {
		const job = generateJobSpec({ entity: "TestEntity", intent: "wiki_entry", output: testOutputDir });
		const emptySearch = async () => [{ url: "https://example.com/test", title: "Test", snippet: "Test" }];
		const emptyFetch = async () => ({ body: "" });
		const result = await executeStage1(job, testArtifactDir, { searchFn: emptySearch, fetcherFn: emptyFetch, minSources: 1 });
		expect(result.researchBrief.source_count).toBe(1);
	});
});

describe("createStage1", () => {
	const testOutputDir = join(process.cwd(), "test-output-stage1-create");
	beforeEach(() => { if (existsSync(testOutputDir)) rmSync(testOutputDir, { recursive: true, force: true }); });
	afterEach(() => { if (existsSync(testOutputDir)) rmSync(testOutputDir, { recursive: true, force: true }); });

	test("creates valid Stage object", () => {
		const stage = createStage1();
		expect(stage.id).toBe(1);
		expect(stage.name).toBe("research");
		expect(typeof stage.execute).toBe("function");
	});

	test("execute creates artifacts", async () => {
		const stage = createStage1({ searchFn: async () => [{ url: "https://example.com/test", title: "Test", snippet: "Test" }], fetcherFn: async () => ({ body: "<html><body>Test</body></html>" }) });
		const job = generateJobSpec({ entity: "StageTest", intent: "wiki_entry", output: testOutputDir });
		const result = await stage.execute(job, { previousResults: new Map(), log: () => {} }) as Stage1Output;
		expect(result).toHaveProperty("researchBrief");
	});

	test("gateCheck passes with sufficient sources", async () => {
		const stage = createStage1({ minSources: 2, minSuccessRate: 0.5 });
		const mockOutput: Stage1Output = { researchBrief: { entity: "Test", generated_at: new Date().toISOString(), source_count: 5, successful_extractions: 4, confidence_score: 0.8, sources: [], extracts: [], key_findings: [] }, sourcesFile: "/test/s.json", extractsFile: "/test/e.json", briefFile: "/test/b.md", artifactDir: "/test" };
		const job = generateJobSpec({ entity: "Test", intent: "wiki_entry" });
		expect((await stage.gateCheck!(job, mockOutput)).passed).toBe(true);
	});

	test("gateCheck fails with insufficient sources", async () => {
		const stage = createStage1({ minSources: 5 });
		const mockOutput: Stage1Output = { researchBrief: { entity: "Test", generated_at: new Date().toISOString(), source_count: 3, successful_extractions: 3, confidence_score: 1.0, sources: [], extracts: [], key_findings: [] }, sourcesFile: "/test/s.json", extractsFile: "/test/e.json", briefFile: "/test/b.md", artifactDir: "/test" };
		const job = generateJobSpec({ entity: "Test", intent: "wiki_entry" });
		expect((await stage.gateCheck!(job, mockOutput)).passed).toBe(false);
	});

	test("gateCheck fails with low success rate", async () => {
		const stage = createStage1({ minSources: 1, minSuccessRate: 0.9 });
		const mockOutput: Stage1Output = { researchBrief: { entity: "Test", generated_at: new Date().toISOString(), source_count: 5, successful_extractions: 2, confidence_score: 0.4, sources: [], extracts: [], key_findings: [] }, sourcesFile: "/test/s.json", extractsFile: "/test/e.json", briefFile: "/test/b.md", artifactDir: "/test" };
		const job = generateJobSpec({ entity: "Test", intent: "wiki_entry" });
		expect((await stage.gateCheck!(job, mockOutput)).passed).toBe(false);
	});

	test("gateCheck fails with zero sources", async () => {
		const stage = createStage1({ minSources: 1 });
		const mockOutput: Stage1Output = { researchBrief: { entity: "Test", generated_at: new Date().toISOString(), source_count: 0, successful_extractions: 0, confidence_score: 0, sources: [], extracts: [], key_findings: [] }, sourcesFile: "/test/s.json", extractsFile: "/test/e.json", briefFile: "/test/b.md", artifactDir: "/test" };
		const job = generateJobSpec({ entity: "Test", intent: "wiki_entry" });
		expect((await stage.gateCheck!(job, mockOutput)).passed).toBe(false);
	});
});

describe("integration", () => {
	const testOutputDir = join(process.cwd(), "test-output-stage1-int");
	beforeEach(() => { if (existsSync(testOutputDir)) rmSync(testOutputDir, { recursive: true, force: true }); });
	afterEach(() => { if (existsSync(testOutputDir)) rmSync(testOutputDir, { recursive: true, force: true }); });

	test("works with JobSpec pipeline", async () => {
		const job = generateJobSpec({ entity: "IntegrationTest", intent: "wiki_entry", locale: "en-US", output: testOutputDir });
		const result = await executeStage1(job, join(testOutputDir, "artifacts", "test"), { searchFn: async () => [{ url: "https://example.com/test", title: "Test", snippet: "Test" }], fetcherFn: async () => ({ body: "<html><body>IntegrationTest</body></html>" }), minSources: 1 });
		expect(result.researchBrief.entity).toBe("IntegrationTest");
	});
});

describe("query generation", () => {
	test("generates queries with entity", async () => {
		const queries: string[] = [];
		await executeStage1(generateJobSpec({ entity: "GPT-4", intent: "analysis", output: "/tmp" }), "/tmp", { searchFn: async (q) => { queries.push(q); return []; }, minSources: 1 });
		expect(queries.some(q => q.includes("GPT-4"))).toBe(true);
	});

	test("replaces underscores in intent", async () => {
		const queries: string[] = [];
		await executeStage1(generateJobSpec({ entity: "Test", intent: "comprehensive_review", output: "/tmp" }), "/tmp", { searchFn: async (q) => { queries.push(q); return []; }, minSources: 1 });
		expect(queries.some(q => q.includes("comprehensive review"))).toBe(true);
	});
});

describe("source classification", () => {
	test("classifies news URLs", async () => {
		const job = generateJobSpec({ entity: "Test", intent: "wiki_entry", output: "/tmp" });
		const result = await executeStage1(job, "/tmp", { searchFn: async () => [{ url: "https://reuters.com/article", title: "News", snippet: "News" }], fetcherFn: async () => ({ body: "<html><body>News</body></html>" }), minSources: 1 });
		expect(result.researchBrief.sources[0].kind).toBe("news");
	});

	test("classifies academic URLs", async () => {
		const job = generateJobSpec({ entity: "Test", intent: "wiki_entry", output: "/tmp" });
		const result = await executeStage1(job, "/tmp", { searchFn: async () => [{ url: "https://arxiv.org/abs/123", title: "Paper", snippet: "Academic" }], fetcherFn: async () => ({ body: "<html><body>Academic</body></html>" }), minSources: 1 });
		expect(result.researchBrief.sources[0].kind).toBe("academic");
	});
});
