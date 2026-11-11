# Workflow — manager

Session orchestration across multiple phases / workstreams / clients. Use at session start to plan the hour, or mid-session to reprioritize.

## Prerequisites
- At least one active project or workstream.

## Steps
1. **Inventory** — load:
   - all in-progress phases across current project (`roadmap --raw`)
   - all active workstreams (`workstream list --raw`)
   - recent PM digest if exists (`Glob ~/.claude/memory/pm-digest-*.md` newest)
2. **Status roll-up** — 🟢 on-track · 🟡 at-risk · 🔴 blocked per item.
3. **Time budget** — ask user: _"How much focused time do you have?"_ → map items to slots.
4. **Priority order** — blockers first, deadline-critical next, then high-leverage quick wins.
5. **Session plan** — ordered checklist of concrete actions (each a slash command).
6. **Handoff hooks** — if an item belongs to a subagent (planner/executor/debugger), flag for delegation.

## Output format
```
## Session plan — <duration>
1. [15 min] /shine-debug <blocker>          🔴
2. [30 min] /shine-execute-phase 3 wave 2   🟡  deadline Fri
3. [15 min] /shine-verify-work 2            🟢
4. [? min]  /shine-next                     (reassess)
```

## Decision gates
- Confirm duration estimate before committing plan.
- After each item, offer `/shine-next` to reassess.

## Guardrails
- Never batch high-risk items (destructive ops, client-facing sends) into unattended runs.
- Respect client-confidentiality — don't cross-reference across clients in output.
