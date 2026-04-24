/**
 * Stage 1: Research
 *
 * Collects 5-10 web sources for a given entity, extracts structured evidence
 * from each, and generates research_brief.md artifact. Implements the Stage
 * interface for orchestrator integration.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { JobSpec } from "../types/job";
import type { Stage, StageContext, GateResult } from "../pipeline/types";
import type { Source, Extract, ResearchBrief, SourceKind } from "../types/evidence";
import { fetchUrl, parseHtml, FetchError } from "../pipeline/web-fetcher";

/**
 * Search result from web search
 */
export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
}

/**
 * Web search function type (injected for testability)
 */
export type WebSearchFn = (query: string, count: number) => Promise<SearchResult[]>;

/**
 * Stage 1 output
 */
export interface Stage1Output {
  /** Generated research brief */
  researchBrief: ResearchBrief;
  /** Path to sources.json */
  sourcesFile: string;
  /** Path to extracts.json */
  extractsFile: string;
  /** Path to research_brief.md */
  briefFile: string;
  /** Artifact directory */
  artifactDir: string;
}

/**
 * Stage 1 configuration
 */
export interface Stage1Config {
  /** Minimum number of sources to collect (default: 5) */
  minSources: number;
  /** Maximum number of sources to collect (default: 10) */
  maxSources: number;
  /** Minimum extraction success rate (default: 0.8) */
  minSuccessRate: number;
  /** Web search function (uses default if not provided) */
  searchFn?: WebSearchFn;
  /** Fetcher function (uses default fetchUrl if not provided) */
  fetcherFn?: (url: string) => Promise<{ body: string }>;
}

/**
 * Default Stage 1 configuration
 */
const DEFAULT_CONFIG: Stage1Config = {
  minSources: 5,
  maxSources: 10,
  minSuccessRate: 0.8,
};

/**
 * Generate search queries from entity and intent
 */
function generateSearchQueries(entity: string, intent: string): string[] {
  const queries: string[] = [];
  
  // Primary query
  queries.push(`${entity} ${intent.replace(/_/g, " ")}`);
  
  // Official sources
  queries.push(`${entity} official website`);
  
  // News and reviews
  queries.push(`${entity} news review`);
  
  // Technical details
  queries.push(`${entity} features specifications`);
  
  return queries;
}

/**
 * Classify source based on URL and content
 */
function classifySource(url: string, title?: string): SourceKind {
  const urlLower = url.toLowerCase();
  const titleLower = title?.toLowerCase() || "";
  
  // Check for official sources
  if (
    urlLower.includes("official") ||
    titleLower.includes("official") ||
    urlLower.includes(".com") && !urlLower.includes("news") && !urlLower.includes("blog")
  ) {
    return "official";
  }
  
  // Check for news
  if (
    urlLower.includes("news") ||
    urlLower.includes("reuters") ||
    urlLower.includes("bbc") ||
    urlLower.includes("cnn") ||
    titleLower.includes("news")
  ) {
    return "news";
  }
  
  // Check for blog
  if (
    urlLower.includes("blog") ||
    urlLower.includes("medium") ||
    urlLower.includes("substack")
  ) {
    return "blog";
  }
  
  // Check for review
  if (
    urlLower.includes("review") ||
    titleLower.includes("review")
  ) {
    return "review";
  }
  
  // Check for academic
  if (
    urlLower.includes("arxiv") ||
    urlLower.includes("scholar") ||
    urlLower.includes(".edu")
  ) {
    return "academic";
  }
  
  // Check for documentation
  if (
    urlLower.includes("docs") ||
    urlLower.includes("documentation") ||
    urlLower.includes("wiki")
  ) {
    return "documentation";
  }
  
  // Check for social
  if (
    urlLower.includes("twitter") ||
    urlLower.includes("reddit") ||
    urlLower.includes("facebook")
  ) {
    return "social";
  }
  
  // Default to primary
  return "primary";
}

/**
 * Calculate relevance score based on content and query
 */
function calculateRelevanceScore(
  content: string,
  entity: string,
  intent: string
): number {
  let score = 0.5; // Base score
  
  const contentLower = content.toLowerCase();
  const entityLower = entity.toLowerCase();
  const intentTerms = intent.replace(/_/g, " ").toLowerCase().split(" ");
  
  // Entity mentions boost
  const entityMatches = (contentLower.match(new RegExp(entityLower, "g")) || []).length;
  score += Math.min(entityMatches * 0.1, 0.3);
  
  // Intent term matches
  for (const term of intentTerms) {
    if (contentLower.includes(term)) {
      score += 0.05;
    }
  }
  
  // Cap at 1.0
  return Math.min(score, 1.0);
}

/**
 * Default web search implementation
 * Uses Brave Search API via environment or fallback
 */
async function defaultWebSearch(query: string, count: number): Promise<SearchResult[]> {
  // This is a placeholder - in production, this would integrate with
  // a real search API. For now, we'll use a simple approach that
  // can be mocked in tests.
  
  // Note: This function will be called in production with actual
  // search API integration. For testing, this is mocked.
  const results: SearchResult[] = [];
  
  // Placeholder: In real implementation, this would call search API
  // For now, return empty to indicate search needs to be injected
  console.error(JSON.stringify({
    level: "warn",
    timestamp: new Date().toISOString(),
    message: "Default web search called - no results without injected search function",
    query,
    count,
  }));
  
  return results;
}

/**
 * Fetcher function type (injected for testability)
 */
export type FetcherFn = (url: string) => Promise<{ body: string; charset: string }>;

/**
 * Execute Stage 1: Research
 *
 * Collects web sources, extracts evidence, generates research brief.
 *
 * @param job - Job specification
 * @param artifactDir - Artifact directory path
 * @param config - Optional configuration overrides
 * @returns Stage output with research brief and paths
 */
export async function executeStage1(
  job: JobSpec,
  artifactDir: string,
  config: Partial<Stage1Config> = {}
): Promise<Stage1Output> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const searchFn = config.searchFn || defaultWebSearch;
  
  const sources: Source[] = [];
  const extracts: Extract[] = [];
  const errors: Array<{ url: string; error: string }> = [];
  
  // Generate search queries
  const queries = generateSearchQueries(job.entity, job.intent);
  
  logStage1Start(job.spec, job.entity, queries);
  
  // Search and collect URLs
  const seenUrls = new Set<string>();
  for (const query of queries) {
    if (seenUrls.size >= finalConfig.maxSources) break;
    
    try {
      const searchResults = await searchFn(query, finalConfig.maxSources - seenUrls.size);
      
      for (const result of searchResults) {
        if (seenUrls.has(result.url)) continue;
        seenUrls.add(result.url);
        
        // Fetch and extract
        try {
          let body: string;
          let parseResult: ReturnType<typeof parseHtml>;
          
          if (config.fetcherFn) {
            // Use injected fetcher (for testing)
            const fetchResult = await config.fetcherFn(result.url);
            body = fetchResult.body;
            parseResult = parseHtml(body);
          } else {
            // Use production fetcher
            const fetchResult = await fetchUrl(result.url);
            parseResult = parseHtml(fetchResult.body);
          }
          
          // Create source
          const source: Source = {
            url: result.url,
            kind: classifySource(result.url, parseResult.title),
            accessed_at: new Date().toISOString(),
            excerpt_id: `ex_${String(extracts.length + 1).padStart(3, "0")}`,
            title: parseResult.title,
          };
          sources.push(source);
          
          // Create extract
          const extract: Extract = {
            source_id: source.excerpt_id!,
            title: parseResult.title,
            content: parseResult.excerpt,
            relevance_score: calculateRelevanceScore(parseResult.fullText, job.entity, job.intent),
            status: "success",
            extracted_at: new Date().toISOString(),
            metadata: {
              word_count: parseResult.wordCount,
              charset: parseResult.charset,
            },
          };
          extracts.push(extract);
          
          logExtractionSuccess(result.url, source.kind, parseResult.wordCount);
          
        } catch (err) {
          const errorMsg = err instanceof FetchError ? err.message : 
            (err instanceof Error ? err.message : String(err));
          errors.push({ url: result.url, error: errorMsg });
          logExtractionFailure(result.url, errorMsg);
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logStage1Error("search_failed", query, errorMsg);
    }
  }
  
  // Calculate metrics
  const successCount = extracts.filter(e => e.status === "success").length;
  const failCount = extracts.filter(e => e.status === "failed").length;
  const successRate = sources.length > 0 ? successCount / sources.length : 0;
  
  // Generate key findings from extracts
  const keyFindings: string[] = [];
  for (const extract of extracts.filter(e => e.status === "success")) {
    // Extract first significant sentence as key finding
    const sentences = extract.content.split(/[.!?]+/).filter(s => s.trim().length > 50);
    if (sentences.length > 0) {
      keyFindings.push(sentences[0].trim());
    }
  }
  
  // Create research brief
  const researchBrief: ResearchBrief = {
    entity: job.entity,
    generated_at: new Date().toISOString(),
    source_count: sources.length,
    successful_extractions: successCount,
    confidence_score: successRate,
    sources,
    extracts,
    key_findings: keyFindings.slice(0, 10), // Top 10 findings
    gaps: sources.length < finalConfig.minSources 
      ? [`Insufficient sources collected (${sources.length}/${finalConfig.minSources})`]
      : undefined,
    next_steps: successRate < finalConfig.minSuccessRate
      ? ["Consider additional search queries for better coverage"]
      : undefined,
  };
  
  // Write artifacts
  await mkdir(artifactDir, { recursive: true });
  
  const sourcesFile = join(artifactDir, "sources.json");
  const extractsFile = join(artifactDir, "extracts.json");
  const briefFile = join(artifactDir, "research_brief.md");
  
  await writeFile(sourcesFile, JSON.stringify(sources, null, 2), "utf-8");
  await writeFile(extractsFile, JSON.stringify(extracts, null, 2), "utf-8");
  
  // Generate markdown research brief
  const briefMarkdown = generateBriefMarkdown(researchBrief);
  await writeFile(briefFile, briefMarkdown, "utf-8");
  
  logStage1Completion(job.spec, job.entity, sources.length, successRate);
  
  return {
    researchBrief,
    sourcesFile,
    extractsFile,
    briefFile,
    artifactDir,
  };
}

/**
 * Generate markdown research brief
 */
function generateBriefMarkdown(brief: ResearchBrief): string {
  const lines: string[] = [
    `# Research Brief: ${brief.entity}`,
    "",
    `**Generated:** ${brief.generated_at}`,
    `**Sources:** ${brief.source_count}`,
    `**Successful Extractions:** ${brief.successful_extractions}`,
    `**Confidence Score:** ${(brief.confidence_score * 100).toFixed(1)}%`,
    "",
    "## Sources",
    "",
  ];
  
  for (const source of brief.sources) {
    lines.push(`- **${source.kind}**: [${source.title || source.url}](${source.url})`);
  }
  
  lines.push("", "## Key Findings", "");
  for (const finding of brief.key_findings) {
    lines.push(`- ${finding}`);
  }
  
  if (brief.gaps && brief.gaps.length > 0) {
    lines.push("", "## Research Gaps", "");
    for (const gap of brief.gaps) {
      lines.push(`- ${gap}`);
    }
  }
  
  if (brief.next_steps && brief.next_steps.length > 0) {
    lines.push("", "## Next Steps", "");
    for (const step of brief.next_steps) {
      lines.push(`- ${step}`);
    }
  }
  
  lines.push("", "---", `*Generated by LLM-Wiki Pipeline*`);
  
  return lines.join("\n");
}

/**
 * Log Stage 1 start
 */
function logStage1Start(specVersion: string, entity: string, queries: string[]): void {
  console.error(JSON.stringify({
    level: "info",
    timestamp: new Date().toISOString(),
    message: "Stage 1 started: Research",
    stage: 1,
    spec_version: specVersion,
    entity,
    query_count: queries.length,
  }));
}

/**
 * Log extraction success
 */
function logExtractionSuccess(url: string, kind: SourceKind, wordCount: number): void {
  console.error(JSON.stringify({
    level: "info",
    timestamp: new Date().toISOString(),
    message: "Source extracted successfully",
    stage: 1,
    url,
    source_kind: kind,
    word_count: wordCount,
  }));
}

/**
 * Log extraction failure
 */
function logExtractionFailure(url: string, error: string): void {
  console.error(JSON.stringify({
    level: "error",
    timestamp: new Date().toISOString(),
    message: "Source extraction failed",
    stage: 1,
    url,
    error,
  }));
}

/**
 * Log Stage 1 error
 */
function logStage1Error(errorType: string, context: string, error: string): void {
  console.error(JSON.stringify({
    level: "error",
    timestamp: new Date().toISOString(),
    message: "Stage 1 error",
    stage: 1,
    error_type: errorType,
    context,
    error,
  }));
}

/**
 * Log Stage 1 completion
 */
function logStage1Completion(specVersion: string, entity: string, sourceCount: number, successRate: number): void {
  console.error(JSON.stringify({
    level: "info",
    timestamp: new Date().toISOString(),
    message: "Stage 1 completed: Research",
    stage: 1,
    spec_version: specVersion,
    entity,
    source_count: sourceCount,
    extraction_success_rate: successRate,
  }));
}

/**
 * Create Stage 1 for pipeline orchestrator
 */
export function createStage1(config: Partial<Stage1Config> = {}): Stage {
  return {
    id: 1,
    name: "research",
    description: "Collect web sources and extract structured evidence",
    execute: async (job: JobSpec, context: StageContext) => {
      const slug = job.entity
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      
      const artifactDir = join(job.output, "artifacts", slug);
      
      context.log("info", "Starting research stage", {
        entity: job.entity,
        artifact_dir: artifactDir,
      });
      
      const output = await executeStage1(job, artifactDir, config);
      
      context.log("info", "Research stage completed", {
        source_count: output.researchBrief.source_count,
        success_rate: output.researchBrief.confidence_score,
      });
      
      return output;
    },
    gateCheck: async (job: JobSpec, result: unknown): Promise<GateResult> => {
      const output = result as Stage1Output;
      const brief = output.researchBrief;
      const finalConfig = { ...DEFAULT_CONFIG, ...config };
      
      // Check source count
      if (brief.source_count < finalConfig.minSources) {
        return {
          passed: false,
          reason: `Insufficient sources: ${brief.source_count} < ${finalConfig.minSources} required`,
          timestamp: new Date().toISOString(),
        };
      }
      
      // Check success rate
      if (brief.confidence_score < finalConfig.minSuccessRate) {
        return {
          passed: false,
          reason: `Extraction success rate too low: ${(brief.confidence_score * 100).toFixed(1)}% < ${(finalConfig.minSuccessRate * 100).toFixed(1)}% required`,
          timestamp: new Date().toISOString(),
        };
      }
      
      return {
        passed: true,
        reason: `Collected ${brief.source_count} sources with ${(brief.confidence_score * 100).toFixed(1)}% extraction success rate`,
        timestamp: new Date().toISOString(),
      };
    },
  };
}

// Re-export types for consumers
export { type Source, type Extract, type ResearchBrief } from "../types/evidence";
