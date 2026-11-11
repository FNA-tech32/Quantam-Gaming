# Workflow — list-workspaces

List all registered SHINE workspaces with status, activity, and health indicators.

## Steps

1. **Load workspaces**  
   `node shine/bin/shine-tools.cjs workstream list --raw` → array of workspaces.

2. **Enrich with activity data**  
   For each workspace:
   - Last commit date (if repo linked): `git -C <repo> log -1 --format="%ci"`.
   - Last memory write: `stat ~/.claude/memory/client-<slug>*.md` → most recent mtime.
   - Phase status: if `.shine/` exists in the repo, count done/in-progress/todo phases.

3. **Health indicator**  
   - 🟢 Active: commit or memory write in last 7 days.
   - 🟡 Idle: last activity 7–30 days ago.
   - 🔴 Dormant: last activity > 30 days ago.
   - ⏸️ Archived: status = archived.

4. **Sort and display**  
   Active first, then idle, then dormant. Within each group: most recent first.
   ```
   ## Workspaces
   
   | Workspace | Type | Health | Last activity | Phases |
   |-----------|------|--------|---------------|--------|
   | client-acme | client | 🟢 | 2h ago | 3/6 done |
   | internal-shine | internal | 🟡 | 12d ago | — |
   | exp-ai-chat | experiment | 🔴 | 45d ago | 1/2 done |
   
   Active: 1 · Idle: 1 · Dormant: 1 · Archived: 0
   ```

5. **Offer actions**  
   - For 🔴 dormant: _"Archive <slug>? `/shine-remove-workspace <slug>`"_
   - For 🟢 active: _"Switch to <slug>? `/shine-resume-project`"_

## Guardrails
- Never show client-sensitive data across workspaces (each workspace is isolated).
