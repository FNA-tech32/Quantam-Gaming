# Workflow — docs-update

Refresh documentation against current code state. Detect stale content, broken links, and drift.

## Prerequisites
- Project has at least one documentation file (README.md, docs/, etc.).

## Steps

1. **Code snippet verification**  
   Scan README.md and `docs/*.md` for fenced code blocks.  
   For each block that references a file path or command:
   - Verify the path still exists.
   - If it's a command, verify it runs (dry-run where possible).
   - Flag stale snippets with the current correct version.

2. **API signature drift**  
   If the project has API docs (OpenAPI, JSDoc, docstrings):
   - Grep public symbols (exported functions, classes, endpoints).
   - Compare documented signatures vs actual signatures.
   - Flag mismatches: wrong param names, missing params, wrong return types.

3. **Link check**  
   - **Internal links**: verify target file/anchor exists.
   - **External links**: `HEAD` request (batch, max 20, with 1s delay between).
   - Flag: 404s as 🔴, redirects as 🟡, timeouts as 🟡.

4. **CHANGELOG sync**  
   - Find the latest git tag: `git describe --tags --abbrev=0`.
   - List commits since that tag: `git log <tag>..HEAD --oneline`.
   - Check if CHANGELOG.md has a section for the next version with these commits.
   - If missing: propose a draft section.

5. **Completeness check**  
   Verify these standard sections exist (flag if missing):
   - README: description, installation, usage, contributing, license
   - API docs: all public endpoints/functions documented
   - CHANGELOG: latest version section present

6. **Propose patches**  
   For each stale item, generate a specific patch (not a vague suggestion).  
   Show each patch to user; apply only on approval.

7. **Commit**  
   `node shine/bin/shine-tools.cjs commit "docs: refresh" --scope doc --raw`

## Output
```
## Docs audit — <date>
| Category | Checked | Stale | Fixed |
|----------|--------:|------:|------:|
| Code snippets | 12 | 3 | 3 |
| API signatures | 24 | 1 | 1 |
| Internal links | 18 | 0 | — |
| External links | 8 | 2 | — |
| CHANGELOG | 1 | 1 | 1 |
```

## Guardrails
- Never auto-hit external URLs > 20; batch with rate limit.
- Never silently rewrite doc prose — only factual/path/signature updates.
- Preserve the author's voice and style; only fix facts.
