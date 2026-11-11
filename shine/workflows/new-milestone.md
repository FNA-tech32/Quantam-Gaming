# Workflow — new-milestone

Create a new milestone: scaffold its section in ROADMAP.md, create its first phase, prime context.

## Prerequisites
- Project exists (ROADMAP.md present).
- Previous milestone archived or explicitly still-active.

## Steps
1. **Discovery** — if no brief supplied, load `shine/references/questioning.md` and run:
   - one outcome-sentence
   - primary audience / user
   - success metric (measurable)
   - timeline + budget envelope
   - MoSCoW on initial phase list
2. **Scaffold** — insert into ROADMAP.md under `## Milestone <slug> — <title>`:
   ```
   ## Milestone <slug> — <title>  [active]
   Goal: …
   Success metric: …
   
   ### Phase 1 — <name>  [todo]
   ### Phase 2 — …  [todo]
   ```
3. **Create first phase dir** — `.shine/phases/phase-<NN>-<slug>/` with `CONTEXT.md` from template.
4. **Fill CONTEXT.md** — "Cosa sappiamo / assumiamo / NON sappiamo" blocks pre-populated from discovery.
5. **Plan gate** — offer `/shine-plan-phase <N>` as next action.
6. **Commit** — `shine-tools.cjs commit "milestone <slug>: scaffold" --scope milestone`.

## Decision gates
- After discovery: confirm scope before writing any file.
- Before commit: show ROADMAP diff.

## Guardrails
- Never overwrite existing milestone with the same slug — append `-v2` and warn.
- Never skip discovery for client work — if user tries to skip, surface the red-flags list from `questioning.md`.
