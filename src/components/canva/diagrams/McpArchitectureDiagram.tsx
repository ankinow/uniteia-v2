/**
 * McpArchitectureDiagram — SOTA inline SVG (2026-06)
 *
 * Insight (from spec 2025-11-25, modelcontextprotocol.io):
 *   - SSE was REPLACED by Streamable HTTP in spec 2025-03-26
 *   - Recommended auth: OAuth (bearer, API key, or custom headers supported)
 *   - 1 host → N clients → 1 server each (1:1 connection)
 *   - Data layer (inner): JSON-RPC 2.0, lifecycle, primitives
 *   - Transport layer (outer): stdio (local) | Streamable HTTP (remote)
 *
 * Servers expose: tools, resources, prompts, notifications
 * Clients expose: sampling, roots, elicitation (server can ask client)
 */
import { component$ } from '@builder.io/qwik'

export const McpArchitectureDiagram = component$(() => {
  return (
    <svg
      viewBox="0 0 420 320"
      class="w-full h-auto"
      role="img"
      aria-label="MCP architecture 2025-11-25: host runs N clients, each with 1:1 connection to a server via stdio (local) or Streamable HTTP (remote, OAuth-recommended). Data layer: JSON-RPC 2.0 with tools, resources, prompts primitives"
    >
      <defs>
        <marker
          id="mcp-arrow-2"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(75% 0.18 200)" />
        </marker>
      </defs>

      {/* HOST block */}
      <g font-family="JetBrains Mono, monospace" font-size="9" fill="oklch(90% 0.02 75)">
        <rect
          x="20"
          y="20"
          width="380"
          height="80"
          fill="oklch(15% 0.02 260 / 0.6)"
          stroke="oklch(78% 0.2 145)"
          stroke-width="1.5"
        />
        <text x="35" y="38" font-weight="bold" fill="oklch(78% 0.2 145)">
          MCP HOST
        </text>
        <text x="35" y="50" font-size="8" fill="oklch(60% 0.02 75)">
          AI app: Claude Desktop · Cursor · IDE · Hermes
        </text>

        {/* 3 clients inside host */}
        {[
          { x: 80, y: 70, label: 'Client 1', server: 'Filesystem' },
          { x: 200, y: 70, label: 'Client 2', server: 'Postgres' },
          { x: 320, y: 70, label: 'Client 3', server: 'Sentry (remote)' },
        ].map(c => (
          <g key={c.label}>
            <rect
              x={c.x - 50}
              y={c.y - 12}
              width="100"
              height="22"
              fill="oklch(10% 0.01 260 / 0.8)"
              stroke="oklch(75% 0.18 200)"
              stroke-width="1"
            />
            <text x={c.x} y={c.y + 3} text-anchor="middle" font-size="8" fill="oklch(75% 0.18 200)">
              {c.label}
            </text>
            <text x={c.x} y={c.y + 16} text-anchor="middle" font-size="7" fill="oklch(60% 0.02 75)">
              → {c.server}
            </text>
          </g>
        ))}
      </g>

      {/* TRANSPORT layer label */}
      <g
        font-family="JetBrains Mono, monospace"
        font-size="8"
        fill="oklch(60% 0.02 75)"
        letter-spacing="0.05em"
      >
        <text x="20" y="118">
          TRANSPORT LAYER (outer) · JSON-RPC 2.0 framed
        </text>
      </g>

      {/* TRANSPORT boxes (per-client) */}
      <g font-family="JetBrains Mono, monospace" font-size="9" fill="oklch(90% 0.02 75)">
        <rect
          x="30"
          y="130"
          width="100"
          height="40"
          fill="oklch(15% 0.02 260 / 0.6)"
          stroke="oklch(72% 0.165 80)"
          stroke-width="1"
        />
        <text
          x="80"
          y="148"
          text-anchor="middle"
          font-size="9"
          font-weight="bold"
          fill="oklch(72% 0.165 80)"
        >
          stdio
        </text>
        <text x="80" y="160" text-anchor="middle" font-size="7" fill="oklch(60% 0.02 75)">
          local process
        </text>

        <rect
          x="150"
          y="130"
          width="100"
          height="40"
          fill="oklch(15% 0.02 260 / 0.6)"
          stroke="oklch(72% 0.165 80)"
          stroke-width="1"
        />
        <text
          x="200"
          y="148"
          text-anchor="middle"
          font-size="9"
          font-weight="bold"
          fill="oklch(72% 0.165 80)"
        >
          stdio
        </text>
        <text x="200" y="160" text-anchor="middle" font-size="7" fill="oklch(60% 0.02 75)">
          local process
        </text>

        <rect
          x="270"
          y="130"
          width="130"
          height="40"
          fill="oklch(15% 0.02 260 / 0.6)"
          stroke="oklch(78% 0.2 145)"
          stroke-width="1.5"
        />
        <text
          x="335"
          y="148"
          text-anchor="middle"
          font-size="9"
          font-weight="bold"
          fill="oklch(78% 0.2 145)"
        >
          Streamable HTTP
        </text>
        <text x="335" y="160" text-anchor="middle" font-size="7" fill="oklch(60% 0.02 75)">
          remote · OAuth 2.1
        </text>
      </g>

      {/* DATA LAYER (inside transport) */}
      <g
        font-family="JetBrains Mono, monospace"
        font-size="8"
        fill="oklch(60% 0.02 75)"
        letter-spacing="0.05em"
      >
        <text x="20" y="190">
          DATA LAYER (inner) · JSON-RPC 2.0 messages
        </text>
      </g>

      {/* Primitives row */}
      <g font-family="JetBrains Mono, monospace" font-size="9" fill="oklch(90% 0.02 75)">
        <rect
          x="20"
          y="200"
          width="380"
          height="50"
          fill="oklch(15% 0.02 260 / 0.6)"
          stroke="oklch(75% 0.18 200)"
          stroke-width="1"
        />
        <text x="35" y="220" font-weight="bold" fill="oklch(75% 0.18 200)">
          SERVER PRIMITIVES
        </text>
        {[
          { x: 70, label: 'tools' },
          { x: 150, label: 'resources' },
          { x: 250, label: 'prompts' },
          { x: 350, label: 'notifications' },
        ].map(p => (
          <g key={p.label}>
            <rect
              x={p.x - 35}
              y={228}
              width="70"
              height="16"
              fill="oklch(10% 0.01 260 / 0.8)"
              stroke="oklch(60% 0.02 260)"
              stroke-width="0.5"
            />
            <text x={p.x} y={240} text-anchor="middle" font-size="8" fill="oklch(90% 0.02 75)">
              {p.label}
            </text>
          </g>
        ))}
      </g>

      {/* CLIENT PRIMITIVES */}
      <g font-family="JetBrains Mono, monospace" font-size="9" fill="oklch(90% 0.02 75)">
        <rect
          x="20"
          y="260"
          width="380"
          height="48"
          fill="oklch(15% 0.02 260 / 0.6)"
          stroke="oklch(72% 0.165 80)"
          stroke-width="1"
        />
        <text x="35" y="278" font-weight="bold" fill="oklch(72% 0.165 80)">
          CLIENT PRIMITIVES (server-initiated)
        </text>
        {[
          { x: 80, label: 'sampling' },
          { x: 180, label: 'roots' },
          { x: 280, label: 'elicitation' },
        ].map(p => (
          <g key={p.label}>
            <rect
              x={p.x - 40}
              y={288}
              width="80"
              height="14"
              fill="oklch(10% 0.01 260 / 0.8)"
              stroke="oklch(60% 0.02 260)"
              stroke-width="0.5"
            />
            <text x={p.x} y={298} text-anchor="middle" font-size="8" fill="oklch(90% 0.02 75)">
              {p.label}
            </text>
          </g>
        ))}
      </g>

      {/* Spec callout */}
      <text
        x="210"
        y="318"
        text-anchor="middle"
        font-family="JetBrains Mono, monospace"
        font-size="7"
        fill="oklch(60% 0.02 75)"
      >
        SPEC 2025-11-25 · Linux Foundation Agentic AI Foundation · TypeScript + Python + Go SDKs
      </text>
    </svg>
  )
})
