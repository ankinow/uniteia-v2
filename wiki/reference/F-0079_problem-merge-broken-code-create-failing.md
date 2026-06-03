# Problem:** Merge broken code, create failing PR
- **Fix:** Always verify tests b

Problem:** Merge broken code, create failing PR
- **Fix:** Always verify tests before offering options

**Open-ended questions**
- **Problem:** "What should I do next?" is ambiguous
- **Fix:** Present exactly 4 structured options (or 3 for detached HEAD)

**Cleaning up worktree for Option 2**
- **Problem:** Remove worktree user needs for PR iteration
- **Fix:** Only cleanup for Options 1 and 4

**Deleting branch before removing worktree**
- **Problem:** `git branch -d` fails because worktree sti

---
- Domain: pipeline
- Source: F-0079
- Eval-D⁹: 85
- Actionability: reference
- Promoted: 2026-05-30T04:44:40.762928+00:00
