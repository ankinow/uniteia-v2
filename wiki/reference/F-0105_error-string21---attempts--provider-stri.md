# error?: string;
21:   attempts: { provider: string; model: string; error?: strin

error?: string;
21:   attempts: { provider: string; model: string; error?: string }[];
22: }
23: 
24: export class ProviderRouter {
25:   private providers: ProviderEndpoint[];
26: 
27:   constructor(providers?: ProviderEndpoint[]) {
28:     this

---
- Domain: ops
- Source: F-0105
- Eval-D⁹: 85
- Actionability: reference
- Promoted: 2026-05-30T04:36:22.611689+00:00
