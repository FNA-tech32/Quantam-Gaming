# Workflow — discuss-phase

Interactive discussion to surface assumptions and align on phase scope BEFORE planning.

## Prerequisites
- Phase is listed in ROADMAP.md (may be in 'todo' status).
- User is available for back-and-forth.

## Steps

1. **Init & read**  
   `node shine/bin/shine-tools.cjs init <N> --raw`. Read existing CONTEXT.md if any.

2. **Questioning loop**  
   Apply `shine/references/questioning.md` — one question at a time:
   - 5-Why ladder on the stated outcome
   - MoSCoW prompts
   - Assumption surfacing checklist

3. **Record as we go**  
   Append each confirmed answer to `<phase_dir>/CONTEXT.md` under the right section.

4. **Surface red flags**  
   If any red flag from questioning.md §7 fires, pause — do not push into planning.

5. **Close the loop**  
   At end: read back the brief. Confirm sign-off. `config-get discussion.auto_plan` — if true, immediately invoke plan-phase.

## Decision gates
- After each answer: checkpoint ("did I capture that right?").
- Before closing: explicit user confirmation.

## Output
- `<phase_dir>/CONTEXT.md` with "Cosa sappiamo / assumiamo / NON sappiamo" filled in.

## Error handling
- User skips a question → record as open question, don't fabricate.
- Contradictions surface → flag them, ask user to resolve.
