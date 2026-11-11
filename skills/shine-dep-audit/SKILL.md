---
name: shine-dep-audit
description: "Audit project dependencies for known CVEs using OSV MCP or native package auditors (npm audit, pip audit, govulncheck)."
argument-hint: "<project directory or package file path>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
---

<objective>
Audit all dependencies for known vulnerabilities:

1. **Detect package ecosystem:** scan for `package.json`, `package-lock.json`, `requirements.txt`, `Pipfile.lock`, `go.mod`, `go.sum`, `pom.xml`, `Gemfile.lock`, `Cargo.lock`.
2. **Run audit:**
   - `osv` MCP if connected → query each dependency + version.
   - Fallback: `npm audit --json` / `pip audit --format json` / `govulncheck ./...` via Bash.
3. **Report per vulnerability:**
   - CVE ID, severity (CVSS score), affected package, current version, fixed version.
   - Upgrade path: is a non-breaking fix available?
4. **Prioritize:** 🔴 Critical (CVSS ≥ 9.0) → 🟠 High (7.0–8.9) → 🟡 Medium (4.0–6.9) → 🔵 Low (< 4.0).
5. **Output:** severity-sorted table + recommended `npm update` / `pip install --upgrade` commands.
</objective>

<guardrails>
- Never auto-upgrade dependencies without user approval.
- Report ALL findings — never suppress low-severity items silently.
- If multiple ecosystems detected, audit ALL of them.
- Include transitive dependencies, not just direct.
- Note if a CVE is disputed or has no known exploit.
</guardrails>
