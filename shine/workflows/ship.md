# Workflow — ship

Release workflow: verify readiness → bump version → tag → release notes → push.

## Prerequisites
- All roadmap phases done: `shine-tools.cjs roadmap --raw` → no `in-progress` or `todo`.
- Verify passed on the last phase.
- Working tree clean.
- On a named branch (not detached HEAD).

## Steps
1. **Pre-ship checklist** — print and require user to confirm each:
   - [ ] All phases done
   - [ ] Tests green
   - [ ] Verify-work passed
   - [ ] No uncommitted changes
   - [ ] CHANGELOG updated
2. **Version bump** — if `package.json` or `VERSION` file exists, propose next semver (patch/minor/major) based on commit log (fix → patch, feat → minor, BREAKING → major).
3. **CHANGELOG** — append new section under `## [<version>] — <date>` aggregating commit subjects grouped by scope (plan/exec/doc/fix).
4. **Tag** — `git tag -a v<version> -m "shine(ship): v<version>"`.
5. **Release notes** — generate from phase SUMMARY.md files + commit log; write `releases/v<version>.md`.
6. **Commit + push** — `shine-tools.cjs commit "ship: v<version>" --scope ship`; user decides `git push --follow-tags`.
7. **Optional** — `gh release create v<version> --notes-file releases/v<version>.md`.

## Decision gates
- Before tag: show CHANGELOG diff, require explicit "yes".
- Before push: confirm target remote and branch.
- Never auto-push — always the user's explicit action.

## Error handling
- Any checklist item unchecked → abort.
- Tag already exists → ask user to bump version or delete-and-retry.
- Dirty tree → `git status`, abort.
