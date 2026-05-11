---
id: CTX-V2-BOOT-01
repo: uniteia-v2
role: consumer
symbol: φ
status: active
version: 1.0.0
created_at: 2026-05-11
updated_at: 2026-05-11
source_of_truth: false
depends_on: [CTX-V2-ROOT-01]
hash: SELF
---

# AGENT-BOOT-SEQUENCE — Session Startup Checklist (v2)

## 1. Boot Sequence

```
[1] Load AGENTS.md → read repo role, rules, commands
[2] Load CONTEXT-MAP.md → find domain context for task
[3] Load docs/context/README.md → navigate context system
[4] Load task-specific docs/context/*.md
[5] Check package.json scripts → available commands
[6] Check git state: status, log -5, branch, HEAD
[7] Verify no stale artifacts from prior session
[8] Load relevant source files (only what task needs)
[9] Define task scope and write boundary
[10] Begin execution with verification after each step
```

## 2. Post-Restart Recovery

If resuming after interruption:
1. Run SESSION-RECOVERY.md protocol
2. Verify last task state
3. Confirm no incomplete writes
4. Resume from last safe checkpoint

## 3. Verification

After boot:
- Command: `git status --short`
- Expected: clean tracked state (untracked expected per task)
- Check: AGENTS.md exists and is current
