---
name: shine-security-scan
description: "Scan codebase for vulnerabilities using Semgrep MCP (SAST) + OSV MCP (dependency audit). Free, local, no cloud."
argument-hint: "<directory path or 'full' for entire project>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
---

<objective>
Run a multi-layer security scan:

1. **SAST scan:** `semgrep` MCP (if connected) or `npx semgrep --config auto . --json` via Bash.
   - Focus: injection, XSS, auth bypass, hardcoded secrets, path traversal, SSRF.
2. **Dependency audit:** `osv` MCP (if connected) or `npm audit --json` / `pip audit --format json` via Bash.
   - Report: CVE ID, severity (CVSS), affected package, fixed version.
3. **SSL check (if URL provided):** `sslmon` MCP or `openssl s_client` via Bash.

Classify each finding: 🔴 Critical · 🟠 High · 🟡 Medium · 🔵 Low · ⚪ Info.

Output: severity-sorted report with CWE references, affected files, and remediation guidance.
Delegate to `shine-vulnerability-scanner` agent for complex codebases.
</objective>

<guardrails>
- Read-only on implementation files — scan, never auto-fix.
- Never include actual secret values in reports — only patterns and file:line.
- Never dismiss Critical/High findings without code-level evidence.
- Report scan coverage honestly: which dirs scanned, which excluded.
- If no scan tool available → give install command, never skip entirely.
</guardrails>
