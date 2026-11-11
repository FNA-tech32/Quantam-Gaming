---
name: shine-meta-check
description: "Audit page <meta> tags, OpenGraph, and Twitter cards for a URL."
argument-hint: "<url>"
allowed-tools:
  - Bash
  - WebFetch
---

# /shine-meta-check

Audit a page for SEO-critical meta tags: `<title>`, `<meta description>`, canonical, OpenGraph (`og:*`), and Twitter card (`twitter:*`).

## Usage

```
/shine-meta-check https://example.com/page
```

## Implementation

1. **Primary**: try the `meta-inspector` CLI if installed (fastest, structured output).

   !`command -v meta-inspector >/dev/null 2>&1 && meta-inspector "$ARGUMENTS" --json || echo "__FALLBACK__"`

2. **Fallback**: if the CLI is absent, use `WebFetch` to retrieve the HTML and parse with a regex pass. Extract:
   - `<title>…</title>`
   - `<meta name="description" content="…">`
   - `<link rel="canonical" href="…">`
   - All `<meta property="og:*">`
   - All `<meta name="twitter:*">`

3. Evaluate against SEO conventions:
   - Title: 30–60 chars
   - Description: 50–160 chars
   - Canonical: present, absolute URL, self-referential unless redirect
   - OpenGraph minimum: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
   - Twitter minimum: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

## Output

5-section report (see `shine/references/ui-brand.md`):

```
## Summary
✓ / ⚠ / ✗ overall, + top 3 issues

## Details
Table of each tag, length, status.

## Sources
The URL fetched + tool used.

## Open questions
Anything that requires live rendering (JS-inserted tags).

## Next step
One concrete remediation.
```

## Errors

- Neither tool available → instruct user to install `meta-inspector` or enable WebFetch. Never fabricate tag values.
- 4xx / 5xx from the URL → surface the status code, stop.
