# broken):**
- ⚠️ BUG-007 (Critical): 404 handler — locale-prefixed 404s work corr

broken):**
- ⚠️ BUG-007 (Critical): 404 handler — locale-prefixed 404s work correctly (`/en/nonexistent-article` shows "404 - Page Not Found | UniTeia"), BUT root-level non-locale paths still error with "Language X is not supported"

**STILL BROKEN:**
- ❌ GAP-002 (Low): `/privacy` without locale redirect — same root issue, shows "Language 'privacy' is not supported"

**NEW FINDING:**
- ❌ Root-level catch-all: `/404`, `/privacy`, `/nonexistent-page` all fail with language negotiation error

The r

---
- Domain: content
- Source: F-0066
- Eval-D⁹: 95
- Actionability: reference
- Promoted: 2026-05-30T04:36:22.610085+00:00
