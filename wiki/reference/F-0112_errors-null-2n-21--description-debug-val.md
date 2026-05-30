# errors, null, 2));\n\" 2>&1",
  "description": "Debug validator errors",
  "time

errors, null, 2));\n\" 2>&1",
  "description": "Debug validator errors",
  "timeout": 10000
}
```

**Output:**
```
[
  {
    "keyword": "pattern",
    "params": {
      "pattern": "^[A-Z_]+$"
    },
    "message": "apiKeyEnv must be UPPER_SNAKE_CASE",
    "instancePath": "/providers/0/apiKeyEnv"
  },
  {
    "keyword": "pattern",
    "params": {
      "pattern": "^[A-Z_]+$"
    },
    "message": "apiKeyEnv must be UPPER_SNAKE_CASE",
    "instancePath": "/providers/1/apiKeyEnv"
  },
  {
    "keyw

---
- Domain: ops
- Source: F-0112
- Eval-D⁹: 85
- Actionability: reference
- Promoted: 2026-05-30T04:37:50.138239+00:00
