# Workflow — pause-work

Snapshot current work state so it can be resumed cleanly later. Creates a breadcrumb trail for `/shine-resume-project`.

## Prerequisites
- Inside a project directory.

## Steps

1. **Assess working tree**  
   `git status --porcelain` → list uncommitted changes.  
   `git stash list` → any existing stashes.

2. **Handle uncommitted work**  
   Present options to user:
   | Option | When to use | Command |
   |--------|-------------|---------|
   | WIP commit | Want to keep changes on branch | `shine-tools.cjs commit "WIP: <context>" --scope wip` |
   | Stash | Temporary, will resume soon | `git stash push -m "shine-pause: <context>"` |
   | Discard | Changes are throwaway | `git checkout -- .` (require double-confirm) |
   
   Default: WIP commit (safest).

3. **Write PAUSE.md**  
   Create `.shine/PAUSE.md`:
   ```
   # Paused — <date> <time>
   
   ## State
   - Phase: <N> — <title>
   - Wave: <W> of <total>
   - Current task: <description from STATE.md>
   - Branch: <current branch>
   - Uncommitted: <WIP-committed | stashed | clean>
   
   ## Context
   - Last decision: <from recent commits or STATE.md notes>
   - Open thread: <what was being worked on>
   - Blocker (if any): <description>
   
   ## Resume instructions
   1. Run `/shine-resume-project`
   2. Or manually: checkout <branch>, pop stash if needed, run `/shine-next`
   ```

4. **Update state**  
   `node shine/bin/shine-tools.cjs state <N> --set status=paused --raw`

5. **Confirm**  
   ```
   ⏸️ Work paused.
   Phase <N>, wave <W>.
   Resume with: /shine-resume-project
   ```

## Guardrails
- Never discard uncommitted work without explicit double-confirmation.
- Always write PAUSE.md — it's the breadcrumb for resume.
- Never leave the working tree dirty after pause (commit or stash everything).
