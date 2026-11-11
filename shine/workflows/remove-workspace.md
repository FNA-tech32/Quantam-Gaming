# Workflow — remove-workspace

Remove or archive a workspace with safety checks and confirmation.

## Prerequisites
- Workspace exists (registered via `workstream list`).

## Steps

1. **Identify workspace**  
   `node shine/bin/shine-tools.cjs workstream status <slug> --raw`  
   Show: name, type, created date, last activity, linked repos.

2. **Activity check**  
   - Last commit in linked repo: `git -C <repo> log -1 --format="%ci %s"`.
   - Last memory write: `stat ~/.claude/memory/client-<slug>*.md`.
   - Open phases: any in-progress work?
   
   If recent activity (< 7 days): warn strongly.

3. **Offer options**  
   | Action | What happens | Reversible? |
   |--------|-------------|-------------|
   | **Archive** (default) | Move to `~/.claude/teams/.archive/<slug>/` · Set status=archived | ✅ Yes |
   | **Delete** | Remove directory entirely · Unregister | ❌ No |
   
   Archive is always the default.

4. **Handle active pointer**  
   If this workspace is the currently active one:
   - Switch to another workspace first.
   - If no other workspace exists: warn that there will be no active workspace.

5. **Execute**  
   - Archive: `mv ~/.claude/teams/<slug>/ ~/.claude/teams/.archive/<slug>/`
   - Delete: `rm -rf ~/.claude/teams/<slug>/` (require explicit `--delete` flag + double-confirm)
   
   `node shine/bin/shine-tools.cjs workstream archive <slug> --raw`

6. **Confirm**  
   ```
   <📦 Archived | 🗑️ Deleted> workspace "<name>".
   <Archive location: ~/.claude/teams/.archive/<slug>/ | Permanently removed.>
   ```

## Guardrails
- Never auto-delete client workspaces — require explicit `--delete` + double-confirmation.
- Archive is always the default and recommended action.
- Never delete a workspace with in-progress phases without completing or pausing them first.
