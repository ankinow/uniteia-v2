# Issue Tracker Configuration

## Tracker Type
GitHub Issues

## Repository
`ankinow/uniteia-v2`

## CLI Tool
`gh` (GitHub CLI)

## Workflow

### Creating Issues
```bash
gh issue create --repo ankinow/uniteia-v2 --title "Title" --body "Body" --label "needs-triage"
```

### Listing Issues
```bash
gh issue list --repo ankinow/uniteia-v2 --label "ready-for-agent"
```

### Updating Issues
```bash
gh issue edit ISSUE_NUMBER --repo ankinow/uniteia-v2 --label "ready-for-human"
```

## Issue Templates
- Located in: `.github/ISSUE_TEMPLATE/`
- Use `gh issue create --repo ankinow/uniteia-v2 --template <template-name>`

## Notes
- All engineering skills (`to-issues`, `triage`, `to-prd`) use this configuration
- Ensure `gh` CLI is authenticated: `gh auth status`
- For CI/CD, set `GITHUB_TOKEN` environment variable
