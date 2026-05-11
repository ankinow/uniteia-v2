---
id: CTX-V2-RECOVERY-01
repo: uniteia-v2
role: consumer
symbol: ♻️
status: active
version: 1.0.0
created_at: 2026-05-11
updated_at: 2026-05-11
source_of_truth: false
depends_on: [CTX-V2-ROOT-01]
hash: SELF
---

# SESSION-RECOVERY — Post-Interruption Protocol (v2)

## 1. Use When
- Session interrupted / agent crashed / context lost
- Resuming work after a break
- New agent taking over a task
- Suspecting stale context

## 2. Recovery Protocol

### Step 1: State Inventory
```
git status --short
git log -5 --oneline
git branch --show-current
git rev-parse HEAD
```

### Step 2: Context Inventory
- AGENTS.md present and readable
- CONTEXT-MAP.md present and readable
- docs/context/*.md present

### Step 3: Stale Context Check
Are there any staged files from prior session?
- If yes: `git diff --cached --stat` → verify they are context docs only
- If non-context files staged: report and request guidance

### Step 4: Task Continuation

If a SESSION_RECOVERY_REPORT exists from prior session, read it and resume from next_step.

If no report exists:
- Re-read AGENTS.md → CONTEXT-MAP.md → task context
- Re-run last verification commands
- Determine safe resume point

## 3. Session Recovery Report Template

```
SESSION_RECOVERY_REPORT
- timestamp: <ISO-8601>
- last_task: <brief description>
- completed_steps:
- next_step:
- files_modified:
- pending_verification:
- risks:
- context_files_to_reload:
```

## 4. Anti-Context-Collapse

- Do not continue from memory
- Always reconstruct state via git + file reads
- Verify every assumption with command output
- If confidence < 0.8, run verification before proceeding
