# Chaos Stress Test Report

## Summary

| Metric | Value |
|--------|-------|
| Status | passed |
| Total scenarios | 8 |
| Passed | 8 |
| Failed | 0 |
| Total duration | 3400 ms |


## ✅ All Tests Passed

All 8 chaos scenarios completed successfully.

## Details

```

Running 8 tests using 2 workers

  ✓  2 [chromium] › tests/e2e/s02-edge-chaos.spec.ts:64:3 › Edge Chaos — Stale chunk handling › S1: stale chunk served via route interception — page renders without crash (3.4s)
  ✓  1 [chromium] › tests/e2e/s02-edge-chaos.spec.ts:106:3 › Edge Chaos — Service worker chunk guard › S2: SW intercepts outdated chunks and fetches fresh versions (7.5s)
  ✓  3 [chromium] › tests/e2e/s02-edge-chaos.spec.ts:137:3 › Edge Chaos — BUILD_ID mismatch › S3: mismatched q:manifest-hash triggers cache invalidation and page reload (5.5s)
  ✓  5 [chromium] › tests/e2e/s02-edge-chaos.spec.ts:210:3 › Edge Chaos — 404 chunk fallback › S5: 404 for a specific chunk does not break page rendering (2.7s)
  ✓  4 [chromium] › tests/e2e/s02-edge-chaos.spec.ts:188:3 › Edge Chaos — SWR cache header verification › S4: HTML response includes stale-while-revalidate Cache-Control (4.8s)
  ✓  7 [chromium] › tests/e2e/s02-edge-chaos.spec.ts:247:5 › Edge Chaos — cross-route smoke › no console errors on /en/signals with active SW (4.5s)
  ✓  6 [chromium] › tests/e2e/s02-edge-chaos.spec.ts:247:5 › Edge Chaos — cross-route smoke › no console errors on /en/signals/apex/magica-overview with active SW (6.2s)
  ✓  8 [chromium] › tests/e2e/s02-edge-chaos.spec.ts:247:5 › Edge Chaos — cross-route smoke › no console errors on /en/signals/ai-agents with active SW (4.4s)

  8 passed (24.4s)

```
