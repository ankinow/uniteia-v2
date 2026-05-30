# Problem:** Accidentally delete work
1467: - **Fix:** Require typed "discard" con

Problem:** Accidentally delete work
1467: - **Fix:** Require typed "discard" confirmation
1468: 
1469: ## Red Flags
1470: 
1471: **Never:**
1472: - Proceed with failing tests
1473: - Merge without verifying tests on result
1474: - Delete work without confirmation
1475: - Force-push without explicit request
1476: - Remove a worktree before confirming merge success
1477: - Clean up worktrees you didn't create (provenance check)
1478: - Run `git worktree remove` from inside the worktree
1479: 
1480

---
- Domain: ui
- Source: F-0069
- Eval-D⁹: 85
- Actionability: reference
- Promoted: 2026-05-30T04:37:50.135722+00:00
