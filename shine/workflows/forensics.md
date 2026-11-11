# Workflow — forensics

Post-incident / regression investigation. Find when + why something broke, and produce a blameless post-mortem.

## Prerequisites
- A reproducible failing state (error message, wrong output, or broken behavior).
- Git history available.

## Steps

1. **Reproduce the failure**  
   Confirm the failing state in the current checkout. Capture:
   - Exact error message or wrong output (copy verbatim).
   - Steps to reproduce (command, URL, input).
   - Expected vs actual behavior.

2. **Establish last-known-good**  
   Ask user for the last commit/tag/date where it worked. If unknown:
   - Check CI history for last green build.
   - Binary search recent tags: `git tag --sort=-creatordate | head -10`.

3. **Git bisect**  
   ```bash
   git bisect start <bad-sha> <good-sha>
   # At each step, run the repro script:
   git bisect run <repro-command>
   ```
   If no automated repro: manual bisect with user confirmation at each step.

4. **Blame analysis**  
   On the identified bad commit:
   - `git show <sha>` — full diff.
   - `git blame -L <start>,<end> <file>` — surrounding context.
   - Read the commit message + linked PR/issue for intent.

5. **Dependency check**  
   If the bad commit is a dependency update:
   - Check the dependency's changelog for breaking changes.
   - Check if lockfile changed (`package-lock.json`, `yarn.lock`, etc.).

6. **Root cause analysis**  
   Separate cause from symptom. Apply the 5-Why:
   - Why did it break? → <direct cause>
   - Why wasn't it caught? → <test gap / CI gap>
   - Why was the change made? → <intent>
   - What systemic issue allowed this? → <process gap>

7. **Write incident report**  
   Output `INCIDENT-<YYYYMMDD>-<slug>.md`:
   ```
   # Incident — <title>
   
   ## Timeline
   | When | What |
   |------|------|
   | <date> | Last known good (commit <sha>) |
   | <date> | Bad commit introduced (<sha>) |
   | <date> | Issue detected |
   | <date> | Root cause identified |
   
   ## Root cause
   <one-paragraph explanation>
   
   ## Impact
   <what broke, who was affected, severity>
   
   ## Fix
   <what was done to resolve — commit ref or proposed fix>
   
   ## Prevention
   - [ ] <test to add>
   - [ ] <CI check to add>
   - [ ] <process change>
   ```

8. **Commit**  
   `node shine/bin/shine-tools.cjs commit "forensics: <slug>" --scope forensics --raw`

## Decision gates
- Before bisect: confirm good/bad boundaries with user.
- After root cause: review with user before writing report.

## Guardrails
- Never scapegoat an author — focus on system gaps, not people.
- Post-mortem is blameless; write for future team.
- Never auto-revert without user confirmation.
- If bisect touches > 100 commits, suggest narrowing the window first.
