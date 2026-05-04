# Show HN draft — Hey Bradley v2.0.0-RC1

> **Title:** Show HN: Hey Bradley — Messy ideas → enterprise specs, instantly

---

## Body

Hey Bradley turns the conversation you're already having — about what you're building, why, and how — into a formal spec your AI coding tool can execute without guessing.

Cited research puts LLM coding sessions at roughly 55% silently wrong. The output runs. It compiles. It just isn't what you asked for, and you don't know until you read every line. Hey Bradley is my attempt to fix that — not by generating better code, but by making the spec the deliverable. Every prompt emits a structured AISP spec that humans and LLM agents can both verify before any code lands. If the spec is wrong, you correct the spec, not the rendered output. Hey Bradley is spec-first: it sits before you write code, upstream of whatever AI coding tool you're already using.

**Install the Claude Code plugin: `/plugin install bar181/hey-bradley`**

The plugin generates specs from your terminal. The web app at https://heybradley.app is where you visualize, iterate, and share them. That split is intentional — discovery happens where you already work; the workbench is THE product.

Speed is visible. Sub-second responses surface in a latency badge on every reply (Sprint K, moat priority #1). Try `/demo/full-site` for a 10-step scripted flow that builds a coffee-subscription site in under a minute. The badge updates per atom, not per request, so the spec layer's overhead is exposed, not hidden.

The differentiator at v2.0.0-RC1 is the AISP suite COMPLETE at 8 Crystal Atoms — INTENT, ASSUMPTIONS, SELECTION, CONTENT, PATCH, plus DECOMP for compound prompts, PROCESS for project decomposition, DDD for bounded-context domain models, AGENT for disjoint-ownedFiles wave specs. The spec is open at https://github.com/bar181/aisp-open-core — math-first, 512 symbols, designed for AI not humans, near-zero ambiguity. Polyglot reference implementations ship in `examples/3rd-party-consumer/` for TypeScript and Python. Standard library only. Zero npm, zero pip.

Three modes ship today. **Whiteboard** is the original chat-driven website builder — type a prompt, atoms classify, patches apply. **Planning** turns a project description into a Process Map and a DDD Domain Model side by side, same chat bar driving both atoms. **Agentics** is the spec factory — phase tree, SpecWorkbench tabs (Human / AISP / ADR), KISS Review gate (PASS = zero P1), Seal Panel with EOP cards, and Export Claude Code which emits a single markdown bundle with `# === FILE: <path> ===` markers. The bundle IS the canonical Hey Bradley OUTPUT — downstream consumer (Claude Code, Cursor, any LLM agent) reads it and writes implementation in their own repo. Spec freedom plus implementation autonomy.

Concrete state as of P109 / FINAL-CLEANUP: 237 cumulative regression GREEN / ~1491+ cumulative session GREEN across 109 sealed phases (P11 → P109) + 5-PROJECTS + FINAL-CLEANUP. 128 ADRs Accepted (range ADR-001 — ADR-137 with documented gaps). 51 EXAMPLE_SITES across 9+ verticals. 12 blog posts. 18 section types. 21 themes. 15 section arrangements. 15 content styles. Multi-page builds with page-aware patch routing. BYOK across Claude / Gemini / OpenRouter. Web Speech listen mode with PTT. Static HTML export. Markdown spec bundle export.

Honest about persona scores. Grandma 86 / Framer 86 / Lars 88 on the ADR-094 rubric per ADR-132 — **0/3 floor breaches** at v2.0.0-RC1 seal (the P101 boundary review surfaced 3 below-floor scores; the P102 fix-pass closed all three before the tag was cut). SOTA composite **86.7/100** per ADR-133 on a 7-category rubric (intent / visual / content / patches / sqlite / pipeline / ux), graded honestly. Hey Bradley is not competing with chat-to-website builders — it is upstream of them. The output is a spec, not a rendered site. The audience is anyone whose AI coding tool keeps shipping plausible-looking wrong code.

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
