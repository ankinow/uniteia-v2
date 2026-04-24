// =============================================================================
// A2A CLIENT - UniTeiaAI Gateway Integration
// =============================================================================
// Purpose: WebSocket client for A2A communication with Orquidia AI Core
// Usage: Route complex AI queries to Orquidia for advanced reasoning
// =============================================================================

import {
  type A2AError,
  type A2AHeartbeat,
  A2AMessage,
  A2AMessageType,
  type A2ARequest,
  type A2AResponse,
  A2ATaskType,
  createRequest,
  parseMessage,
  stringifyMessage,
} from './protocol.js'

// =============================================================================
// CONFIGURATION
// =============================================================================

const A2A_CLIENT_CONFIG = {
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
  REQUEST_TIMEOUT: 90000,
  HEARTBEAT_INTERVAL: 30000,
}

// =============================================================================
// CLIENT STATE
// =============================================================================

interface A2AClientState {
  status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting'
  reconnectAttempts: number
  lastHeartbeat: number
  pendingRequests: Map<
    string,
    {
      resolve: (res: A2AResponse) => void
      reject: (err: Error) => void
      timeout: ReturnType<typeof setTimeout>
    }
  >
}

// =============================================================================
// A2A CLIENT CLASS
// =============================================================================

export class A2AClient {
  private serverUrl: string
  private agentId: string
  private capabilities: string[]
  private socket: WebSocket | null = null
  private state: A2AClientState
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null

  // Callbacks
  private connectionCallback: (() => void) | null = null
  private disconnectionCallback: ((code: number, reason: string) => void) | null = null
  private errorCallback: ((error: Error) => void) | null = null

  constructor(
    serverUrl: string,
    agentId = 'uniteia-gateway',
    capabilities: string[] = ['analysis', 'classification', 'search'],
  ) {
    this.serverUrl = serverUrl
    this.agentId = agentId
    this.capabilities = capabilities
    this.state = {
      status: 'disconnected',
      reconnectAttempts: 0,
      lastHeartbeat: 0,
      pendingRequests: new Map(),
    }
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onConnection(callback: () => void): A2AClient {
    this.connectionCallback = callback
    return this
  }

  onDisconnection(callback: (code: number, reason: string) => void): A2AClient {
    this.disconnectionCallback = callback
    return this
  }

  onError(callback: (error: Error) => void): A2AClient {
    this.errorCallback = callback
    return this
  }

  // =============================================================================
  // CONNECTION MANAGEMENT
  // =============================================================================

  async connect(): Promise<void> {
    if (this.state.status === 'connected' || this.state.status === 'connecting') {
      console.warn('[A2A Client] Already connected or connecting')
      return
    }

    console.log(`[A2A Client] Connecting to ${this.serverUrl}...`)
    this.state.status = 'connecting'

    return new Promise((resolve, reject) => {
      try {
        const url = new URL(this.serverUrl)
        url.searchParams.set('agentId', this.agentId)
        url.searchParams.set('capabilities', this.capabilities.join(','))

        this.socket = new WebSocket(url.toString())

        this.socket.onopen = () => {
          console.log('[A2A Client] Connected')
          this.state.status = 'connected'
          this.state.reconnectAttempts = 0
          this.startHeartbeat()

          if (this.connectionCallback) this.connectionCallback()
          resolve()
        }

        this.socket.onmessage = (event) => {
          this.handleMessage(event.data)
        }

        this.socket.onclose = (event) => {
          console.log(`[A2A Client] Disconnected: ${event.code} - ${event.reason}`)
          this.state.status = 'disconnected'
          this.stopHeartbeat()

          if (this.disconnectionCallback) this.disconnectionCallback(event.code, event.reason)

          this.handleReconnect()
        }

        this.socket.onerror = (error: Event) => {
          console.error('[A2A Client] Socket error:', error)
          this.state.status = 'disconnected'

          if (this.errorCallback) this.errorCallback(new Error('WebSocket error'))

          reject(new Error('WebSocket connection failed'))
        }
      } catch (error) {
        this.state.status = 'disconnected'
        reject(error)
      }
    })
  }

  async disconnect(): Promise<void> {
    console.log('[A2A Client] Disconnecting...')
    this.stopHeartbeat()

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    // Clear pending requests
    for (const [id, request] of this.state.pendingRequests) {
      clearTimeout(request.timeout)
      request.reject(new Error('Connection closed'))
    }
    this.state.pendingRequests.clear()

    if (this.socket) {
      this.socket.close(1000, 'Client disconnect')
      this.socket = null
    }

    this.state.status = 'disconnected'
  }

  private handleReconnect(): void {
    if (this.state.reconnectAttempts >= A2A_CLIENT_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      console.error('[A2A Client] Max reconnection attempts reached')
      this.state.status = 'disconnected'
      return
    }

    this.state.status = 'reconnecting'
    this.state.reconnectAttempts++

    console.log(
      `[A2A Client] Reconnecting in ${A2A_CLIENT_CONFIG.RECONNECT_INTERVAL}ms (attempt ${this.state.reconnectAttempts})...`,
    )

    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch((error) => {
        console.error('[A2A Client] Reconnection failed:', error)
      })
    }, A2A_CLIENT_CONFIG.RECONNECT_INTERVAL)
  }

  // =============================================================================
  // REQUEST HANDLING
  // =============================================================================

  async request(
    taskType: A2ATaskType,
    input: string,
    context?: Record<string, unknown>,
  ): Promise<A2AResponse> {
    if (this.state.status !== 'connected' || !this.socket) {
      throw new Error('Not connected to A2A server')
    }

    const request = createRequest(this.agentId, taskType, input, context)

    return new Promise((resolve, reject) => {
      // Set timeout
      const timeout = setTimeout(() => {
        this.state.pendingRequests.delete(request.id)
        reject(new Error(`Request timeout after ${A2A_CLIENT_CONFIG.REQUEST_TIMEOUT}ms`))
      }, A2A_CLIENT_CONFIG.REQUEST_TIMEOUT)

      // Store pending request
      this.state.pendingRequests.set(request.id, { resolve, reject, timeout })

      // Send request
      try {
        const socket = this.socket
        if (!socket) throw new Error('Socket not connected')
        socket.send(stringifyMessage(request))
      } catch (error) {
        this.state.pendingRequests.delete(request.id)
        clearTimeout(timeout)
        reject(error)
      }
    })
  }

  // =============================================================================
  // MESSAGE HANDLING
  // =============================================================================

  private handleMessage(data: string): void {
    const message = parseMessage(data)

    if (!message) {
      console.warn('[A2A Client] Invalid message received')
      return
    }

    switch (message.type) {
      case A2AMessageType.RESPONSE:
        this.handleResponse(message as A2AResponse)
        break

      case A2AMessageType.ERROR:
        this.handleError(message as A2AError)
        break

      case A2AMessageType.STREAM_RESPONSE:
        console.log('[A2A Client] Stream response received (not implemented)')
        break

      default:
        console.warn(`[A2A Client] Unknown message type: ${message.type}`)
    }
  }

  private handleResponse(response: A2AResponse): void {
    const pending = this.state.pendingRequests.get(response.id)

    if (pending) {
      clearTimeout(pending.timeout)
      this.state.pendingRequests.delete(response.id)
      pending.resolve(response)
    } else {
      console.warn(`[A2A Client] Response for unknown request: ${response.id}`)
    }
  }

  private handleError(error: A2AError): void {
    const pending = this.state.pendingRequests.get(error.id)

    if (pending) {
      clearTimeout(pending.timeout)
      this.state.pendingRequests.delete(error.id)
      pending.reject(new Error(`A2A Error ${error.payload.code}: ${error.payload.message}`))
    } else {
      console.warn(`[A2A Client] Error for unknown request: ${error.id}`)
    }
  }

  // =============================================================================
  // HEARTBEAT
  // =============================================================================

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.state.status === 'connected' && this.socket?.readyState === WebSocket.OPEN) {
        const heartbeat: A2AHeartbeat = {
          type: A2AMessageType.HEARTBEAT,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          sessionId: this.agentId,
          payload: {
            agentId: this.agentId,
            status: 'healthy' as const,
            load: 0.5,
          },
        }

        this.socket.send(stringifyMessage(heartbeat))

        this.state.lastHeartbeat = Date.now()
      }
    }, A2A_CLIENT_CONFIG.HEARTBEAT_INTERVAL)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  isConnected(): boolean {
    return this.state.status === 'connected' && this.socket?.readyState === WebSocket.OPEN
  }

  getStatus(): string {
    return this.state.status
  }

  getPendingRequests(): number {
    return this.state.pendingRequests.size
  }

  // =============================================================================
  // SPECIALIZED METHODS (SHORTCUTS)
  // =============================================================================

  async analyze(input: string, context?: Record<string, unknown>): Promise<A2AResponse> {
    return this.request(A2ATaskType.ANALYSIS, input, context)
  }

  async classify(input: string, context?: Record<string, unknown>): Promise<A2AResponse> {
    return this.request(A2ATaskType.CLASSIFICATION, input, context)
  }

  async search(query: string, context?: Record<string, unknown>): Promise<A2AResponse> {
    return this.request(A2ATaskType.SEARCH, query, context)
  }

  async generate(input: string, context?: Record<string, unknown>): Promise<A2AResponse> {
    return this.request(A2ATaskType.GENERATION, input, context)
  }

  async extract(input: string, context?: Record<string, unknown>): Promise<A2AResponse> {
    return this.request(A2ATaskType.EXTRACTION, input, context)
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

export function createA2AClient(
  serverUrl: string,
  agentId?: string,
  capabilities?: string[],
): A2AClient {
  return new A2AClient(serverUrl, agentId, capabilities)
}

export type { A2AClientState }
