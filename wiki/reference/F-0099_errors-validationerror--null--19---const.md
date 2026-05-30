# errors: ValidationError[] | null } {
19:   const errors: ValidationError[] = [];

errors: ValidationError[] | null } {
19:   const errors: ValidationError[] = [];
20: 
21:   if (!isObject(data)) {
22:     return { valid: false, errors: [{ keyword: "type", params: { type: "object" }, message: "must be object", instancePath: "" }] };
23:   }
24: 
25:   const required = (schema

---
- Domain: ops
- Source: F-0099
- Eval-D⁹: 85
- Actionability: reference
- Promoted: 2026-05-30T04:37:50.137378+00:00
