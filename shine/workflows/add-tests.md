# Workflow — add-tests

Add tests for a specific module, function, or phase output. Follows a test-plan-first approach.

## Prerequisites
- Target code exists and is functional (we're adding tests, not fixing bugs).
- Project has a test runner configured (or we'll set one up).

## Steps

1. **Framework detection**  
   Inspect project manifests to identify the test stack:
   - `package.json` → jest / vitest / mocha / ava / playwright / cypress
   - `pyproject.toml` / `setup.cfg` → pytest / unittest
   - `Cargo.toml` → `cargo test`
   - `go.mod` → `go test`
   - `composer.json` → phpunit
   - If no test runner found → propose one based on the stack; install on user approval.

2. **Target scope**  
   Ask user for: file, function, feature, or phase number.  
   If phase number: scan all files modified in that phase's commits.

3. **Coverage baseline**  
   If a coverage report exists (`.coverage`, `coverage/lcov.info`, etc.):
   - Parse current % for the target module.
   - Set target: current + 20% or 80%, whichever is lower.
   If no coverage tooling: note "no baseline" and skip delta tracking.

4. **Test plan**  
   For each target function/component, list test cases in categories:
   ```
   | # | Category | Test case | Input | Expected |
   |---|----------|-----------|-------|----------|
   | 1 | Happy path | Normal input | valid data | correct output |
   | 2 | Edge case | Empty input | "" | graceful handling |
   | 3 | Edge case | Boundary value | MAX_INT | no overflow |
   | 4 | Error case | Invalid type | null | throws TypeError |
   | 5 | Error case | Network failure | timeout | retry or error msg |
   ```
   Show plan to user for approval before writing.

5. **Write tests**  
   Place in framework-appropriate location:
   - JS: `__tests__/<module>.test.ts` or `<module>.spec.ts` (colocated)
   - Python: `tests/test_<module>.py`
   - Go: `<module>_test.go` (same package)
   - Rust: `#[cfg(test)] mod tests` inline or `tests/` dir
   Follow existing test patterns in the project (naming, assertion style, fixtures).

6. **Run new tests only**  
   Execute just the new test file to confirm green:
   - JS: `npx vitest run <file>` or `npx jest <file>`
   - Python: `pytest <file> -v`
   Capture output.

7. **Run full suite**  
   Confirm no regressions: run the complete test suite.  
   If regressions found → fix or flag (never silently ignore).

8. **Coverage delta**  
   If coverage tooling exists, re-run with coverage and report delta.

9. **Commit**  
   `node shine/bin/shine-tools.cjs commit "test: <scope>" --scope test --raw`

## Output
- Test files created.
- Test results (pass count, coverage delta).
- 5-section report: summary, test plan, results, coverage, next steps.

## Guardrails
- Tests never mutate global state without teardown.
- No real network / DB calls — mock or use test doubles.
- Fixtures with any PII-like shape get scrubbed.
- Never skip a failing test with `.skip` — fix it or flag it.
