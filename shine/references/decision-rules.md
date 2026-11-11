---
name: SHINE Decision Rules
description: Full 29-rule decision matrix — the complete auto-routing table. The slim CLAUDE.md contains only top-level rules; load this for exhaustive coverage.
type: reference
---

# SHINE Decision Rules — Full Table

The slim `CLAUDE.md` keeps only the core rules (RAG discipline + tier fallback). This file is the full routing matrix — load when edge-case routing questions come up.

1. **User reports a problem** → code-review-graph (IF available) → Serena (symbol-level detail) → claude-mem (past issues) → `systematic-debugging` skill BEFORE responding.
2. **User asks "how do I…"** → graphify (IF available) → Context7 (library docs) → Serena (existing patterns) → claude-mem (past solutions).
3. **User shares a URL** → Playwright. If research target → also `shine-web-researcher` agent.
4. **Starting any non-trivial task** → check superpowers skills (brainstorming, debugging, TDD).
5. **Making code changes** → code-review-graph `get_impact_radius` + `get_affected_flows` (IF available) → Serena `find_referencing_symbols` → code-simplifier after.
6. **Completing work** → `verification-before-completion` skill + `code-reviewer` agent.
7. **Multiple independent tasks** → `dispatching-parallel-agents` or Agent Teams.
8. **User references past work** → claude-mem search → `qdrant` MCP vector search (IF connected).
9. **Frontend/UI work** → graphify (IF available) → `ui-ux-pro-max` skill.
10. **Complex multi-step project** → SHINE skills for phased management.
11. **External library usage** → Context7 for docs, ALWAYS.
12. **After writing significant code** → spawn `code-simplifier` agent.
13. **LLM app observability/tracing** → Arize skills (trace, experiment, prompt-optimization).
14. **Task has 2+ independent pieces** → PROACTIVELY propose Agent Teams; explain the split.
15. **Code review or impact analysis** → code-review-graph (`detect_changes`, `get_impact_radius`) BEFORE manual inspection (IF available).
16. **Any factual claim about a company, person, email, event, URL** → verify via live tool BEFORE stating. If unverified → say so and stop.
17. **Drafting a client communication** → detect language, apply tone rules, `CLIENT | Topic` subject, propose CC list, never auto-send. (see `agency-playbook.md`)
18. **Mention of cookies, consent, PII, GDPR, AI Act, DPIA** → route through the compliance guard BEFORE drafting. (see `agency-playbook.md`)
19. **Request for a proposal / quote / SOW** → MoSCoW + MD estimates + ~15% discount + Italian-by-default, propose call before send. (see `agency-playbook.md`)
20. **Request for lead enrichment / prospecting** → local scripts first, label inferred emails, structured output, GDPR-aware. (see `agency-playbook.md`)
21. **Any tool selection with free and paid alternatives** → Tier 1 first, Tier 2 ASK, Tier 3 REQUIRE approval. Never silently consume credits. (see `tool-tiers.md`)
22. **Web research / competitive intel / "find out about"** → `shine-web-researcher` agent OR `/shine-web-research` skill. Tool order: `searxng` → `fetch` → `brave-search` → `tavily` → Perplexity → manual. Every claim cited with [Source: URL, date].
23. **Data file (CSV, Parquet, JSON, Excel) OR "analyze this"** → `shine-data-engineer` agent OR `/shine-data-query` skill. Tool order: `duckdb` → `sqlite` → `excel` MCP → pandas via Bash. Profile schema first. Never upload externally.
24. **Chart / visualization / diagram** → `shine-chart-builder` agent OR `/shine-chart` skill. quantitative → `echarts`; structural → `mermaid`; statistical → `vegalite`; fallback → standalone HTML with CDN. Always label axes with units.
25. **Security scan / vulnerability check** → `shine-vulnerability-scanner` agent OR `/shine-security-scan` skill. Code: `semgrep` → Semgrep CLI. Dependencies: `osv` → `npm audit`/`pip audit`. SSL/domains: `sslmon` → `openssl s_client`. Read-only — never auto-fix.
26. **Run untrusted code / "execute in sandbox"** → `shine-sandbox-runner` agent OR `/shine-sandbox` skill. Risk-assess: 🔴 untrusted MUST sandbox. Tool chain: `docker` → `microsandbox` → Docker CLI → `e2b`. Never run 🔴-risk code on host.
27. **Dependency audit / "any CVEs?"** → `/shine-dep-audit` skill. `osv` → `npm audit`/`pip audit`/`govulncheck`. Report CVE + CVSS + fix version. Never auto-upgrade without approval.
28. **Network diagnostics / "check DNS" / "SSL status"** → `/shine-network-check` skill. `globalping` → `sslmon` → `ping`/`dig`/`traceroute`/`openssl`. Read-only — never port scan without approval.
29. **"Save this for later" OR "what did we do about X"** → `/shine-vector-search` skill. `qdrant` → `claude-mem` → grep `~/.claude/memory/`. Never store PII or secrets in vector DB.
