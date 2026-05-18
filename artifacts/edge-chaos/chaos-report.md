# Chaos Stress Test Report

## Summary

| Metric | Value |
|--------|-------|
| Status | passed |
| Total scenarios | 8 |
| Passed | 8 |
| Failed | 0 |
| Total duration | 16300 ms |


## ✅ All Tests Passed

All 8 chaos scenarios completed successfully.

## Details

```

Running 8 tests using 2 workers



[1A[2K[1/8] [chromium] › tests/e2e/s02-edge-chaos.spec.ts:64:3 › Edge Chaos — Stale chunk handling › S1: stale chunk served via route interception — page renders without crash
[1A[2K[2/8] [chromium] › tests/e2e/s02-edge-chaos.spec.ts:106:3 › Edge Chaos — Service worker chunk guard › S2: SW intercepts outdated chunks and fetches fresh versions
[1A[2K[3/8] [chromium] › tests/e2e/s02-edge-chaos.spec.ts:137:3 › Edge Chaos — BUILD_ID mismatch › S3: mismatched q:manifest-hash triggers cache invalidation and page reload
[1A[2K[4/8] [chromium] › tests/e2e/s02-edge-chaos.spec.ts:188:3 › Edge Chaos — SWR cache header verification › S4: HTML response includes stale-while-revalidate Cache-Control
[1A[2K[5/8] [chromium] › tests/e2e/s02-edge-chaos.spec.ts:213:3 › Edge Chaos — 404 chunk fallback › S5: 404 for a specific chunk does not break page rendering
[1A[2K[6/8] [chromium] › tests/e2e/s02-edge-chaos.spec.ts:250:5 › Edge Chaos — cross-route smoke › no console errors on /en/signals/apex/tencent-cloud-deal-stack-builders with active SW
[1A[2K[7/8] [chromium] › tests/e2e/s02-edge-chaos.spec.ts:250:5 › Edge Chaos — cross-route smoke › no console errors on /en/signals with active SW
[1A[2K[8/8] [chromium] › tests/e2e/s02-edge-chaos.spec.ts:250:5 › Edge Chaos — cross-route smoke › no console errors on /en/signals/ai-agents with active SW
[1A[2K  8 passed (16.3s)

```
