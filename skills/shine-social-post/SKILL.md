---
name: shine-social-post
description: "Produce platform-native social posts — LinkedIn / IG / X / Threads variants from one angle."
argument-hint: "<angle or key message> [--platforms linkedin,ig,x]"
allowed-tools:
  - Read
  - Write
  - Glob
  - AskUserQuestion
---

<objective>
Generate one post per requested platform, respecting native constraints: LinkedIn (≤1200 char, hook-context-CTA), IG (≤2200 char, emoji-structured, hashtag cluster of 5-10), X (≤280 char, thread-ready), Threads (conversational, ≤500 char). Always align voice to the client's brand memory.
</objective>

<guardrails>
- **Factual discipline** (CLAUDE.md §16): every fact must come from a retrieved source in this session. No training-memory gap-filling.
- **Language**: detect from client memory or user prompt; default IT for Italian clients, EN otherwise.
- **Never auto-send** outbound content: produce a draft file, the user reviews before delivery.
</guardrails>
