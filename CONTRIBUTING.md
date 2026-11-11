# Contributing to SHINE

Thanks for considering a contribution. SHINE is an opinionated framework — most changes land as PRs against `main` after a short discussion in an issue.

---

## Ground rules

1. **Small, focused PRs.** One concern per PR. If you're fixing a bug and adding a feature, that's two PRs.
2. **Reversibility first.** Nothing ships that a user can't `./uninstall.sh` away.
3. **Fail open.** Every hook must exit 0 on failure (except `shine-prompt-guard.js`, which fails closed by design).
4. **Factual discipline.** Skills and agents that produce claims must reference CLAUDE.md §16 in their `<guardrails>`.
5. **No telemetry by default.** Opt-in only, fields blank in the template.

---

## Development setup

```bash
git clone https://github.com/diShine-digital-agency/shine-claude-code-framework
cd shine-claude-code-framework

# Dry run to see what install would do, without touching your ~/.claude/
./install.sh --dry-run

# Real install into a backup — test, then uninstall to restore
./install.sh
# ...try it...
./uninstall.sh
```

If you're iterating on hooks or skills, you can symlink the working copy:

```bash
mv ~/.claude/hooks ~/.claude/hooks.bak
ln -s "$PWD/hooks" ~/.claude/hooks
```

---

## Adding a skill

1. Create `skills/<name>/SKILL.md` with the standard frontmatter.
2. Include `<objective>` and `<guardrails>` sections.
3. If the skill calls tools, list them under `allowed-tools:` — least privilege.
4. Add an entry to `docs/AGENCY-WORKFLOWS.md` if it fits a playbook.
5. Update `CHANGELOG.md` under the next version.

## Adding an agent

1. Create `agents/<name>.md` with frontmatter (`name`, `description`, `tools`, `color`).
2. Include `<role>`, `<approach>`, `<anti_patterns>`, `<output_format>` — the 5-section report format.
3. If your agent should be routed automatically, add or modify a decision rule in `CLAUDE.md`.
4. Update `CHANGELOG.md`.

## Adding a hook

1. Write the script to fail open.
2. Support an opt-out env var (`SHINE_DISABLE_<NAME>=1`).
3. Test with `echo '{}' | node hooks/your-hook.js` before registering.
4. Register in `settings.template.json` with an appropriate timeout.
5. Document in `docs/ARCHITECTURE.md` §2.4 and `docs/HOW-IT-WORKS.md` §5.

---

## PR checklist

Before opening a PR:

- [ ] `bash -n install.sh uninstall.sh hooks/*.sh` passes.
- [ ] `node --check hooks/*.js statusline.js` passes.
- [ ] `python3 -c "import json; json.load(open('settings.template.json'))"` passes.
- [ ] Every new agent has `<role>`, `<approach>`, `<anti_patterns>`, `<output_format>`.
- [ ] Every new skill has `<objective>` and `<guardrails>`.
- [ ] `CHANGELOG.md` updated under the next version.
- [ ] Docs updated if behaviour or layout changed.
- [ ] No hard-coded secrets, gateways, or personal paths.

The CI validator at `.github/workflows/validate.yml` runs these checks automatically.

---

## Commit style

Conventional-ish:

```
<type>(<scope>): <short imperative>

Optional body — why, not what.
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`.

Scopes: `agents`, `skills`, `hooks`, `install`, `docs`, `ci`, `memory`, `statusline`.

---

## Release process

1. Bump the version in `shine/VERSION` (create the file if missing) and in `CHANGELOG.md`.
2. Tag: `git tag vX.Y.Z && git push --tags`.
3. Create a GitHub release with the CHANGELOG entry as body.
4. `hooks/shine-check-update.js` will pick it up on users' next SessionStart.

---

## Code of Conduct

By participating you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md). Short version: be kind, assume good faith, no harassment.
