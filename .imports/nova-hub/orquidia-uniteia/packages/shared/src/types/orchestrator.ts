/**
 * @uniteia/shared/types/orchestrator
 * AI Orchestrator types for Admin panel
 */

// ============================================================================
// CHAT & MESSAGE TYPES
// ============================================================================

/**
 * ChatMessage: Message in AI chat history
 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  timestamp: number
  metadata?: {
    model?: string
    tokens_used?: number
    latency_ms?: number
    tool_calls?: ToolCall[]
  }
}

/**
 * ToolCall: MCP/AI tool invocation
 */
export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
  result?: unknown
  status: 'pending' | 'running' | 'success' | 'error'
  error?: string
  started_at: number
  completed_at?: number
}

// ============================================================================
// AGENT TYPES
// ============================================================================

/**
 * Agent: AI agent configuration
 */
export interface Agent {
  id: string
  name: string
  description: string
  provider: AIProvider
  model: string
  system_prompt?: string
  temperature?: number
  max_tokens?: number
  tools?: string[]
  is_active: boolean
  created_at: number
  updated_at: number
}

/**
 * AIProvider: Supported AI providers
 */
export type AIProvider =
  | 'workers-ai'
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'together'
  | 'mistral'
  | 'local'

/**
 * AIProviderConfig: Provider-specific configuration
 */
export interface AIProviderConfig {
  provider: AIProvider
  api_key?: string
  base_url?: string
  model: string
  default_temperature?: number
  default_max_tokens?: number
  rate_limit?: {
    requests_per_minute: number
    tokens_per_minute: number
  }
}

// ============================================================================
// ORCHESTRATOR STATE
// ============================================================================

/**
 * OrchestratorState: Admin orchestrator store state
 */
export interface OrchestratorState {
  agents: Agent[]
  active_agent_id?: string
  chat_history: ChatMessage[]
  pending_tool_calls: ToolCall[]
  providers: AIProviderConfig[]
  is_loading: boolean
  error?: string
}

/**
 * OrchestratorAction: Actions for orchestrator reducer
 */
export type OrchestratorAction =
  | { type: 'SET_ACTIVE_AGENT'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_TOOL_CALL'; payload: Partial<ToolCall> & { id: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'CLEAR_CHAT' }
  | { type: 'ADD_AGENT'; payload: Agent }
  | { type: 'UPDATE_AGENT'; payload: Partial<Agent> & { id: string } }
  | { type: 'REMOVE_AGENT'; payload: string }

// ============================================================================
// WORKFLOW TYPES
// ============================================================================

/**
 * WorkflowStep: Step in an orchestrated workflow
 */
export interface WorkflowStep {
  id: string
  name: string
  type: 'llm' | 'tool' | 'condition' | 'parallel' | 'loop'
  config: Record<string, unknown>
  next?: string | { [condition: string]: string }
  timeout_ms?: number
}

/**
 * WorkflowDefinition: Complete workflow configuration
 */
export interface WorkflowDefinition {
  id: string
  name: string
  description: string
  version: string
  entry_step: string
  steps: WorkflowStep[]
  variables?: Record<string, unknown>
  created_at: number
  updated_at: number
}

/**
 * WorkflowExecution: Runtime workflow state
 */
export interface WorkflowExecution {
  id: string
  workflow_id: string
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed'
  current_step?: string
  context: Record<string, unknown>
  history: Array<{
    step_id: string
    started_at: number
    completed_at?: number
    result?: unknown
    error?: string
  }>
  started_at: number
  completed_at?: number
}
