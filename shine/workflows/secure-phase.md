# Workflow — secure-phase

Security audit scoped to one phase's code changes. Produces a ship-gate report.

## Prerequisites
- Phase has been executed (commits with `shine(exec):` exist for this phase).
- Working tree clean.

## Steps

1. **Scope the diff**  
   Identify all commits in this phase:
   ```bash
   git log --oneline --grep="shine(exec):" --since=<phase-start>
   ```
   Get the combined diff: `git diff <first-commit>^..<last-commit>`.

2. **Secret scan**  
   Apply the patterns from `hooks/shine-prompt-guard.js`:
   - API keys (`sk-`, `AKIA`, `ghp_`, `glpat-`, etc.)
   - Private keys (`-----BEGIN.*PRIVATE KEY-----`)
   - Connection strings with credentials
   - `.env` files added to tracked files
   Flag any matches as 🔴 **ship-blockers**.

3. **Dependency CVE check**  
   If new dependencies were added this phase:
   - Run `npm audit` / `pip-audit` / `cargo audit` as appropriate.
   - Flag any HIGH or CRITICAL CVEs as 🔴.

4. **Input validation audit**  
   For every new endpoint, CLI entry, or form handler added:
   - Check: input type validation present?
   - Check: bounds/length limits set?
   - Check: SQL/NoSQL injection protection (parameterized queries)?
   - Check: XSS protection (output encoding)?

5. **AuthN/AuthZ check**  
   For every new route or API endpoint:
   - Authentication required? (middleware, decorator, guard)
   - Authorization checked? (role/permission verification)
   - Privilege escalation paths? (can a user access another user's data?)

6. **HTTPS/TLS check**  
   - New external URLs: all HTTPS?
   - New API integrations: TLS 1.2+ required?
   - Certificate pinning where applicable?

7. **Write security report**  
   ```
   ## Security audit — Phase <N>
   
   ### Summary
   <pass | fail — N blockers, M warnings>
   
   ### Blockers (🔴 must fix before ship)
   | # | Category | File:line | Finding | Fix |
   
   ### Warnings (🟡 should fix)
   | # | Category | File:line | Finding | Fix |
   
   ### Passed checks
   <list of checks that passed>
   
   ### Recommendations
   <hardening suggestions for future phases>
   ```

8. **Commit report**  
   `node shine/bin/shine-tools.cjs commit "security audit: phase <N>" --scope security --raw`

## Decision gates
- 🔴 blockers → phase CANNOT ship until resolved. No exceptions.
- 🟡 warnings → user decides: fix now or accept risk with documented rationale.

## Guardrails
- 🔴 issues halt the phase — no "will fix later" for security blockers.
- Never write findings to a shared/public doc; audit reports stay local unless user exports.
- Never include actual secret values in the report — only the pattern and location.
