---
name: shine-sandbox
description: "Execute code safely in an isolated Docker container. Prevents untrusted code from running directly on the host."
argument-hint: "<language> <code or file path>"
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
Safely execute code in isolation:

1. **Risk assessment:**
   - 🟢 Safe (direct OK): read-only ops, linting, type-checking.
   - 🟡 Moderate (sandbox recommended): package installs, API calls, file I/O.
   - 🔴 High (sandbox REQUIRED): untrusted code, global installs, network access, unknown scripts.

2. **Sandbox selection (Rule #21):**
   - Tier 1: `docker` MCP → `microsandbox` → Docker CLI via Bash.
   - Tier 2: `e2b` (ASK first — _"This uses E2B cloud sandbox (freemium). Proceed?"_).
   - No sandbox: REFUSE for 🔴 code. Explain why + give Docker install command.

3. **Execution:**
   - Select container image for language (python:3.12, node:22, golang:1.22, etc.).
   - Mount code read-only unless writes required.
   - Resource limits: 2 CPU, 1 GB RAM, 5-min timeout.
   - Capture stdout, stderr, exit code, duration.

4. **Cleanup:** Remove container + temporary files.

Delegate to `shine-sandbox-runner` agent for complex multi-step executions.
</objective>

<guardrails>
- Never run 🔴-risk code directly on host — always sandbox.
- Never expose host network to container without explicit approval.
- Never mount home directory or sensitive paths into containers.
- Always clean up containers after execution.
- If Docker not installed → state gap + give install link, never simulate.
</guardrails>
