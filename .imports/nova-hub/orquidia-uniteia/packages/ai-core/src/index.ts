// =============================================================================
// ORQUIDIA AI CORE - Main Entry Point
// =============================================================================
// Purpose: High-performance AI orchestration for UniTeiaAI gateway
// Stack: TypeScript + LangChain.js + Rust WASM
// =============================================================================

// Agents
export { OrchestratorAgent } from './agents/index.js'

// Rust WASM Integration
export {
  cosineSimilarity,
  semanticSearch,
  extractKeywords,
  analyzeSentiment,
  classifyText,
  extractEmails,
  extractUrls,
  extractNumbers,
  getRustVersion,
} from './rust/index.js'

// A2A Protocol (Agent-to-Agent Communication)
export {
  A2AServer,
  A2AClient,
  createA2AClient,
  type A2ASession,
  type A2AClientState,
  type A2AMessage,
  type A2ARequest,
  type A2AResponse,
  A2AMessageType,
  A2ATaskType,
} from './a2a/index.js'

// Context utilities
export * from './context.js'

// Generators
export * from './generators/index.js'

// Version
export const VERSION = '0.2.0'
export const SOTA_EDITION = '2026'
