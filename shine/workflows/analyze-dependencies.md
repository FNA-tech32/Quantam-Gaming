# Workflow — analyze-dependencies

Build a dependency risk report: outdated packages, CVEs, circular dependencies, upgrade plan.

## Prerequisites
- Project has at least one manifest file (package.json, requirements.txt, etc.).

## Steps

1. **Detect manifests**  
   Scan for: `package.json` · `package-lock.json` · `yarn.lock` · `pnpm-lock.yaml` · `requirements.txt` · `pyproject.toml` · `Pipfile` · `Cargo.toml` · `go.mod` · `composer.json` · `Gemfile`.

2. **Outdated analysis**  
   Per ecosystem:
   - JS: `npm outdated --json` or `yarn outdated --json`
   - Python: `pip list --outdated --format=json`
   - Go: `go list -m -u all`
   - Rust: `cargo outdated`
   For each dep: current version, latest, semver distance (patch/minor/major).

3. **Security audit**  
   - JS: `npm audit --json` or `yarn audit --json`
   - Python: `pip-audit --format=json` or `safety check --json`
   - Go: `govulncheck ./...`
   - Rust: `cargo audit`
   For each CVE: severity, affected version range, fix version, description.

4. **Circular dependency detection**  
   - JS: `npx madge --circular src/`
   - Python: `pydeps --no-show --reverse <package>`
   - Go: `go vet ./...` (import cycle detection)
   Report any cycles found with the full chain.

5. **Risk classification**  
   | Tier | Criteria | Action |
   |------|----------|--------|
   | 🟢 Patch | Patch-level behind, no CVE | Batch update in one PR |
   | 🟡 Minor | Minor-level behind, no CVE | Update per-package with tests |
   | 🔴 Major | Major-level behind OR has CVE | Individual PR with migration notes |
   | 🔴🔴 Critical | Active CVE with exploit | Immediate patch, skip normal flow |

6. **Upgrade wave plan**  
   Propose a phased upgrade strategy:
   ```
   Wave 1: Patch updates (low risk, batch)
   Wave 2: Minor updates (per-package, test each)
   Wave 3: Major updates (individual PRs, migration guides)
   Wave 4: CVE fixes (immediate, regardless of wave)
   ```

## Output
```
## Dependency report — <date>
### Summary
| Ecosystem | Total deps | Outdated | CVEs | Circular |
|-----------|----------:|--------:|-----:|--------:|

### Critical (act now)
| Package | Current | Fix | CVE | Severity |
|---------|---------|-----|-----|----------|

### Upgrade plan
<wave table>
```

## Guardrails
- Never auto-upgrade — always propose PR with diff.
- CVE data only from fetched source (advisory DB) — never guessed.
- If a major upgrade has known breaking changes, link to the migration guide.
