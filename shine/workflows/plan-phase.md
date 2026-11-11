# Workflow — plan-phase

Turn a phase goal from ROADMAP.md into a set of atomic, reviewable plan files.

## Prerequisites
- ROADMAP.md exists with the target phase.
- REQUIREMENTS.md exists and is sign-off ready.
- `shine/references/ui-brand.md` and `shine/references/questioning.md` are loaded in context.

## Steps

1. **Init**  
   `node shine/bin/shine-tools.cjs init <N> --raw` → `phase_dir`.

2. **Load sources**  
   Read ROADMAP.md, REQUIREMENTS.md, any prior phase SUMMARY.md. Parse with `roadmap --raw` and `requirements --raw`.

3. **Spawn planner**  
   Task tool → `shine-planner` with: phase number, context paths, guardrails (no fabrication, RAG-only).

4. **Write CONTEXT.md**  
   Planner outputs `<phase_dir>/CONTEXT.md` using the template at `shine/templates/context.md`.

5. **Write plan files**  
   Planner outputs N `<phase_dir>/plan-<slug>.md` files. Each has frontmatter with `wave`, `estimate_md`, `depends_on`.

6. **Plan check**  
   Task tool → `shine-plan-checker` with the generated plans. It must confirm: atomic, reviewable, dependency-consistent.

7. **Commit**  
   `node shine/bin/shine-tools.cjs commit "plan phase <N>" --scope plan --raw`

## Decision gates
- After CONTEXT.md: show it to user, ask for corrections before generating plans.
- After plan generation: show plan index (titles + MD estimates) for approval.

## Output
- `<phase_dir>/CONTEXT.md`
- `<phase_dir>/plan-*.md` (one per atomic unit)

## Error handling
- Plan-checker rejects → loop once to re-plan; after 2 failures stop and ask user.
- No REQUIREMENTS.md → refuse to plan; point user to `/shine-new-project` first.
