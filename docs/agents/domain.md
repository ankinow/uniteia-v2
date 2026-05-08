# Domain Docs Configuration

## Layout Type
**Multi-context** — `CONTEXT-MAP.md` at root points to per-context `CONTEXT.md` files.

## Structure

### Root Mapping File
`CONTEXT-MAP.md` (at repository root)

### Context Files
Each context has its own `CONTEXT.md` and `docs/adr/` directory.

## Contexts

| Context | CONTEXT.md Location | ADR Directory | Description |
|---------|---------------------|---------------|-------------|
| singularity | `content/singularity/CONTEXT.md` | `content/singularity/docs/adr/` | AI/LLM content niche |
| hardware | `content/hardware/CONTEXT.md` | `content/hardware/docs/adr/` | Hardware reviews and guides |
| dev | `content/dev/CONTEXT.md` | `content/dev/docs/adr/` | Development tools and practices |
| privacy | `content/privacy/CONTEXT.md` | `content/privacy/docs/adr/` | Privacy and security content |
| apex | `CONTEXT.md` | `docs/adr/` | Apex landing and cross-niche content |
| infrastructure | `CONTEXT.md` | `docs/adr/` | Qwik-City, Tailwind, Cloudflare setup |
| i18n | `CONTEXT.md` | `docs/adr/` | Internationalization system |
| jrpg-sidebar | `CONTEXT.md` | `docs/adr/` | JRPG-style sidebar and layout |

## Consumer Rules

### For Skills (`improve-codebase-architecture`, `diagnose`, `tdd`)
1. Read `CONTEXT-MAP.md` to identify relevant context
2. Read the appropriate `CONTEXT.md` for domain language
3. Read `docs/adr/` for architectural decisions in that context
4. Keep context isolated — don't mix decisions between contexts

### Reading Order
1. `CONTEXT-MAP.md` (root)
2. Relevant `CONTEXT.md` (per context)
3. `docs/adr/` (per context)

## Notes
- Each niche (singularity, hardware, dev, privacy) is a separate context
- Apex, infrastructure, i18n, and jrpg-sidebar are also separate contexts
- This allows skills to focus on specific areas without noise from others
