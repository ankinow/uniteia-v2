# error diagnosed
**Failures**: File conflicts → resolve, retry | Permission error

error diagnosed
**Failures**: File conflicts → resolve, retry | Permission errors → check perms, retry | Verification fail → rollback, return to BUILD | Rollback fails → **CRITICAL** → user intervention

---

### DOCS

**In**: APPLY succeeded + user approved code | **Out**: Task docs, MB updates | **Exit**: All docs complete

**CRITICAL**: Only enter after user approved code changes (from APPROVAL state)

**Create**:
1

---
- Domain: ops
- Source: F-0002
- Eval-D⁹: 95
- Actionability: reference
- Promoted: 2026-05-30T04:37:50.133528+00:00
