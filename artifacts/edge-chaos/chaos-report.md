# Chaos Stress Test Report

## Summary

| Metric | Value |
|--------|-------|
| Status | partial |
| Total scenarios | 3 |
| Passed | 1 |
| Failed | 2 |
| Total duration | 24100 ms |
| Errors | 4 |

## ❌ Failures

- Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
- Error: element(s) not found
- Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
- Error: element(s) not found

## Details

```

Running 8 tests using 2 workers



[1A[2K[1/8] [chromium] › tests/e2e/s02-edge-chaos.spec.ts:64:3 › Edge Chaos — Stale chunk handling › S1: stale chunk served via route interception — page renders without crash
[1A[2K[2/8] [chromium] › tests/e2e/s02-edge-chaos.spec.ts:104:3 › Edge Chaos — Service worker chunk guard › S2: SW intercepts outdated chunks and fetches fresh versions
[1A[2K  1) [chromium] › tests/e2e/s02-edge-chaos.spec.ts:64:3 › Edge Chaos — Stale chunk handling › S1: stale chunk served via route interception — page renders without crash 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

    Locator: locator('[data-testid="article-frame"]')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
    [2m  - Expect "toBeVisible" with timeout 5000ms[22m
    [2m  - waiting for locator('[data-testid="article-frame"]')[22m


      77 |
      78 |     await gotoAndAssertNegotiation(page, '/en/signals/apex/magica-overview')
    > 79 |     await expect(page.locator('[data-testid="article-frame"]')).toBeVisible()
         |                                                                 ^
      80 |
      81 |     // Check that the page headline renders despite stale chunks
      82 |     await expect(page.getByRole('heading', { name: 'Magica AI Platform — Overview' })).toBeVisible()
        at /home/lermf/uniteia-v2/tests/e2e/s02-edge-chaos.spec.ts:79:65

    Error Context: test-results/s02-edge-chaos-Edge-Chaos--5aec9--page-renders-without-crash-chromium/error-context.md


[1A[2K[3/8] [chromium] › tests/e2e/s02-edge-chaos.spec.ts:186:3 › Edge Chaos — SWR cache header verification › S4: HTML response includes stale-while-revalidate Cache-Control

[1A[2K[4/8] [chromium] › tests/e2e/s02-edge-chaos.spec.ts:135:3 › Edge Chaos — BUILD_ID mismatch › S3: mismatched q:manifest-hash triggers cache invalidation and page reload
[1A[2K  2) [chromium] › tests/e2e/s02-edge-chaos.spec
...(output truncated)
```
