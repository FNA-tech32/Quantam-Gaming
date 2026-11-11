# Workflow — insert-phase

Insert a new phase between existing phases, renumbering subsequent phases and updating all references.

## Prerequisites
- ROADMAP.md exists with at least one phase.
- User specifies: insertion position, new phase title, and goal.

## Steps

1. **Gather input**  
   Ask user: insertion position I (e.g., "insert after phase 2"), new title, one-sentence goal.

2. **Load roadmap**  
   `node shine/bin/shine-tools.cjs roadmap --raw` — get all phases with numbers and statuses.

3. **Impact preview (dry-run)**  
   Show what will change:
   ```
   Phase I+1 (new): <title> [todo]
   Phase I+1 → I+2: <existing title> (renumber)
   Phase I+2 → I+3: <existing title> (renumber)
   …
   Files to rename: N directories
   References to update: M files
   ```
   Require user confirmation before proceeding.

4. **Rename phase directories (reverse order)**  
   Start from the last phase and work backward to avoid collisions:
   ```
   .shine/phases/phase-05-<slug>/ → .shine/phases/phase-06-<slug>/
   .shine/phases/phase-04-<slug>/ → .shine/phases/phase-05-<slug>/
   .shine/phases/phase-03-<slug>/ → .shine/phases/phase-04-<slug>/  (if inserting at 3)
   ```

5. **Update ROADMAP.md**  
   Renumber all `### Phase N` headers from I+1 onward.  
   Insert new phase at position I+1.

6. **Update cross-references**  
   Grep for `Phase <N>` references across `.shine/`, plan files, CONTEXT.md, STATE.md.  
   Propose updates for each; apply on user approval.

7. **Create new phase directory**  
   `.shine/phases/phase-<II>-<new-slug>/CONTEXT.md` from template.

8. **Commit**  
   `node shine/bin/shine-tools.cjs commit "insert phase <I+1>: <slug>" --scope roadmap --raw`

## Decision gates
- After dry-run: explicit confirmation before any file operations.
- After renaming: show the new file tree for verification.

## Guardrails
- Never renumber a phase whose state is `done` without user acknowledgement — archive references matter.
- Never skip numbers (ensure contiguous sequence after insert).
- If a phase has active in-progress work, warn before renumbering.

## Error handling
- Phase directory rename fails → abort all, restore original state.
- Cross-reference update misses a file → flag as manual-review item.
