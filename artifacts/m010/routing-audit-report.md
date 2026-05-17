# Routing Audit Report

**Generated:** 2026-05-17T17:15:01.437Z
**Result:** 0 failed · 0 warnings · 4 passed

✅ **All checks passed**

## Audit Results

| Check | Status | Detail |
|---|---|---|
| Hardcoded path audit | ✅ pass | No hardcoded locale paths found in components/routes |
| Query parameter preservation | ✅ pass | Preserved: /pt/signals?q=test |
| Hash fragment preservation | ✅ pass | Preserved: /pt/signals#section-1 |
| Public node route integrity | ✅ pass | All 1 public English nodes have valid routes |

## Coverage Summary

- **8 locales tested:** en, pt, es, fr, de, it, ja, zh
- **Switch pairs:** 8 × 8 = 64 combinations
- **Query/hash preservation:** tested

## Recommendations

- No blocking issues found

- Re-run this script after adding new content or routes
