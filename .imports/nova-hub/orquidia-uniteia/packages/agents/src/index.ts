// Agent base class and types
export { BaseAgent } from './base/Agent.js'
export type { AgentOutput } from './base/Agent.js'

// Agent implementations
export { ResearchAgent } from './research/ResearchAgent.js'
export { WritingAgent } from './writing/WritingAgent.js'
export { EditingAgent } from './editing/EditingAgent.js'
export { SeoAgent } from './seo/SeoAgent.js'
export { ValidationAgent } from './validation/ValidationAgent.js'
export { TriageAgent } from './triage/TriageAgent.js'
export { LearningAgent } from './learning/LearningAgent.js'
export { FeedbackAgent } from './feedback/FeedbackAgent.js'

// Shared types
export type {
  ResearchInput,
  WritingInput,
  EditingInput,
  SeoInput,
  ValidationInput,
  TriageInput,
  LearningInput,
  FeedbackInput,
  ResearchOutput,
  WritingOutput,
  EditingOutput,
  SeoOutput,
  ValidationOutput,
  TriageOutput,
  LearningOutput,
  FeedbackOutput,
  AgentConfig,
  PipelineContext,
} from './types.js'

// Agent registry for dynamic loading
export const AgentRegistry = {
  ResearchAgent: 'ResearchAgent',
  WritingAgent: 'WritingAgent',
  EditingAgent: 'EditingAgent',
  SeoAgent: 'SeoAgent',
  ValidationAgent: 'ValidationAgent',
  TriageAgent: 'TriageAgent',
  LearningAgent: 'LearningAgent',
  FeedbackAgent: 'FeedbackAgent',
} as const

export type AgentName = keyof typeof AgentRegistry
