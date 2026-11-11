# Workflow — pr-branch

Create a properly named branch, commit work, and open a PR following SHINE conventions.

## Prerequisites
- Git repo with a remote configured.
- `gh` CLI available (for PR creation; fallback to manual instructions if not).

## Steps

1. **Determine branch scope**  
   Based on the current work context:
   | Scope | Prefix | Example |
   |-------|--------|---------|
   | Phase execution | `phase/` | `phase/03-api-integration` |
   | Bug fix | `fix/` | `fix/payment-timeout` |
   | Documentation | `doc/` | `doc/api-reference-update` |
   | Experiment | `exp/` | `exp/new-auth-flow` |
   | Feature | `feat/` | `feat/user-dashboard` |

2. **Generate branch name**  
   `node shine/bin/shine-tools.cjs generate-slug "<description>" --raw`  
   Full name: `<scope>/<slug>` (max 60 chars).

3. **Create and switch**  
   ```bash
   git checkout -b <branch-name>
   ```
   If uncommitted work exists: offer to stash or include in first commit.

4. **Commit current work**  
   `node shine/bin/shine-tools.cjs commit "<summary>" --scope <scope> --raw`

5. **Push branch**  
   ```bash
   git push -u origin <branch-name>
   ```

6. **Open PR**  
   If `gh` is available:
   ```bash
   gh pr create \
     --title "<last commit subject>" \
     --body "<5-section summary>" \
     --base main
   ```
   If `gh` not available: output the PR body in markdown for manual creation.

7. **PR body template**  
   ```
   ## Summary
   <one-paragraph description>
   
   ## Changes
   <file-level summary from git diff --stat>
   
   ## Testing
   <how to verify: commands, URLs, manual steps>
   
   ## Checklist
   - [ ] Tests pass
   - [ ] No secrets in diff
   - [ ] Docs updated (if public API changed)
   - [ ] Accessibility checked (if UI change)
   
   ## Related
   Phase: <N> · Plan: <plan-slug> · Issue: <ref>
   ```

8. **Add reviewer**  
   If `~/.claude/memory/team-*.md` exists: suggest a reviewer based on file ownership.

## Decision gates
- Before push: show the diff summary and PR body for approval.
- Never force-push on shared branches.

## Guardrails
- Never force-push on shared branches.
- Never create a PR with secrets in the diff (run secret scan first).
- Branch name must be lowercase, hyphenated, no special characters.
