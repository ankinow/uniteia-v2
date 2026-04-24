/**
 * @orquestra/ai-core - A2A Protocol Test Suite
 * SOTA 2026: Tests for Agent-to-Agent communication protocol
 */

import { describe, expect, test } from 'bun:test'
import {
  type A2AError,
  A2AMessageType,
  type A2ARequest,
  type A2AResponse,
  type A2AStreamRequest,
  A2ATaskType,
  createError,
  createRequest,
  createResponse,
  parseMessage,
  stringifyMessage,
} from '../a2a/protocol'

// =============================================================================
// A2AMessageType Enum
// =============================================================================

describe('A2AMessageType', () => {
  test('has correct request types', () => {
    expect(A2AMessageType.REQUEST).toBe('a2a/request')
    expect(A2AMessageType.STREAM_REQUEST).toBe('a2a/stream_request')
    expect(A2AMessageType.CANCEL).toBe('a2a/cancel')
  })

  test('has correct response types', () => {
    expect(A2AMessageType.RESPONSE).toBe('a2a/response')
    expect(A2AMessageType.STREAM_RESPONSE).toBe('a2a/stream_response')
    expect(A2AMessageType.ERROR).toBe('a2a/error')
  })

  test('has correct lifecycle types', () => {
    expect(A2AMessageType.CONNECT).toBe('a2a/connect')
    expect(A2AMessageType.DISCONNECT).toBe('a2a/disconnect')
    expect(A2AMessageType.HEARTBEAT).toBe('a2a/heartbeat')
  })
})

// =============================================================================
// A2ATaskType Enum
// =============================================================================

describe('A2ATaskType', () => {
  test('has all expected task types', () => {
    expect(A2ATaskType.ANALYSIS).toBe('ANALYSIS')
    expect(A2ATaskType.CLASSIFICATION).toBe('CLASSIFICATION')
    expect(A2ATaskType.CREATION).toBe('CREATION')
    expect(A2ATaskType.SEARCH).toBe('SEARCH')
    expect(A2ATaskType.QUESTION).toBe('QUESTION')
    expect(A2ATaskType.EXTRACTION).toBe('EXTRACTION')
    expect(A2ATaskType.GENERATION).toBe('GENERATION')
  })
})

// =============================================================================
// createRequest
// =============================================================================

describe('createRequest', () => {
  test('creates a valid request message', () => {
    const req = createRequest('session-1', A2ATaskType.ANALYSIS, 'Analyze this product')

    expect(req.type).toBe(A2AMessageType.REQUEST)
    expect(req.sessionId).toBe('session-1')
    expect(req.payload.taskType).toBe(A2ATaskType.ANALYSIS)
    expect(req.payload.input).toBe('Analyze this product')
    expect(req.id).toBeTruthy()
    expect(req.timestamp).toBeGreaterThan(0)
  })

  test('generates unique IDs', () => {
    const req1 = createRequest('s1', A2ATaskType.SEARCH, 'q1')
    const req2 = createRequest('s1', A2ATaskType.SEARCH, 'q2')
    expect(req1.id).not.toBe(req2.id)
  })

  test('includes context when provided', () => {
    const context = { category: 'electronics', region: 'BR' }
    const req = createRequest('s1', A2ATaskType.SEARCH, 'search', context)
    expect(req.payload.context).toEqual(context)
  })

  test('includes correlationId when provided', () => {
    const req = createRequest('s1', A2ATaskType.SEARCH, 'search', undefined, 'corr-123')
    expect(req.correlationId).toBe('corr-123')
  })

  test('context is undefined when not provided', () => {
    const req = createRequest('s1', A2ATaskType.SEARCH, 'search')
    expect(req.payload.context).toBeUndefined()
  })
})

// =============================================================================
// createResponse
// =============================================================================

describe('createResponse', () => {
  const originalRequest: A2ARequest = {
    type: A2AMessageType.REQUEST,
    id: 'req-123',
    timestamp: Date.now(),
    sessionId: 'session-1',
    correlationId: 'corr-456',
    payload: {
      taskType: A2ATaskType.ANALYSIS,
      input: 'Test input',
    },
  }

  test('creates a valid response', () => {
    const res = createResponse(originalRequest, true, 'Analysis complete', 0.95)

    expect(res.type).toBe(A2AMessageType.RESPONSE)
    expect(res.id).toBe('req-123')
    expect(res.sessionId).toBe('session-1')
    expect(res.correlationId).toBe('corr-456')
    expect(res.payload.success).toBe(true)
    expect(res.payload.output).toBe('Analysis complete')
    expect(res.payload.confidence).toBe(0.95)
  })

  test('preserves correlation ID from request', () => {
    const res = createResponse(originalRequest, true, 'output', 0.8)
    expect(res.correlationId).toBe(originalRequest.correlationId)
  })

  test('includes metadata when provided', () => {
    const metadata = {
      provider: 'gemini',
      model: 'gemini-2.0-flash',
      latencyMs: 150,
      tokensUsed: 256,
    }
    const res = createResponse(originalRequest, true, 'output', 0.9, metadata)
    expect(res.payload.metadata).toEqual(metadata)
  })

  test('handles failure response', () => {
    const res = createResponse(originalRequest, false, 'Error occurred', 0)
    expect(res.payload.success).toBe(false)
    expect(res.payload.confidence).toBe(0)
  })
})

// =============================================================================
// createError
// =============================================================================

describe('createError', () => {
  const originalRequest: A2ARequest = {
    type: A2AMessageType.REQUEST,
    id: 'req-err',
    timestamp: Date.now(),
    sessionId: 'session-1',
    payload: {
      taskType: A2ATaskType.GENERATION,
      input: 'Generate content',
    },
  }

  test('creates a valid error message', () => {
    const err = createError(originalRequest, 500, 'Internal error')

    expect(err.type).toBe(A2AMessageType.ERROR)
    expect(err.id).toBe('req-err')
    expect(err.sessionId).toBe('session-1')
    expect(err.payload.code).toBe(500)
    expect(err.payload.message).toBe('Internal error')
    expect(err.payload.recoverable).toBe(true) // default
  })

  test('includes details when provided', () => {
    const err = createError(originalRequest, 429, 'Rate limited', 'Try again in 60s')
    expect(err.payload.details).toBe('Try again in 60s')
  })

  test('respects recoverable flag', () => {
    const err = createError(originalRequest, 401, 'Unauthorized', undefined, false)
    expect(err.payload.recoverable).toBe(false)
  })

  test('works with stream request', () => {
    const streamReq: A2AStreamRequest = {
      type: A2AMessageType.STREAM_REQUEST,
      id: 'stream-123',
      timestamp: Date.now(),
      sessionId: 'session-2',
      payload: {
        taskType: A2ATaskType.GENERATION,
        input: 'Stream this',
      },
    }

    const err = createError(streamReq, 503, 'Service unavailable')
    expect(err.id).toBe('stream-123')
    expect(err.sessionId).toBe('session-2')
  })
})

// =============================================================================
// parseMessage / stringifyMessage
// =============================================================================

describe('parseMessage', () => {
  test('parses valid JSON message', () => {
    const req = createRequest('s1', A2ATaskType.SEARCH, 'query')
    const json = JSON.stringify(req)
    const parsed = parseMessage(json)
    expect(parsed).not.toBeNull()
    if (parsed) {
      expect(parsed.type).toBe(A2AMessageType.REQUEST)
    }
  })

  test('returns null for invalid JSON', () => {
    const result = parseMessage('not valid json {{{')
    expect(result).toBeNull()
  })

  test('returns null for empty string', () => {
    const result = parseMessage('')
    expect(result).toBeNull()
  })
})

describe('stringifyMessage', () => {
  test('stringifies a message to valid JSON', () => {
    const req = createRequest('s1', A2ATaskType.ANALYSIS, 'test')
    const json = stringifyMessage(req)
    const parsed = JSON.parse(json)
    expect(parsed.type).toBe(A2AMessageType.REQUEST)
    expect(parsed.payload.taskType).toBe(A2ATaskType.ANALYSIS)
  })

  test('roundtrip: stringify then parse', () => {
    const original = createRequest('s1', A2ATaskType.CREATION, 'input', { key: 'value' })
    const json = stringifyMessage(original)
    const parsed = parseMessage(json)
    expect(parsed).not.toBeNull()
    const parsedReq = parsed as A2ARequest
    expect(parsedReq.sessionId).toBe('s1')
    expect(parsedReq.payload.input).toBe('input')
    expect(parsedReq.payload.context).toEqual({ key: 'value' })
  })
})
