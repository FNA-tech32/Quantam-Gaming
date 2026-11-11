---
name: shine-cookie-scan
description: "Scan a URL for cookies and classify them (strictly-necessary / preferences / statistics / marketing)."
argument-hint: "<url>"
allowed-tools:
  - Bash
  - WebFetch
---

# /shine-cookie-scan

Scan a public URL and classify every cookie it sets. Used for GDPR compliance, cookie-consent audits, and privacy reporting.

## Usage

```
/shine-cookie-scan https://example.com
```

## Implementation

1. **Primary**: `cookie-audit` CLI (Playwright-based, sees JS-injected cookies):

   !`command -v cookie-audit >/dev/null 2>&1 && cookie-audit "$ARGUMENTS" --json || echo "__FALLBACK__"`

2. **Secondary**: `curl -sI` to capture Set-Cookie headers only (misses JS-set cookies):

   !`curl -sI --max-time 15 "$ARGUMENTS" | grep -i "^set-cookie:" || true`

3. **Fallback**: WebFetch + document the limitation (WebFetch sees only the initial HTML response, no runtime cookies).

## Classification taxonomy

| Class | Examples | Consent needed? |
|-------|----------|-----------------|
| Strictly necessary | session, csrf, language | No |
| Preferences | theme, region | Yes (usually) |
| Statistics | `_ga`, `_gid`, plausible | Yes |
| Marketing | `_fbp`, `ads_prefs`, `mkto_*` | Yes |

## Output

5-section report with a cookies table:

```
| Name | Domain | Lifetime | Class | Consent? | Source |
```

Plus a GDPR flag line: ✓ compliant / ⚠ issues found / ✗ non-compliant.

## Errors

- Neither tool available → stop, instruct user to install `cookie-audit` (`npm i -g cookie-audit`). Never guess cookie classifications.
- Page requires auth → surface the 401/403, stop.

## See also

- `shine-gdpr-analyst` agent for full DPIA workflow
- `shine/references/ui-brand.md` for report formatting
