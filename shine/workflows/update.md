# Workflow — update

Self-update the SHINE framework from the upstream repository.

## Prerequisites
- Internet access.
- `git` available.

## Steps

1. **Backup current installation**  
   ```bash
   cp -r ~/.claude/ ~/.claude-backup-$(date +%Y%m%d-%H%M%S)/
   ```
   Confirm backup created successfully.

2. **Fetch latest version**  
   Clone or pull the latest upstream to a temp directory:
   ```bash
   git clone --depth 1 https://github.com/diShine-digital-agency/shine-claude-code-framework.git /tmp/shine-update/
   ```

3. **Version comparison**  
   Compare `shine/VERSION` (installed) vs upstream. Show:
   ```
   Installed: v0.10.0
   Available: v0.11.0
   ```
   If already up-to-date → report and exit.

4. **Diff analysis**  
   Compare installed vs upstream for each category:
   - Agents: new / modified / removed
   - Skills: new / modified / removed
   - Hooks: new / modified / removed
   - Workflows: new / modified / removed
   - Templates & references: changes
   - `shine-tools.cjs`: changes
   Show summary table.

5. **User confirmation**  
   Display the diff summary. Require explicit "yes" to proceed.

6. **Apply update (preserving user data)**  
   Copy updated files. **Never overwrite:**
   - `~/.claude/settings.json` (user config)
   - `~/.claude/memory/MEMORY.md` and all `memory/*.md` files
   - `~/.claude/memory/client-*.md`, `project-*.md`, `preference-*.md`
   - Any `.shine/` project state in the current working directory

7. **Smoke test**  
   `node ~/.claude/shine/bin/shine-tools.cjs help` — must succeed.  
   Run `/shine-health` checks.

8. **Report**  
   ```
   ✅ Updated: v0.10.0 → v0.11.0
   Changed: 5 agents, 3 skills, 1 hook, 12 workflows
   Backup: ~/.claude-backup-20260415-143022/
   ```

## Guardrails
- Never overwrite user memory or settings.
- Always keep the backup until user explicitly confirms success.
- If smoke test fails → auto-rollback from backup.
