# Workflow — new-workspace

Create a new SHINE workspace (client or project container) with proper structure and registration.

## Prerequisites
- User provides: workspace name and type.

## Steps

1. **Gather input**  
   Ask for:
   - Workspace name (e.g., "Acme Corp", "Internal R&D")
   - Type: `client` · `internal` · `experiment`
   - Primary repo URL (optional — can be linked later)
   - Notes (optional — brief description)

2. **Generate slug**  
   `node shine/bin/shine-tools.cjs generate-slug "<name>" --raw`

3. **Create directory structure**  
   ```
   ~/.claude/teams/<slug>/
   ├── workspace.json       ← manifest
   ├── memory/              ← workspace-specific memory
   └── sessions/            ← session logs for this workspace
   ```

4. **Write workspace manifest**  
   `workspace.json`:
   ```json
   {
     "slug": "<slug>",
     "name": "<name>",
     "type": "<client|internal|experiment>",
     "created_at": "<ISO date>",
     "primary_repo": "<url or null>",
     "notes": "<description>",
     "status": "active"
   }
   ```

5. **Link repo (if provided)**  
   If a repo URL was given:
   - `git clone <url> ~/.claude/teams/<slug>/repo` (shallow clone)
   - Or if local path: create symlink.

6. **Register with SHINE**  
   `node shine/bin/shine-tools.cjs workstream create <slug> --raw`

7. **Initialize client memory (if type = client)**  
   Create `~/.claude/memory/client-<slug>.md` from template:
   ```
   ---
   type: client
   slug: <slug>
   created: <date>
   ---
   # Client — <name>
   
   ## Contacts
   | Role | Name | Email |
   
   ## Preferences
   - Language:
   - Tone:
   - Communication channel:
   
   ## History
   <engagement log>
   ```

8. **Confirm**  
   ```
   ✅ Workspace "<name>" created.
   Type: <type> · Slug: <slug>
   Next: cd into the repo and run /shine-new-project
   ```

## Guardrails
- Never create a workspace with a duplicate slug — check first.
- Client memory files must never contain PII beyond business contact info.
