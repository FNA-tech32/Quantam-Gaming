# Workflow — next

Priority-recommendation algorithm. Answers "what should I work on now?" in one concrete slash-command.

## Prerequisites
- Project with a ROADMAP.md (if none, route to `/shine-new-project`).

## Steps
1. **Load state** — `shine-tools.cjs roadmap --raw` + for each in-progress phase: `state <N> --raw`.
2. **Detect blockers** — any state with `status=blocked` or notes containing "BLOCKED:".
3. **Detect open questions** — scan current phase CONTEXT.md for unresolved `[ ]` checkboxes in "Open questions".
4. **Apply priority algorithm** (first match wins):
   1. **Blocker resolution** → recommend `/shine-debug <blocker>` or manual escalation
   2. **Open questions on current phase** → recommend `/shine-discuss-phase <N>`
   3. **Phase has plan, not executed** → `/shine-execute-phase <N>`
   4. **Phase has no plan** → `/shine-plan-phase <N>`
   5. **All current-phase work done** → `/shine-verify-work <N>` then `/shine-next` again
   6. **Current phase verified** → `/shine-execute-phase <N+1>` (next in roadmap)
   7. **All phases done** → `/shine-ship`
5. **Output** — single recommendation with one-line rationale + the exact slash command to run.

## Output format
```
→ Recommended next: /shine-<command> [args]
  Why: <one-line rationale referencing the state that triggered it>
  Alt:  /shine-<alternative> (if you prefer <reason>)
```

## Error handling
- Roadmap missing → `/shine-new-project` instead.
- Conflicting state (plan exists but marked todo) → surface conflict, ask user.
