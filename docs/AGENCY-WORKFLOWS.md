# SHINE — Agency Workflows

Playbooks for the work a digital agency does every day. Each workflow lists the rule that fires, the skills/agents involved, the MCPs expected, and the output you should expect on your disk.

---

## 1. Draft a client email

**Rule**: #17 (client name + communication verb).

**Flow**:

1. Claude detects the client slug (`ACME`, `CONTOSO`, `ORG-A`, …) in your prompt.
2. Loads `memory/client-<slug>.md` + `memory/style-email-<lang>.md`.
3. Fetches the last thread via Gmail MCP.
4. Runs the `/draft-email` skill.

**Output**: a Markdown draft in the chat with:
- Subject `CLIENT | Specific topic`
- Warm opening (`Ciao`, `Buongiorno + buon inizio di settimana!`, …)
- Structured body (context → bullets → clear ask / next step)
- Sign-off (`A presto, K` informal · `A presto e buon lavoro, Kevin` formal)
- Correct CC list from client memory

**Guardrail**: never auto-send. You review, then send manually (or ask Claude to create a Gmail draft via the connector).

**Involved**: `draft-email` skill, `shine-account-manager` agent (for tone), Gmail MCP.

---

## 2. Build a commercial proposal

**Rule**: #19 (keyword `proposta / proposal / preventivo`).

**Flow**:

1. Load `memory/client-<slug>.md` — budget type (flat / MD cap / per-project), CRM, contacts, historical discount.
2. Run `/proposal <client> <scope>`:
   - MoSCoW structure (Must / Should / Could / Won't)
   - MDs at 8h per day
   - ~15% discount option flagged
   - Italian by default (or client's language)
   - Proposes a **discussion call** before sending the PDF
3. Writes the draft to `./proposals/<client>-<scope>-<date>.md`.
4. Suggests the next step: "Confirm scope → convert to PDF → schedule call."

**Involved**: `proposal` skill, `shine-proposal-writer` agent, `memory/style-proposal.md`.

**Guardrail**: never invent numbers, deliverables, or historical KPIs. All claims must trace to memory files or fresh research.

---

## 3. Enrich a lead list

**Rule**: #20 (lead list / CSV / outbound campaign).

**Flow**:

1. User drops a CSV path or a company list.
2. `/lead-enrich`:
   - Local: run `python ~/your-contact-extractor/contact_extractor.py`
   - Supplement: Apollo.io MCP for email + title + LinkedIn
   - Fallback: Hunter.io pattern lookup (labeled "inferred pattern — not verified")
3. Output formatted as Markdown table or CSV.

**Guardrail**: emails that were literally scraped get no label. Emails derived from a pattern (`first.last@domain`) get `⚠️ inferred pattern — not verified`. Never silently guess.

**Involved**: `lead-enrich` skill, `shine-lead-scorer` agent, Apollo/Hunter MCPs, local Python scripts.

---

## 4. GDPR / privacy check on a deliverable

**Rule**: #18 (PII detected).

**Flow**:

1. Any time PII appears in a draft (email, CSV, report), SHINE runs `/gdpr-audit`:
   - Classify each field (PII direct, pseudonymous, aggregated, non-PII).
   - Flag legal basis (consent, contract, legitimate interest, legal obligation).
   - Note retention and transfer concerns.
2. For higher-risk workflows (new processing, new vendor), delegate to `shine-gdpr-analyst` agent for a DPIA skeleton.

**Output**: short privacy note appended to the draft; if severe, refuses to produce the deliverable and explains why.

**Involved**: `gdpr-audit` skill, `pii-safe` skill, `shine-gdpr-analyst` agent, EU AI Act rubric in CLAUDE.md §18.

---

## 5. Kickoff a new engagement

**Flow**:

1. `/kickoff <client>`:
   - Creates `memory/client-<slug>.md` skeleton
   - Creates `memory/project-<slug>.md` with scope, budget, timeline
   - Drafts the kickoff email (IT/EN/FR) with agenda, RACI, next steps
   - Suggests Asana project name + tag list
2. Kevin edits the memory files to taste.
3. `/client-brief` produces a one-pager for internal stakeholders.

**Involved**: `kickoff`, `client-brief`, `shine-pm-coordinator`, `shine-account-manager`.

---

## 6. Weekly status report

**Flow**:

1. `/status-report <client>`:
   - Reads Asana tasks closed this week via Asana MCP
   - Reads Gmail thread summaries in `[C/P] <CLIENT>` label
   - Produces a one-pager in IT:
     - Cosa abbiamo fatto (bullets, MDs burned)
     - Cosa c'è in coda
     - Blocker / attese
     - Prossimo step + data di sync
2. Output: `./reports/<client>-W<NN>.md`.

**Involved**: `status-report`, `shine-pm-coordinator`, Asana MCP, Gmail MCP.

---

## 7. Retrospective

**Flow**:

1. `/retrospective <project>` after a milestone.
2. SHINE queries Asana + Gmail + memory, runs `shine-retro-facilitator` agent.
3. Produces: What worked / What didn't / Hypotheses / Experiments for next sprint.

**Output**: `./retros/<project>-<date>.md`.

---

## 8. SEO / tech audit

**Flow**:

1. `/seo-audit <domain>`:
   - Ahrefs MCP: domain rating, backlinks, organic keywords
   - Site audit issues
   - GSC metrics
2. `shine-seo-strategist` synthesizes findings into a prioritized action list.
3. Pairs with `/meta-check` for on-page and `/tag-audit` for GTM/GA4.

**Output**: `./audits/<domain>-seo-<date>.md` with MoSCoW-prioritized recommendations.

---

## 9. Cookie & tag audit

**Flow**:

1. `/cookie-scan <url>` — Playwright opens the page, records cookies + local storage.
2. `/tag-audit` — checks GTM container, data-layer events, GA4/GAds/Meta tags.
3. GDPR cross-check (`/gdpr-audit`) on any tag transmitting PII.

**Output**: `./audits/<domain>-tags-<date>.md` with compliance status, broken tags, and remediation steps.

**Involved**: `cookie-scan`, `tag-audit`, Playwright plugin, `shine-gdpr-analyst`.

---

## 10. Content calendar + blog post

**Flow**:

1. `/content-calendar <client> <quarter>`:
   - Loads client memory, competitor insights (from prior `/competitor-analysis`), SEO keywords.
   - Outputs a calendar in Markdown with pillar topics, cadence, channels, owners.
2. Per post: `/blog-post <topic>` runs a factual-RAG research pass (Perplexity / Exa) then drafts in brand voice (`memory/style-content-*.md`).

**Guardrail**: every stat in a post must have a cited source fetched in-session.

---

## 11. Discovery call prep

**Flow**:

1. `/sales-call-prep <company>`:
   - `shine-client-researcher` pulls public facts (site, press, LinkedIn, Crunchbase via Exa).
   - `shine-competitor-scout` lists the 3–5 likely competitors.
   - `shine-persona-researcher` builds a buyer persona from the title + sector.
2. Output: 1-page brief with talking points, discovery questions, likely objections.

After the call: `/sales-call-debrief` converts Otter/Gong/notes into a structured follow-up with next steps + email draft.

---

## 12. Pitch deck / sales deck

**Flow**:

1. `/sales-deck <client> <offering>` produces a slide outline (`memory/style-proposal.md` + `shine-copywriter`).
2. Optional: export to `.pptx` via the PowerPoint MCP.

---

## 13. ICP & persona

**Flow**:

1. `/icp-define <product>` → firmographic + technographic filters, disqualifiers.
2. `/persona-build <role>` → goals, pains, objections, channels, messaging.

Fed into `/cold-email`, `/linkedin-dm`, and outbound campaigns in Saleshandy.

---

## 14. Outbound cold email

**Flow**:

1. `/cold-email <persona> <offer>`:
   - Drafts 3 variants: short / curiosity / direct
   - Each with subject, body ≤120 words, one clear CTA
   - Personalization hooks (`{{first_name}}`, `{{company_fact}}`)
2. Never auto-sent. Kevin approves → Saleshandy campaign.

**Guardrail**: no fabricated company facts. `{{company_fact}}` slots are labeled "source required".

---

## 15. Tech deliverables

For dev-heavy engagements (diShine builds, agency integrations):

| Skill | Output |
|---|---|
| `/tech-spec` | Functional + non-functional spec, acceptance criteria |
| `/api-design` | OpenAPI sketch + auth model |
| `/architecture-diagram` | Mermaid diagram + component responsibilities |
| `/deploy-checklist` | Pre-deploy gate list |
| `/migration-plan` | Phased migration with rollback |
| `/incident-report` | Post-mortem skeleton |
| `/test-strategy` | Unit / integration / E2E breakdown |
| `/pr-review` | Structured PR review comment |

Paired with `shine-martech-architect` for MarTech specifics (CDP, CRM, GTM, server-side tagging).

---

## 16. The guardrails that run across every workflow

- **Factual RAG** (CLAUDE.md §16) — every factual claim traceable to a source retrieved this session.
- **Language detection** — IT for Italian clients, EN/FR/ES when the client memory says so, explicit override always wins.
- **Never auto-send** — proposals, emails, outbound messages always end as a draft file Kevin reviews.
- **PII-aware** — rule #18 intercepts PII, routes through GDPR check.
- **CC logic** — client memory's `cc_always` list is always attached on drafts.

When a workflow fails because an MCP is missing, SHINE states it plainly and offers a degraded path — never invents data.
