# Workflow — remove-phase

Remove a phase safely: check dependencies, archive or delete, renumber remaining phases.

## Prerequisites
- Phase exists in ROADMAP.md.
- User has explicitly requested removal.

## Steps

1. **Identify target**  
   Load phase N. Check status:
   - `done` + in a shipped milestone → refuse deletion; suggest archive instead.
   - `in-progress` → warn: uncommitted work may be lost.
   - `todo` → safe to remove.

2. **Dependency check**  
   Grep for references to phase N across:
   - Other phases' CONTEXT.md (`depends_on`, cross-references)
   - Plan files (`depends_on: phase-N`)
   - REQUIREMENTS.md (if phase N is the only coverage for a Must)
   If dependencies exist → show them, abort unless user overrides.

3. **Impact preview**  
   ```
   Removing: Phase <N> — <title> (<status>)
   Directory: .shine/phases/phase-<NN>-<slug>/
   Files: <count> files, <size> total
   Dependencies: <list or "none">
   Phases to renumber: <N+1> through <last>
   Action: archive (default) / delete (--delete flag)
   ```

4. **Archive or delete**  
   - **Archive** (default): move to `.shine/archive/phase-<NN>-<slug>-<YYYYMMDD>/`
   - **Delete** (requires `--delete`): remove directory entirely.

5. **Renumber**  
   Renumber phases > N down by one (reverse of insert-phase protocol).  
   Update ROADMAP.md headers.  
   Update cross-references.

6. **Commit**  
   `node shine/bin/shine-tools.cjs commit "remove phase <N>: <slug>" --scope roadmap --raw`

## Decision gates
- Before any action: show impact preview, require explicit confirmation.
- If status is `done`: require double-confirmation ("This phase is completed — are you sure?").

## Guardrails
- Archive is default; delete requires explicit `--delete` flag.
- Never auto-delete — always show what will be removed.
- Never remove the last remaining phase — suggest archiving the project instead.
