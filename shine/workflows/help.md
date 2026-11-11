# Workflow — help

Short, opinionated orientation for SHINE. Shown on `/shine-help`.

## Steps

1. Print the one-line banner: `✨ SHINE — Strategize · Handle · Implement · Navigate · Evaluate`.
2. Print the 5 most useful commands for a new user:
   - `/shine-new-project` — scaffold a project with REQUIREMENTS and ROADMAP
   - `/shine-plan-phase <N>` — turn a roadmap phase into atomic plans
   - `/shine-execute-phase <N>` — run the plans with wave parallelism
   - `/shine-verify-work <N>` — goal-backward check before shipping
   - `/shine-quick "<ask>"` — single-shot small change
3. Point to docs:
   - `~/.claude/docs/HOW-IT-WORKS.md` — full narrative
   - `~/.claude/docs/AGENCY-WORKFLOWS.md` — 16 agency playbooks
   - `~/.claude/docs/CUSTOMIZATION.md` — how to extend
4. Show current profile: `node shine/bin/shine-tools.cjs config-get model_profile --raw`.
5. Show active workstream if any: `workstream progress --raw`.

## Output
Plain-text summary, ≤ 40 lines.
