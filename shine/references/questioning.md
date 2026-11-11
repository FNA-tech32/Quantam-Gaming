# SHINE Questioning Framework

Structured interview methodology for requirements gathering, discovery, and assumption surfacing. Used by `/shine-new-project`, `/shine-new-milestone`, and discovery/proposal skills.

---

## 1. Ground rules

- **One question at a time.** Batches feel like interrogations.
- **Label assumptions openly.** "I'm assuming X — correct me if wrong" invites correction.
- **Never fabricate a client answer.** If the user skips, record it as an open question.
- **Stop at the first sign of unclear scope.** Don't push downstream with a fuzzy brief.

---

## 2. The 5-Why ladder

For every stated outcome, ask **"Why?"** up to five times to surface the real goal.

```
Output: "We need a new landing page."
  Why? → "To boost sign-ups."
    Why sign-ups? → "To feed the sales pipeline."
      Why this pipeline? → "Because Q3 deals stalled."
        Why stalled? → "Our AOV dropped and we need more top-of-funnel."
          Why AOV dropped? → … (root cause)
```

Stop when the next "why" becomes a strategic decision rather than a tactical one.

---

## 3. MoSCoW elicitation prompts

Use these exact phrasings to surface priorities:

- **Must**: *"If we only ship one thing and the project is a success, what is it?"*
- **Should**: *"What would be disappointing to miss, but we could live without at launch?"*
- **Could**: *"What's a nice-to-have if budget and time allow?"*
- **Won't**: *"What is explicitly out of scope this round? Let's name it so nobody expects it."*

---

## 4. Assumption surfacing checklist

Before closing the brief, verify each bucket:

| Bucket | Question |
|--------|----------|
| Audience | Who exactly is this for? One primary persona or segment? |
| Success metric | How will we know it worked? What number moves? |
| Timeline | When does this need to be live? What's driving the date? |
| Budget | What's the envelope? MDs or €? |
| Constraints | Brand, legal, GDPR, accessibility, integrations we must respect? |
| Dependencies | Who else owns a piece? What are we waiting on? |
| Sign-off | Who approves? One name. |
| Risks | What would kill this? Name the top two. |

---

## 5. Discovery call template (30 min)

```
00:00  Intro & goals for the call                    (3 min)
00:03  Business context — why now, what's changing   (7 min)
00:10  Current state — what exists today             (5 min)
00:15  Desired outcome — 5-Why                       (7 min)
00:22  Constraints & guardrails                      (5 min)
00:27  Recap + next step + sign-off                  (3 min)
```

Always end with an explicit next step and a named owner.

---

## 6. When the brief is unclear

If after the interview you still cannot answer *"what exactly ships, by when, for whom, measured how"* — **stop**. Do not proceed to planning.

Output instead:

```
## Open questions (blocking)
1. …
2. …

## Next step
Propose a 20-minute follow-up to close these before planning.
```

---

## 7. Red flags

Pause and escalate if you hear:

- *"Just make it nice."* → no measurable outcome
- *"Like [competitor], but better."* → no point of view
- *"We'll figure out success later."* → no metric
- *"Everyone in the org is the audience."* → no target
- *"ASAP."* → no real deadline

Each of these is a signal that discovery isn't finished.
