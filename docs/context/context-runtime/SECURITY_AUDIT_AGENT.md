# SECURITY_AUDIT_AGENT.md

## Security Scan Rules

1. **No credentials in code** — check for tokens, API keys, passwords
2. **No debug endpoints in production** — verify ops-lab routes are deliberate
3. **No XSS vectors** — content user input must be sanitized (test-xss fixture exists)
4. **Non-null assertions** — Review `!` in TypeScript; prefer `?.` or guards
5. **eval usage** — Check for unsafe eval in dependencies (gray-matter uses eval for JS engines — documented)

## Previous Findings
- `dog-ceo.ts:204` — fixed `!` → `?.` with guard
- `content-package.test.ts:268` — fixed `result!` → `result?.`
- All non-null assertions audited and resolved in PR #3 branch
