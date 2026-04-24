// =============================================================================
// A2A PROTOCOL - Message Types & Schemas
// =============================================================================
// Purpose: Define the Agent-to-Agent communication protocol
// Used by both Orquidia (Server) and UniTeiaAI (Client)
// =============================================================================

// =============================================================================
// MESSAGE ENUMS
// =============================================================================

export enum A2AMessageType {
  // Request types
  REQUEST = 'a2a/request',
  STREAM_REQUEST = 'a2a/stream_request',
  CANCEL = 'a2a/cancel',

  // Response types
  RESPONSE = 'a2a/response',
  STREAM_RESPONSE = 'a2a/stream_response',
  ERROR = 'a2a/error',

  // Lifecycle types
  CONNECT = 'a2a/connect',
  DISCONNECT = 'a2a/disconnect',
  HEARTBEAT = 'a2a/heartbeat',
}

export enum A2ATaskType {
  ANALYSIS = 'ANALYSIS',
  CLASSIFICATION = 'CLASSIFICATION',
  CREATION = 'CREATION',
  SEARCH = 'SEARCH',
  QUESTION = 'QUESTION',
  EXTRACTION = 'EXTRACTION',
  GENERATION = 'GENERATION',
}

// =============================================================================
// BASE MESSAGE INTERFACE
// =============================================================================

export interface A2ABaseMessage {
  type: A2AMessageType
  id: string
  timestamp: number
  sessionId: string
  correlationId?: string
}

// =============================================================================
// REQUEST/RESPONSE MESSAGES
// =============================================================================

export interface A2ARequest extends A2ABaseMessage {
  type: A2AMessageType.REQUEST
  payload: {
    taskType: A2ATaskType
    input: string
    context?: Record<string, unknown>
    metadata?: {
      priority?: 'low' | 'normal' | 'high'
      timeout?: number
      model?: string
    }
  }
}

export interface A2AResponse extends A2ABaseMessage {
  type: A2AMessageType.RESPONSE
  payload: {
    success: boolean
    output: string
    confidence: number
    intermediateSteps?: Array<{ action: string; result: string }>
    metadata?: {
      provider: string
      model: string
      latencyMs: number
      tokensUsed?: number
    }
  }
}

export interface A2AError extends A2ABaseMessage {
  type: A2AMessageType.ERROR
  payload: {
    code: number
    message: string
    details?: string
    recoverable: boolean
  }
}

// =============================================================================
// STREAMING MESSAGES
// =============================================================================

export interface A2AStreamRequest extends A2ABaseMessage {
  type: A2AMessageType.STREAM_REQUEST
  payload: {
    taskType: A2ATaskType
    input: string
    context?: Record<string, unknown>
  }
}

export interface A2AStreamChunk {
  type: A2AMessageType.STREAM_RESPONSE
  id: string
  timestamp: number
  chunk: {
    content: string
    done: boolean
    metadata?: {
      step?: string
      progress?: number
    }
  }
}

export interface A2ACancel extends A2ABaseMessage {
  type: A2AMessageType.CANCEL
  payload: {
    reason?: string
  }
}

// =============================================================================
// LIFECYCLE MESSAGES
// =============================================================================

export interface A2AConnect {
  type: A2AMessageType.CONNECT
  id: string
  timestamp: number
  payload: {
    agentId: string
    capabilities: string[]
    version: string
  }
}

export interface A2ADisconnect {
  type: A2AMessageType.DISCONNECT
  id: string
  timestamp: number
  payload: {
    reason: string
    graceful: boolean
  }
}

export interface A2AHeartbeat {
  type: A2AMessageType.HEARTBEAT
  id: string
  timestamp: number
  sessionId: string
  payload: {
    agentId: string
    status: 'healthy' | 'degraded' | 'unhealthy'
    load: number
  }
}

// =============================================================================
// UNION TYPES
// =============================================================================

export type A2AMessage =
  | A2ARequest
  | A2AResponse
  | A2AError
  | A2AStreamRequest
  | A2AStreamChunk
  | A2ACancel
  | A2AConnect
  | A2ADisconnect
  | A2AHeartbeat

export type A2ARequestMessage = A2ARequest | A2AStreamRequest

// =============================================================================
// PROTOCOL UTILITIES
// =============================================================================

export function createRequest(
  sessionId: string,
  taskType: A2ATaskType,
  input: string,
  context?: Record<string, unknown>,
  correlationId?: string,
): A2ARequest {
  return {
    type: A2AMessageType.REQUEST,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    sessionId,
    correlationId,
    payload: {
      taskType,
      input,
      context,
    },
  }
}

export function createResponse(
  original: A2ARequest,
  success: boolean,
  output: string,
  confidence: number,
  metadata?: A2AResponse['payload']['metadata'],
): A2AResponse {
  return {
    type: A2AMessageType.RESPONSE,
    id: original.id,
    timestamp: Date.now(),
    sessionId: original.sessionId,
    correlationId: original.correlationId,
    payload: {
      success,
      output,
      confidence,
      metadata,
    },
  }
}

export function createError(
  original: A2ARequest | A2AStreamRequest,
  code: number,
  message: string,
  details?: string,
  recoverable = true,
): A2AError {
  return {
    type: A2AMessageType.ERROR,
    id: original.id,
    timestamp: Date.now(),
    sessionId: original.sessionId,
    correlationId: original.correlationId,
    payload: {
      code,
      message,
      details,
      recoverable,
    },
  }
}

export function parseMessage(data: string): A2AMessage | null {
  try {
    return JSON.parse(data) as A2AMessage
  } catch {
    console.error('[A2A] Failed to parse message:', data)
    return null
  }
}

export function stringifyMessage(msg: A2AMessage): string {
  return JSON.stringify(msg)
}
