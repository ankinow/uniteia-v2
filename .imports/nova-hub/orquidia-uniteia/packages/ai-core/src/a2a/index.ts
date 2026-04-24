// =============================================================================
// A2A PROTOCOL - Agent-to-Agent Communication
// =============================================================================
// Purpose: Enable real-time communication between Orquidia and UniTeiaAI
// =============================================================================

export * from './protocol.js'
export { A2AServer, type A2ASession } from './server.js'
export { A2AClient, createA2AClient, type A2AClientState } from './client.js'
