# Show HN draft — Hey Bradley v2.0.0-RC1

> **Title:** Show HN: Hey Bradley v2.0.0-RC1 — three-mode workbench produces specs that LLM agents implement

---

## Body

Cited research puts LLM coding sessions at roughly 55% silently wrong. The output runs. It compiles. It just isn't what you asked for, and you don't know until you read every line. Hey Bradley is my attempt to fix that — not by generating better code, but by making the spec the deliverable. Every prompt emits a structured AISP spec that humans and LLM agents can both verify before any code lands. If the spec is wrong, you correct the spec, not the rendered output.

Speed is visible. Sub-second responses surface in a latency badge on every reply (Sprint K, moat priority #1). Try `/demo/full-site` for a 10-step scripted flow that builds a coffee-subscription site in under a minute. The badge updates per atom, not per request, so the spec layer's overhead is exposed, not hidden.

The differentiator at v2.0.0-RC1 is the AISP suite COMPLETE at 8 Crystal Atoms — INTENT, ASSUMPTIONS, SELECTION, CONTENT, PATCH, plus DECOMP for compound prompts, PROCESS for project decomposition, DDD for bounded-context domain models, AGENT for disjoint-ownedFiles wave specs. The spec is open at https://github.com/bar181/aisp-open-core — math-first, 512 symbols, designed for AI not humans, near-zero ambiguity. Polyglot reference implementations ship in `examples/3rd-party-consumer/` for TypeScript and Python. Standard library only. Zero npm, zero pip.

Three modes ship today. **Whiteboard** is the original chat-driven website builder — type a prompt, atoms classify, patches apply. **Planning** turns a project description into a Process Map and a DDD Domain Model side by side, same chat bar driving both atoms. **Agentics** is the spec factory — phase tree, SpecWorkbench tabs (Human / AISP / ADR), KISS Review gate (PASS = zero P1), Seal Panel with EOP cards, and Export Claude Code which emits a single markdown bundle with `# === FILE: <path> ===` markers. The bundle IS the canonical Hey Bradley OUTPUT — downstream consumer (Claude Code, Cursor, any LLM agent) reads it and writes implementation in their own repo. Spec freedom plus implementation autonomy.

Concrete state at v2.0.0-RC1: ~1300+ pure-unit tests passing across 101 sealed phases (P11 → P101). 131 ADRs Accepted. 43 templates across 9 verticals. 12 blog posts. 18 section types. 21 themes. 15 section arrangements. 15 content styles. Multi-page builds with page-aware patch routing. BYOK across Claude / Gemini / OpenRouter. Web Speech listen mode with PTT. Static HTML export. Markdown spec bundle export.

Honest about persona scores. Grandma 84 / Framer 84 / Lars 85 on the ADR-094 rubric — three floor-breaches named in ADR-131, not papered. SOTA composite 79–84/100 vs Lovable 80/100 baseline per ADR-127 §C — honest +0 to +4 vs state-of-the-art, not a hype claim.

Honest deferrals — what is NOT in RC1 and is intentionally Tier-2 commercial: hosted share URL with persistence, HNSW vector-DB learning flywheel (corpus is curated and static today; auto-write per agent run gated behind a runtime that hasn't shipped), native mobile, OAuth + Supabase persistence, Tier-2 dashboard / SaaS flagship. Owner-required post-RC: live LLM BYOK smoke (CF#4 in ADR-131) and real STT calibration (CF#5). The open-core split is documented in `plans/strategic-reviews/open-core-moat-roadmap.md`.

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
- Planning mode: https://hey-bradley.com/planning
- Agentics mode: https://hey-bradley.com/agentics

---

## Authorship

Bradley Ross · Harvard ALM Digital Media Design capstone · May 2026 · MIT licensed.
