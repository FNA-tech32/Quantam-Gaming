# QUICKSTART — SHINE in 5 minutes

This is the 1-page guide. For the full picture, see [README.md](./README.md).

---

## 1. Install (2 min)

```bash
git clone https://github.com/diShine-digital-agency/SHINE-Code-System.git
cd SHINE-Code-System
./install.sh
```

The installer backs up any existing `~/.claude/` to `~/.claude-backup-<timestamp>/` before copying anything, then asks you to pick a **context profile**:

| Profile | Context | Good for |
|---|---|---|
| `minimal` | ~15k | Default. Writing, research, agency comms — no code plugins. |
| `writing` | ~20k | `minimal` + Context7 (library docs when you need them). |
| `outbound` | ~35k | Lead enrichment, prospecting, cold email, CRM work. |
| `seo` | ~40k | SEO audits, GA4/GTM analysis, Ahrefs. |
| `dev` | ~70k | Full engineering stack (Serena, LSPs, Playwright, Supabase). |
| `full` | ~95k | Every plugin — previous default. Only if you have headroom. |

**Flags worth knowing:**

- `--profile=<name>` — skip the picker, pre-select a profile
- `--dry-run` — show every action, change nothing
- `--no-plugins` — skip plugin install (offline)
- `--non-interactive` — no prompts (requires `--profile`)

You can switch profiles any time after install (see step 3).

---

## 2. Verify (30 sec)

```bash
node ~/.claude/shine/bin/shine-tools.cjs --version
# → {"version":"1.1.0","name":"shine-tools"}

node ~/.claude/shine/bin/shine-tools.cjs help
```

If both respond, you're installed.

**Optional — add `shine` to your PATH** for the short CLI:

```bash
echo 'export PATH="$HOME/.claude/shine/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
shine --version
```

---

## 3. Switch context profile (anytime)

```bash
shine list                # see all profiles + context estimates
shine current             # which plugins/MCPs are active right now
shine activate outbound   # swap to outbound profile
shine show outbound       # print the profile's JSON
```

⚠️ Restart Claude Code for profile changes to take effect.

---

## 4. First session (2 min)

Start Claude Code from any directory:

```bash
claude
```

Then inside the session:

```
/shine-help            ← orient yourself
/shine-new-project     ← scaffold a project with discovery
/shine-next            ← ask "what should I do now?"
```

**Three slash commands you'll use every day:**

| Command | Use when |
|---|---|
| `/shine-plan-phase <N>` | Starting a non-trivial chunk of work |
| `/shine-execute-phase <N>` | Plan is ready, ship the code |
| `/shine-verify-work <N>` | Done executing, before marking the phase done |

---

## 5. Your first project in 60 seconds

```
/shine-new-project
→ Answers the 4 discovery questions (goal, audience, metric, timeline)
→ ROADMAP.md + phase 1 CONTEXT.md scaffolded

/shine-plan-phase 1
→ shine-planner subagent drafts the plan
→ shine-plan-checker audits it

/shine-execute-phase 1
→ Executor spawns per-wave subagents in parallel
→ Atomic commit after each wave

/shine-verify-work 1
→ 5-section report: Summary · Details · Sources · Open questions · Next step
```

---

## 6. Memory (know this)

Your memory is typed. Files must start with one of these prefixes:

- `preference-<topic>.md` — your working style
- `client-<slug>.md` — a specific client
- `project-<slug>.md` — a specific project
- `style-<topic>.md` — formatting / tone rules
- `external-<topic>.md` — third-party reference (GDPR guide, a vendor API)

Location: `~/.claude/memory/` (or symlinked from `./memory/` in a project).

---

## 7. When things go wrong

| Symptom | Try |
|---|---|
| A skill does nothing | `node ~/.claude/shine/bin/shine-tools.cjs help` — is the runtime installed? |
| Hook errors on every Write | `cat ~/.claude/hooks/shine-prompt-guard.js` — it probably blocked a secret-shaped string |
| Claude Code feels slow / OOM on start | Context too heavy — run `shine activate minimal` and restart Claude Code |
| MCP you need isn't available | Check the active profile (`shine current`) — you may be on `minimal`. Activate a profile that includes it, or see [docs/ADDING-INTEGRATIONS.md](./docs/ADDING-INTEGRATIONS.md) |
| `~/.claude/` looks wrong | `./uninstall.sh` then re-run `./install.sh` — the backup is safe |

---

## 8. Where to go next

- **Full architecture**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **All 149 skills**: [skills/INDEX.md](./skills/INDEX.md) (regenerate via `node shine/bin/shine-tools.cjs index-skills`)
- **Customization**: [docs/CUSTOMIZATION.md](./docs/CUSTOMIZATION.md)
- **Agency workflows**: [docs/AGENCY-WORKFLOWS.md](./docs/AGENCY-WORKFLOWS.md)

---

_SHINE = Strategize · Handle · Implement · Navigate · Evaluate_
