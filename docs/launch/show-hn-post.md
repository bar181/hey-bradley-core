# Show HN draft — Hey Bradley v1.0.0-RC1

> **Title:** Show HN: Hey Bradley — spec-first AI website builder with open AISP protocol

---

## Body

Cited research puts LLM coding sessions at roughly 55% silently wrong. The output runs. It compiles. It just isn't what you asked for, and you don't know until you read every line. Hey Bradley is my attempt to fix that for one narrow domain — website builds. Every prompt emits a structured AISP spec that humans and AI agents can both verify before any code lands. If the spec is wrong, you correct the spec, not the rendered output.

Speed is visible. Sub-second responses surface in a latency badge on every reply (Sprint K, moat priority #1). Try `/demo/full-site` for a 10-step scripted flow that builds a coffee-subscription site in under a minute. The badge updates per atom, not per request, so the spec layer's overhead is exposed, not hidden.

The differentiator is AISP — AI Symbolic Protocol. Five Crystal Atoms classify every utterance: INTENT, ASSUMPTIONS, SELECTION, CONTENT, PATCH. A sixth atom (DECOMP) splits compound prompts before routing. The spec is open at https://github.com/bar181/aisp-open-core — math-first, 512 symbols, designed for AI not humans, near-zero ambiguity. Polyglot reference implementations ship in `examples/3rd-party-consumer/` for TypeScript and Python. Standard library only. Zero npm, zero pip. Drop into any project in five minutes.

Concrete state at v1.0.0-RC1: 996+ pure-unit tests passing. 108 ADRs Accepted. 41 templates across 8 verticals. 12 blog posts. 18 section types. 21 themes. 15 section arrangements. 15 content styles. 84 phases sealed (P11 → P83). Multi-page builds with page-aware patch routing (so "edit page 2 hero" actually lands on page 2). BYOK across Claude / Gemini / OpenRouter. Web Speech listen mode with PTT. Static HTML export. AISP versioned bundle export.

Honest deferrals — what is NOT in RC1 and is intentionally Tier-2 commercial: hosted share URL with persistence, HNSW vector-DB learning flywheel (the corpus is curated and static today; auto-write per agent run is gated behind a runtime that hasn't shipped), native mobile app, OAuth + Supabase persistence, Tier-2 dashboard / SaaS flagship. The open-core split is documented in `plans/strategic-reviews/open-core-moat-roadmap.md`.

The bet is the spec layer. If AISP doesn't survive contact with real third-party adoption, the moat collapses and Hey Bradley becomes another voice-to-code wrapper. Show me where AISP breaks. Open an issue. Send a counter-example. Falsify the protocol — that is the most useful thing you can do for me right now.

---

## Links

- Live demo: https://hey-bradley.com
- Build repo: https://github.com/bar181/hey-bradley-core
- AISP open spec: https://github.com/bar181/aisp-open-core
- Reference implementations: https://github.com/bar181/hey-bradley-core/tree/main/examples/3rd-party-consumer
- Adoption guide: https://github.com/bar181/hey-bradley-core/tree/main/docs/aisp-adoption
- Demo flow (scripted 10-step): https://hey-bradley.com/demo/full-site
- Listen mode: https://hey-bradley.com/demo/listen

---

## Authorship

Bradley Ross · Harvard ALM Digital Media Design capstone · May 2026 · MIT licensed.
