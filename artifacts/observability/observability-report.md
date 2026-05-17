# Observability Capture Report

## Summary

| Metric | Value |
|--------|-------|
| Status | ✅ PASSED |
| Test suites | 2 |
| Total tests | 19 |
| Passed | 19 |
| Failed | 0 |
| Total duration | 32600 ms |
| Traces captured | 19 |

## Per-Suite Results

| Suite | Status | Tests | Passed | Failed | Duration | Traces |
|-------|--------|-------|--------|--------|----------|--------|
| edge-chaos | ✅ | 8 | 8 | 0 | 32600ms | 8 |
| hydration-resilience | ✅ | 11 | 11 | 0 | 0ms | 11 |

## Trace Artifacts

### edge-chaos

- `artifacts/observability/traces/trace-edge-chaos-1.zip` (253.4 KB)
- `artifacts/observability/traces/trace-edge-chaos-2.zip` (398.3 KB)
- `artifacts/observability/traces/trace-edge-chaos-3.zip` (288.7 KB)
- `artifacts/observability/traces/trace-edge-chaos-4.zip` (256.5 KB)
- `artifacts/observability/traces/trace-edge-chaos-5.zip` (225.1 KB)
- `artifacts/observability/traces/trace-edge-chaos-6.zip` (362.0 KB)
- `artifacts/observability/traces/trace-edge-chaos-7.zip` (311.7 KB)
- `artifacts/observability/traces/trace-edge-chaos-8.zip` (486.9 KB)

### hydration-resilience

- `artifacts/observability/traces/trace-hydration-resilience-1.zip` (256.9 KB)
- `artifacts/observability/traces/trace-hydration-resilience-2.zip` (319.9 KB)
- `artifacts/observability/traces/trace-hydration-resilience-3.zip` (229.0 KB)
- `artifacts/observability/traces/trace-hydration-resilience-4.zip` (258.3 KB)
- `artifacts/observability/traces/trace-hydration-resilience-5.zip` (289.1 KB)
- `artifacts/observability/traces/trace-hydration-resilience-6.zip` (227.4 KB)
- `artifacts/observability/traces/trace-hydration-resilience-7.zip` (258.3 KB)
- `artifacts/observability/traces/trace-hydration-resilience-8.zip` (256.8 KB)
- `artifacts/observability/traces/trace-hydration-resilience-9.zip` (412.7 KB)
- `artifacts/observability/traces/trace-hydration-resilience-10.zip` (311.5 KB)
- `artifacts/observability/traces/trace-hydration-resilience-11.zip` (595.0 KB)

## Raw Output

### edge-chaos

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
[1A[2K  8 passed (32.6s)

```

### hydration-resilience

```

Running 11 tests using 2 workers



[1A[2K[1/11] [chromium] › tests/e2e/s03-hydration-resilience.spec.ts:103:3 › S03: Hydration Resilience — CPU Throttling › T1b: niche landing hydrates under 4x CPU slowdown
[1A[2K[2/11] [chromium] › tests/e2e/s03-hydration-resilience.spec.ts:86:3 › S03: Hydration Resilience — CPU Throttling › T1a: article route hydrates under 4x CPU slowdown
[1A[2K[3/11] [chromium] › tests/e2e/s03-hydration-resilience.spec.ts:117:3 › S03: Hydration Resilience — CPU Throttling › T1c: niche index hydrates under 4x CPU slowdown
[1A[2K[4/11] [chromium] › tests/e2e/s03-hydration-resilience.spec.ts:133:3 › S03: Hydration Resilience — Delayed Chunks › T1d: page hydrates with 2s delayed chunks
[1A[2K[5/11] [chromium] › tests/e2e/s03-hydration-resilience.spec.ts:167:3 › S03: Hydration Resilience — Combined Stress › T1e: page renders with 4x CPU throttle AND delayed chunks
[1A[2K[6/11] [chromium] › tests/e2e/s03-hydration-resilience.spec.ts:200:3 › S03: BUILD_ID Version Check Under Throttle › T2a: BUILD_ID mismatch triggers reload under 4x CPU throttle
[1A[2K[7/11] [chromium] › tests/e2e/s03-hydration-resilience.spec.ts:245:3 › S03: Error Recovery Boundary › T3a: page renders fallback when all Qwik JS chunks return 500
[1A[2K[8/11] [chromium] › tests/e2e/s03-hydration-resilience.spec.ts:279:3 › S03: Error Recovery Boundary › T3b: page gracefully handles abort of all Qwik chunks
[1A[2K[9/11] [chromium] › tests/e2e/s03-hydration-resilience.spec.ts:322
...(output truncated)
```
