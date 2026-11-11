# Security Policy

## Supported versions

The latest `main` and the most recent tagged release receive security fixes. Older releases are on a best-effort basis.

## Reporting a vulnerability

**Do not open a public issue for security problems.**

Email **security@dishine.it** with:

- A clear description of the issue.
- Reproduction steps or a minimal proof of concept.
- Impact assessment (what an attacker could do).
- Your contact info for follow-up.

You'll get an acknowledgment within 72 hours. We'll coordinate disclosure and credit you in the release notes unless you prefer to stay anonymous.

## Scope

In scope:

- `install.sh`, `uninstall.sh` — shell injection, privilege escalation, path traversal.
- `hooks/*` — secret exfiltration, bypass of the prompt guard, unsafe tool execution.
- `settings.template.json` — dangerous defaults.
- Shipped skills/agents that invoke `Bash`, `Write`, `Edit`, or network tools.

Out of scope:

- Issues in Claude Code itself — report to Anthropic.
- Issues in third-party plugins (serena, context7, etc.) — report upstream.
- Social-engineering scenarios that require the user to disable guards (`SHINE_DISABLE_PROMPT_GUARD=1`).

## Defense posture

SHINE is designed to fail safe:

- `shine-prompt-guard.js` blocks writes of obvious secrets (API keys, PEM, `.env`).
- Telemetry is off by default; OTEL endpoints blank.
- `install.sh` takes an atomic backup before any change.
- Hooks fail open (exit 0) unless they are protective, in which case they fail closed (exit 2).
- No binaries ship with the framework — everything is readable source.

If you find a case where these promises are not met, that's a bug and we want to know.
