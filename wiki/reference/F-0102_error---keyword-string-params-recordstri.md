# Error = { keyword: string; params: Record<string, unknown>; message?: string; in

Error = { keyword: string; params: Record<string, unknown>; message?: string; instancePath?: string };
4: 
5: function isObject(v: unknown): v is Record<string, unknown> {
6:   return typeof v === "object" && v !== null && !Array

---
- Domain: security
- Source: F-0102
- Eval-D⁹: 100
- Actionability: reference
- Promoted: 2026-05-30T04:36:22.611423+00:00
