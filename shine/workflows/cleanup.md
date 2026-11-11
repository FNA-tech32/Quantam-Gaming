# Workflow — cleanup

Detect dead code, orphaned files, stale branches, and tech debt. Propose deletions; never auto-delete.

## Prerequisites
- Git repo with history.
- Working tree clean (or stash first).

## Steps

1. **Dead code detection**  
   Run language-specific detector:
   - JS/TS: `npx ts-prune` or `npx knip` — find unused exports
   - Python: `vulture <src>` or `npx deadcode`
   - Go: `staticcheck ./...`
   - If no tool available: grep for exported symbols with zero inbound references.
   Output: list of dead symbols with file:line.

2. **Orphaned files**  
   Find files with no inbound references across the repo:
   - Grep all `import`/`require`/`from` statements; build a reference graph.
   - Files not referenced by any other file AND not an entry point → orphan candidate.
   - Exclude: config files, test fixtures, docs, assets referenced in HTML/CSS.

3. **Stale branches**  
   `git branch -v --merged main` — branches already merged.  
   `git branch -v --no-merged` — unmerged branches with last commit > 30 days ago.  
   Classify: safe-to-delete (merged) vs needs-review (stale unmerged).

4. **Large binaries**  
   `git rev-list --objects --all | git cat-file --batch-check | sort -k3 -n -r | head -20`  
   Flag files > 1 MB in history. Propose: git-lfs migration or removal.

5. **Empty directories**  
   `find . -type d -empty` (excluding `.git`).

6. **Dependency cleanup**  
   - Unused dependencies: `npx depcheck` (JS) or `pip-extra-reqs` (Python).
   - Duplicate dependencies (different versions of same package).

7. **Safe-deletion protocol**  
   Present findings grouped by category. For each category:
   - Show the full list with file paths.
   - Require explicit user confirmation: "Delete these N dead-code files? [y/n]"
   - Commit one category at a time with descriptive message.
   - Write each removal to `.shine/cleanup-<YYYYMMDD>.log` for rollback reference.

## Output
```
## Cleanup report
| Category | Count | Action |
|----------|------:|--------|
| Dead code | 12 files | Delete on approval |
| Orphaned files | 3 files | Delete on approval |
| Stale branches | 5 | Delete merged, review unmerged |
| Large binaries | 2 | Propose git-lfs |
| Empty dirs | 4 | Remove |
| Unused deps | 3 packages | Remove from manifest |
```

## Guardrails
- Never touch files matching `.env*`, `*.pem`, `credentials.*`, fixtures flagged sensitive.
- Never delete across `/migrations/` or `/db/` without explicit DBA sign-off.
- Always dry-run first — show what WILL be deleted before deleting anything.
- Never auto-delete — every deletion requires user confirmation.
