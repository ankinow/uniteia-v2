/**
 * @orquestra/ai-core - Economic Exports (SOTA 2026)
 * Surgical, lightweight exports for low-resource environments.
 * AGENTIC∞: MCP + A2A + ACP patterns integrated.
 */

// =============================================================================
// SCRAPERS (Cloud-based, no local browser)
// =============================================================================
export {
  scrapeProduct,
  scrapeBatch,
  checkHyperbrowserHealth,
  type ScrapeOptions,
  type ScrapeResult,
} from './scrapers/hyperbrowser.js'

// =============================================================================
// DATABASE (REST API, no heavy ORM)
// =============================================================================
export {
  D1RestClient,
  type D1Config,
  type D1QueryResult,
} from './db/d1-rest.js'

// =============================================================================
// MEMORY & RESOURCE GUARDS (AgentOps)
// =============================================================================
export {
  checkMemory,
  operationGate,
  forceGC,
  MemoryMonitor,
  memoryPause,
  type MemoryStatus,
  type ResourceGate,
} from './utils/memory-guard.js'

// =============================================================================
// LEGACY EXPORTS (for compatibility - use with caution)
// =============================================================================
// Note: The following exports have TypeScript issues and are deprecated
// in favor of the economic implementations above.
// export * from './agents/index.js';
// export * from './providers/index.js';
// export * from './rust/index.js';
// export * from './a2a/index.js';

// =============================================================================
// VERSION
// =============================================================================
export const VERSION = '0.3.0-economic'
export const SOTA_EDITION = '2026'
export const BUILD_TYPE = 'local-ops'
