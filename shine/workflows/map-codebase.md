# Workflow — map-codebase

Produce `CODEBASE-MAP.md` — a one-pass structural overview used by planners, debuggers, and new-joiners.

## Prerequisites
- Target directory is a code repo (contains `.git/` or a manifest file).

## Steps
1. **Tree snapshot** — depth-limited file tree. Exclude: `.git`, `node_modules`, `dist`, `build`, `.venv`, `__pycache__`, `.next`, `.turbo`, `coverage`.
2. **Language mix** — count files + LOC per extension; top 5 languages.
3. **Framework detection** — inspect:
   - `package.json` → Node.js framework (react/next/express/nest/etc.)
   - `requirements.txt` / `pyproject.toml` → Python stack
   - `Cargo.toml`, `go.mod`, `composer.json`, `Gemfile` → language root
   - `Dockerfile`, `docker-compose.yml` → runtime
   - `.github/workflows/*.yml` → CI surface
4. **Module boundaries** — top-level dirs under `src/`, `app/`, `packages/`, `apps/`; tag each as UI / API / domain / infra / test.
5. **Dependency graph** (lightweight) — grep `import ` / `require(` / `from ` across `src/`; aggregate into a `module → module` edge list (top 20).
6. **Entry points** — files matching `main.*`, `index.*`, `app.*`, `cli.*`, `server.*`; plus CLI bin scripts from package.json.
7. **Tests** — framework detected (jest/vitest/pytest/go test); file count; estimated coverage if reports exist.
8. **Size metrics** — top-10 largest source files (LOC) with one-line guesses at responsibility.

## Output — `CODEBASE-MAP.md`
```
# Codebase Map — <repo>
## Stack
## Module layout
## Entry points
## Dependency graph (top-20 edges)
## Tests
## Hotspots (largest files)
## Open questions for planner
```

## Guardrails
- Never read files matching secret patterns (`.env*`, `*.pem`, `*.key`, `credentials.json`).
- Never include user data / DB dumps / fixtures with PII.
- If a directory exceeds 10 000 files, sample rather than full-scan.
