---
name: SHINE Agency Playbook
description: Client-facing workflows — tone switching, GDPR compliance guard, proposal assembly, and lead enrichment patterns. Load for any client-facing task.
type: reference
---

# SHINE Agency Playbook

Load this file when the task is client-facing: drafting emails/proposals, lead enrichment, compliance (GDPR/cookies/PII), or any work tagged `type: client` in memory.

---

## Client Communication Tone-Switching

Detect the working language from the prompt, file contents, or the active client memory entry (`type: client`).

### Italian (client-facing)
- **Opening:** _"Ciao [Name],"_ or _"Buongiorno [Name], spero tutto bene!"_ / _"buon inizio di settimana!"_
- **Structure:** context sentence → bullets for open items / deliverables → clear ask or next step
- **Close:** _"A presto, K"_ (informal) or _"A presto e buon lavoro, Kevin"_ (more formal)
- **Subject:** **always** `CLIENT | Specific topic`
- Never send documents _a freddo_ — always propose a call / presentation first
- Always CC relevant internal colleagues (PM, specialist, account)

### French / English / Spanish
Concise, agency-neutral register; preserve the `CLIENT | Topic` subject pattern on external comms.

### Internal messages
Casual, short, sometimes typos. Sign off with initial.

Client map, internal CC logic, and per-client context live in `~/.claude/memory/` under `type: client` entries.

---

## GDPR / Compliance Guard

USE WHEN: the task mentions cookies, consent, tracking, personal data, PII, GDPR, AI Act, DPIA, or vendor due diligence.

1. Route through the relevant audit tool BEFORE drafting:
   - Cookies / consent → [cookie-audit](https://github.com/diShine-digital-agency/cookie-audit)
   - Tag governance / GTM → [tag-auditor](https://github.com/diShine-digital-agency/tag-auditor)
   - AI policy / EU AI Act / ISO 42001 → [ai-compliance-framework](https://github.com/diShine-digital-agency/ai-compliance-framework)
   - PII anonymisation before LLM ingestion → [dishine-data-safe-usb](https://github.com/diShine-digital-agency/dishine-data-safe-usb)
2. Never suggest sending personal data to an external LLM without anonymisation.
3. Confidential audio → [dishine-boardroom-ear](https://github.com/diShine-digital-agency/dishine-boardroom-ear) (100% local).

---

## Proposal Assembly (`@create-proposal`)

USE WHEN: the user asks for a proposal, quote, or SOW.

1. Retrieve the client's context from `~/.claude/memory/` or Asana (do not invent).
2. Structure with **MoSCoW** (Must / Should / Could / Won't).
3. Estimate in **MD** (Man-Days = 8h). Include a ~15% discount option as alternative pricing.
4. Output in the client's language (Italian by default for IT accounts).
5. Propose a discussion call before sending the document. **Never auto-send.**

---

## Lead Enrichment (`@lead-enrichment`)

USE WHEN: the user asks for contact discovery, prospecting, or B2B enrichment.

1. Try local scripts first (e.g. `your-contact-extractor` — `python contact_extractor.py`).
2. Supplement with Apollo.io connector, Hunter.io, or Apify if needed.
3. Output as a structured CSV or Markdown table.
4. **Label pattern-guessed emails** as _"inferred pattern — not verified"_.
5. Respect GDPR: no scraping of EU personal data without a legal basis.

---

## Verified-Source Watermark

When a deliverable mixes sourced facts with drafted language, append a short _Sources_ footer listing each verified source with its fetch date. For unverified passages, inline-label them:
- `_[unverified — pattern inferred]_`
- `_[drafted — no source]_`

Template: `shine/templates/watermark.md`.
