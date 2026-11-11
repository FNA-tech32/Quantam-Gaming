# Verified-source watermark — template

Drop this at the bottom of any client-facing deliverable that mixes **verified facts** (retrieved this session from a live source) with **drafted language** (written by the model). Keeps the factual/RAG discipline auditable.

---

## Inline labels (use within the body)

| Label | When to use |
|-------|-------------|
| `_[verified — <source-name>, <fetch-date>]_` | Any factual claim backed by a live fetch this session. |
| `_[unverified — pattern inferred]_` | Guessed emails, extrapolated company data, org-chart assumptions. |
| `_[drafted — no source]_` | Language, framing, opinions, recommendations — clearly authored, not retrieved. |
| `_[stale — cached <date>]_` | Facts pulled from a cache or memory file older than 30 days. |

---

## Sources footer (always append if ≥1 verified claim)

```
---

## Sources

| # | Claim | Source | Fetched |
|---|-------|--------|---------|
| 1 | <short claim> | <URL or tool:object-id> | YYYY-MM-DD |
| 2 | … | … | … |

_Unverified passages are inline-labelled. Drafted language is not claimed as fact._
```

---

## Example

> ACME Corp reported €12.4M revenue in FY24 _[verified — acme.com/investor, 2026-04-10]_. The CMO is likely Jamie Rivera _[unverified — pattern inferred from LinkedIn title]_. We recommend a 3-phase rollout _[drafted — no source]_.
>
> ---
>
> ## Sources
>
> | # | Claim | Source | Fetched |
> |---|-------|--------|---------|
> | 1 | €12.4M FY24 revenue | https://acme.com/investor | 2026-04-10 |

---

## Enforcement

- Every client deliverable with factual claims must end with a **Sources** table.
- If a deliverable has **zero verified claims**, add a one-line disclaimer: _"No facts retrieved this session — this is drafted language only."_
- Never fabricate an entry in the Sources table. If the fetch didn't happen, the claim doesn't belong in the document.
