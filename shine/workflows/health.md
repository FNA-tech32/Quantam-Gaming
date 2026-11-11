# Workflow — health

One-command sanity check of the SHINE installation.

## Steps

1. **Runtime**  
   - `node --version` — must be ≥ 18.
   - `which claude` — must exist.
   - `node shine/bin/shine-tools.cjs help` — must print usage.

2. **Files**  
   Check each exists:
   - `~/.claude/CLAUDE.md`
   - `~/.claude/shine/bin/shine-tools.cjs`
   - `~/.claude/shine/references/ui-brand.md`
   - `~/.claude/shine/references/questioning.md`
   - all 5 `~/.claude/shine/templates/*.md`

3. **Hooks**  
   `settings.json` references each hook file. Each file exists and is executable where needed.

4. **Agents & skills**  
   Count agents (expect 39) and skills (expect 138 after dedup). Report any with missing frontmatter.

5. **Memory**  
   `~/.claude/memory/` exists and is a symlink or real dir.

6. **Plugins (optional)**  
   `claude plugins list` — warn on missing expected plugins, don't fail.

7. **Git (if in a project)**  
   Working tree clean? On a branch? Ahead/behind origin?

## Output
5-section report:
```
## Summary
✅ / 🟡 / 🔴 overall.
## Details
Per-check line items.
## Sources
Commands run.
## Open questions
What could not be verified.
## Next step
If issues, one concrete remediation.
```
