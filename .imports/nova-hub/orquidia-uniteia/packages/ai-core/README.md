# @orquestra/ai-core

## Orquidia AI Orchestration Engine - SOTA 2026 Edition

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORQUIDIA AI CORE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  TanStack    │───>│  LangChain   │───>│  Rust WASM   │      │
│  │  Start UI    │    │  Orchestrator│    │  Inference   │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │               │
│         │                   │                   │               │
│         v                   v                   v               │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              A2A WebSocket Gateway                   │       │
│  │         (Orquidia ↔ UniTeiaAI Communication)         │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Orchestration** | LangChain.js + LangGraph | Multi-step reasoning, tool use, prompt optimization |
| **Inference** | Rust (WASM) | Fast, local operations (similarity, classification, extraction) |
| **LLM Backend** | Gemini/Groq/Workers AI | Heavy reasoning (API calls) |
| **Communication** | A2A WebSocket | Real-time messaging with UniTeiaAI gateway |

### Key Features

1. **Hybrid Inference Model**
   - **Rust WASM**: Fast, local operations (<1ms latency)
     - Cosine similarity search
     - Keyword extraction
     - Sentiment analysis
     - Text classification
     - Entity extraction (emails, URLs, numbers)
   - **LLM APIs**: Complex reasoning and generation
     - Gemini 1.5 Pro
     - Groq (Llama 3.1)
     - Cloudflare Workers AI

2. **LangGraph Workflow**
   - Intent analysis → Task routing → Tool execution → Response generation
   - Fallback chain: Workers AI → Groq → Gemini

3. **AgentOps Ready**
   - Structured logging
   - Performance metrics (latency, token usage)
   - Error handling and recovery

### Usage

```typescript
import { OrchestratorAgent } from '@orquestra/ai-core'

const agent = new OrchestratorAgent({
  geminiApiKey: process.env.GEMINI_API_KEY,
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
})

agent.initialize()

const result = await agent.process('Analyze the sentiment of this product review and extract key features', {
  additionalContext: JSON.stringify({ userId: '123', sessionId: 'abc' }),
})

console.log(result.content)
```

### Build Commands

```bash
# Install dependencies
bun install

# Build Rust WASM module
bun run build:rust

# Build TypeScript
bun run build:ts

# Run tests
bun test
```

### Project Structure

```
packages/ai-core/
├── src/
│   ├── agents/
│   │   ├── orchestrator.ts       # Main orchestrator (providers + fallback)
│   │   └── index.ts
│   ├── rust/
│   │   ├── src/
│   │   │   ├── lib.rs           # WASM entry point
│   │   │   ├── models.rs        # Serialization models
│   │   │   └── inference.rs     # Core algorithms
│   │   ├── Cargo.toml
│   │   └── index.ts             # TS wrapper
│   ├── generators/
│   ├── providers/
│   ├── context.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

### Integration with UniTeiaAI

The Orquidia AI Core acts as the "brain" for the UniTeiaAI gateway via A2A WebSocket protocol:

1. UniTeiaAI Gateway receives user request
2. Complex queries are routed to Orquidia via WebSocket
3. Orquidia processes using LangChain.js + Rust WASM
4. Results are streamed back to UniTeiaAI
5. UniTeiaAI renders response to user

---

*Powered by SOTA 2026 Standards*
