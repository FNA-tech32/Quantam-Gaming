# Workflow — plant-seed

Capture an idea for later triage without breaking current focus. Seeds are reviewed periodically and promoted to plans or discarded.

## Prerequisites
- None — this should be instant and non-disruptive.

## Steps

1. **Accept the seed**  
   One-line idea + optional context (why it matters, rough scope).

2. **Format and persist**  
   Append to `~/.claude/memory/backlog-seeds.md`:
   ```
   - [ ] <idea> — <context if any>
     _Planted: <date> · Source: <current phase or "freeform">_
   ```

3. **Tag if obvious**  
   If the seed clearly relates to a client or project, add a tag:
   `[client-acme]`, `[project-shine]`, `[internal]`.

4. **Suggest review cadence**  
   If this is the first seed: _"💡 Tip: review seeds weekly with `/shine-plant-seed --review`."_

5. **Review mode** (if `--review` flag)  
   Read `backlog-seeds.md`. For each unchecked seed:
   - Show the seed with its age.
   - Options:
     - **Promote** → create a TODO (`/shine-add-todo`) or a phase (`/shine-add-phase`)
     - **Keep** → leave in backlog for next review
     - **Discard** → check off with `[discarded: <reason>]`
   Seeds older than 60 days without action → flag for decision.

6. **Return silently**  
   `🌱 Seed planted.` — one line, do not interrupt current task.

## Guardrails
- Never auto-promote a seed to a plan — always require user decision.
- Never delete seeds — mark as discarded with reason (audit trail).
