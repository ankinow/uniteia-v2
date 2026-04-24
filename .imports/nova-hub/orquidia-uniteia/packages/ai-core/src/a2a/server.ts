import { type WebSocket, WebSocketServer } from 'ws'

import { OrchestratorAgent } from '../agents/orchestrator.js'
import {
  A2AMessageType,
  type A2ARequest,
  type A2AResponse,
  A2ATaskType,
  createError,
  createResponse,
  parseMessage,
  stringifyMessage,
} from './protocol.js'

export interface A2ASession {
  id: string
  socket: WebSocket
  agentId: string
  capabilities: string[]
  connectedAt: number
  lastActivity: number
  status: 'connecting' | 'connected' | 'disconnecting'
}

const A2A_CONFIG = {
  heartbeatIntervalMs: 30_000,
  requestTimeoutMs: 60_000,
  maxMessageSizeBytes: 1024 * 1024,
}

export class A2AServer {
  private server: WebSocketServer | null = null
  private sessions = new Map<string, A2ASession>()
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private handlers = new Map<A2ATaskType, (req: A2ARequest) => Promise<A2AResponse>>()
  private orchestrator: OrchestratorAgent

  constructor() {
    this.orchestrator = new OrchestratorAgent({
      geminiApiKey: process.env.GEMINI_API_KEY,
      openrouterApiKey: process.env.OPENROUTER_API_KEY,
    })
    this.orchestrator.initialize()
    this.registerDefaultHandlers()
  }

  registerHandler(taskType: A2ATaskType, handler: (req: A2ARequest) => Promise<A2AResponse>): void {
    this.handlers.set(taskType, handler)
  }

  async start(port = 8080): Promise<void> {
    if (this.server) return

    this.server = new WebSocketServer({
      port,
      maxPayload: A2A_CONFIG.maxMessageSizeBytes,
    })

    this.server.on('connection', (socket) => {
      this.handleConnection(socket)
    })

    this.server.on('error', (error) => {
      console.error('[A2A Server] Error:', error)
    })

    this.startHeartbeat()
  }

  async stop(): Promise<void> {
    this.stopHeartbeat()

    for (const session of this.sessions.values()) {
      session.status = 'disconnecting'
      session.socket.close(1000, 'Server shutting down')
    }
    this.sessions.clear()

    await new Promise<void>((resolve) => {
      if (!this.server) return resolve()
      this.server.close(() => resolve())
    })

    this.server = null
  }

  private registerDefaultHandlers(): void {
    const handler = async (req: A2ARequest): Promise<A2AResponse> => this.handleOrchestrator(req)

    this.handlers.set(A2ATaskType.ANALYSIS, handler)
    this.handlers.set(A2ATaskType.CLASSIFICATION, handler)
    this.handlers.set(A2ATaskType.CREATION, handler)
    this.handlers.set(A2ATaskType.SEARCH, handler)
    this.handlers.set(A2ATaskType.QUESTION, handler)
    this.handlers.set(A2ATaskType.EXTRACTION, handler)
    this.handlers.set(A2ATaskType.GENERATION, handler)
  }

  private handleConnection(socket: WebSocket): void {
    const sessionId = crypto.randomUUID()

    const session: A2ASession = {
      id: sessionId,
      socket,
      agentId: 'orquidia',
      capabilities: ['orchestrator'],
      connectedAt: Date.now(),
      lastActivity: Date.now(),
      status: 'connected',
    }
    this.sessions.set(sessionId, session)

    socket.on('message', async (data) => {
      const payload = typeof data === 'string' ? data : data.toString('utf8')
      session.lastActivity = Date.now()
      await this.handleMessage(session, payload)
    })

    socket.on('close', () => {
      this.sessions.delete(sessionId)
    })

    socket.on('error', (error) => {
      console.error('[A2A Server] Socket error:', error)
      this.sessions.delete(sessionId)
    })
  }

  private async handleMessage(session: A2ASession, messageRaw: string): Promise<void> {
    const parsed = parseMessage(messageRaw)

    if (!parsed) return

    if (parsed.type === A2AMessageType.REQUEST) {
      const req = parsed as A2ARequest
      const handler = this.handlers.get(req.payload.taskType)
      if (!handler) {
        session.socket.send(
          stringifyMessage(
            createError(req, 400, `No handler for ${req.payload.taskType}`, undefined, true),
          ),
        )
        return
      }

      try {
        const response = await handler(req)
        session.socket.send(stringifyMessage(response))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        session.socket.send(stringifyMessage(createError(req, 500, message, undefined, true)))
      }
    }
  }

  private async handleOrchestrator(req: A2ARequest): Promise<A2AResponse> {
    const start = Date.now()
    const context = req.payload.context ? JSON.stringify(req.payload.context) : undefined

    const result = await this.orchestrator.process(req.payload.input, {
      additionalContext: context,
      skipHistory: true,
    })

    return createResponse(req, true, result.content, 0.75, {
      provider: result.provider,
      model: result.model,
      latencyMs: Date.now() - start,
      tokensUsed: result.tokensUsed,
    })
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimer) return

    this.heartbeatTimer = setInterval(() => {
      for (const session of this.sessions.values()) {
        if (session.socket.readyState !== session.socket.OPEN) continue

        session.socket.send(
          stringifyMessage({
            type: A2AMessageType.HEARTBEAT,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            sessionId: session.id,
            payload: {
              agentId: session.agentId,
              status: 'healthy',
              load: 0.5,
            },
          }),
        )
      }
    }, A2A_CONFIG.heartbeatIntervalMs)
  }

  private stopHeartbeat(): void {
    if (!this.heartbeatTimer) return
    clearInterval(this.heartbeatTimer)
    this.heartbeatTimer = null
  }
}
