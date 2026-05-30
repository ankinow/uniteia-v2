# errors (warnings OK with justification), coverage meets threshold, build succeed

errors (warnings OK with justification), coverage meets threshold, build succeeds
**Exit (CONDITIONAL)**: Tests fail with documented waiver OR user grants waiver

**Failures**: Tests fail → synthesize minimal patch, return to BUILD | Lint errors → fix, retry | Build fails → diagnose, return to BUILD

**Retry Protocol**:
- 1st fail: Analyze output, minimal fix, re-test
- 2nd fail: Re-analyze approach, check environment, fix, re-test
- 3rd fail: **STALL DETECTED** → request user input or agent swa

---
- Domain: pipeline
- Source: F-0018
- Eval-D⁹: 85
- Actionability: reference
- Promoted: 2026-05-30T04:37:50.134598+00:00
