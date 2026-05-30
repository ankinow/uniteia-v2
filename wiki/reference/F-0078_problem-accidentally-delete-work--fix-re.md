# Problem:** Accidentally delete work
- **Fix:** Require typed "discard" confirmat

Problem:** Accidentally delete work
- **Fix:** Require typed "discard" confirmation

## Red Flags

**Never:**
- Proceed with failing tests
- Merge without verifying tests on result
- Delete work without confirmation
- Force-push without explicit request
- Remove a worktree before confirming merge success
- Clean up worktrees you didn't create (provenance check)
- Run `git worktree remove` from inside the worktree

**Always:**
- Verify tests before offering options
- Detect environment before pre

---
- Domain: ui
- Source: F-0078
- Eval-D⁹: 85
- Actionability: reference
- Promoted: 2026-05-30T04:36:22.611165+00:00
