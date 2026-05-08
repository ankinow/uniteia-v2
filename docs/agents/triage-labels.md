# Triage Label Vocabulary

## Canonical Roles

| Role | Label | Description |
|------|-------|-------------|
| Needs evaluation | `needs-triage` | Maintainer needs to evaluate the issue |
| Waiting on reporter | `needs-info` | Awaiting response from issue reporter |
| Ready for agent | `ready-for-agent` | Fully specified, AFK-ready (agent can pick up with no human context) |
| Ready for human | `ready-for-human` | Needs human implementation |
| Won't fix | `wontfix` | Issue will not be actioned |

## Usage

### Default State
New issues should be labeled with `needs-triage` initially.

### State Machine Flow
```
needs-triage → needs-info (if missing details)
needs-triage → ready-for-agent (if fully specified)
needs-triage → ready-for-human (if needs human touch)
needs-triage → wontfix (if not actionable)
needs-info → needs-triage (when info provided)
```

### Custom Labels
No custom labels configured. Using defaults.

## GitHub Colors (Suggested)
- `needs-triage`: #fbca04 (yellow)
- `needs-info`: #ff9500 (orange)
- `ready-for-agent`: #00e0ff (cyan, matches SolarLanso)
- `ready-for-human`: #5cd68f (vine, matches SolarLanso)
- `wontfix`: #999999 (gray)
