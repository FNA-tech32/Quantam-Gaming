---
name: shine-proposal
description: "Assemble a client proposal with MoSCoW structure, MD estimates (8h/MD), and a ~15% discount option — Italian by default."
argument-hint: "<client name> | <project scope summary>"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Produce a client-ready proposal following the diShine / agency convention:

1. **Context retrieval** — load the client's memory file from `~/.claude/memory/client-*.md` (never invent context).
2. **Scope structuring** — classify every item into **MoSCoW** (Must / Should / Could / Won't).
3. **Effort estimate** — convert scope into **MD (Man-Days)** at 8h per MD.
4. **Pricing** — full price + a **~15% discount** alternative (explicit line items).
5. **Language** — Italian by default for IT clients; match the client memory's `language` field otherwise.
6. **Delivery posture** — NEVER auto-send. End with: _"Vuoi che lo presentiamo in call prima di inviarlo?"_.

Applies Decision Rule #19 of CLAUDE.md.
</objective>

<guardrails>
- Do not fabricate KPIs, past results, or reference projects. If a figure is not in the client memory, ask.
- If no client memory exists, stop and ask the user to create one before drafting.
- Output as a Markdown file `~/Downloads/proposal-<client>-<date>.md` — review first, send second.
</guardrails>

<output_format>
## Oggetto
`<CLIENT> | <Topic>`

## Premessa
(1–3 righe di context dal memory del cliente)

## Perimetro (MoSCoW)
### Must have
- …
### Should have
- …
### Could have
- …
### Won't (this round)
- …

## Effort & pricing
| Fase | MD | € (full) | € (-15%) |
|------|----|----|----|
| … | … | … | … |
| **Totale** | **…** | **…** | **…** |

## Prossimo passo
Proponiamo una call di presentazione prima dell'invio formale.

A presto,
K
</output_format>
