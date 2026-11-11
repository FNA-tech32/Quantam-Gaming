# Workflow — new-project

Scaffold a new SHINE project with REQUIREMENTS, ROADMAP, and first phase.

## Prerequisites
- Empty directory or existing repo.
- User can answer discovery questions.

## Steps

1. **Confirm intent**  
   Ask: project name, client slug, language (it/en/fr), owner.

2. **Generate slug**  
   `node shine/bin/shine-tools.cjs generate-slug "<name>" --raw`

3. **Scaffold files**  
   Write from templates:
   - `./PROJECT.md` from `shine/templates/project.md`
   - `./REQUIREMENTS.md` from `shine/templates/requirements.md`
   - `./ROADMAP.md` minimal: "# Roadmap — <name>\n\n## Phase 1 — Discovery [todo]\n"

4. **Run discovery questions**  
   Apply `shine/references/questioning.md` fully. Populate REQUIREMENTS.md live.

5. **Offer first phase plan**  
   Propose: "Shall I invoke `/shine-plan-phase 1` now?" — wait for approval.

6. **Commit**  
   `commit "scaffold <slug>" --scope init --raw`

## Decision gates
- Before overwriting existing PROJECT.md / REQUIREMENTS.md: explicit confirmation.
- After scaffolding: show file tree for approval.

## Output
- `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`.

## Error handling
- Existing files → never silently overwrite. Offer merge or abort.
