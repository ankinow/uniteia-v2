---
name: output-enforcement
description: Anti-truncation, anti-placeholder — ensure complete outputs
license: MIT
compatibility: [claude-code, cursor, codex, windsurf, opencode]
source: forked from Leonxlnx/taste-skill/output-skill
---

# Output Enforcement

Ensure complete, non-truncated outputs.

## Rules

### No Truncation

Never end mid-sentence. If approaching token limit, wrap up cleanly.

### No Placeholders

- ❌ `// TODO: implement this`
- ❌ `/* more code here */`
- ❌ `...`
- ❌ `[rest of implementation]`

### No Stub Functions

```tsx
// ❌ BANNED
function processData(data) {
  // implement later
}

// ✅ REQUIRED
function processData(data: ProcessInput): ProcessOutput {
  const validated = validateInput(data)
  const transformed = transformData(validated)
  return formatOutput(transformed)
}
```

## Completeness Check

Before marking task complete, verify:

1. All functions have bodies (not stubs)
2. All components render (not placeholders)
3. All tests pass (not skipped)
4. All imports resolve (not commented out)

## Error Handling

If can't complete, say so explicitly:

```
I cannot complete this task because [reason]. 
What I've completed: [list]
What remains: [list]
```

## From taste-skill

Adopted integrally from `output-skill` without modification.
