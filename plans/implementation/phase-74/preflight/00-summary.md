# P74 / OC-DECOMP + Comprehensive Review + Highlights/Log + Demo

> **Phase:** P74 · **Sprint family:** OC-DECOMP (headline) + parallel Brutal-Honest Review + Highlights/Log + Full-Site Demo
> **Date:** 2026-05-01
> **Predecessor:** P73 / OC-TPL-AUDIT sealed at `ddd3a07` (843 GREEN, 98 ADRs)
> **Authority:** owner brief — multi-track parallel dispatch, up to 13 agents, single seal

---

## 5 parallel tracks · 10 agents · disjoint file scopes

### Track A — OC-DECOMP core (3 agents)

**The headline ask.** When user says "make it brighter and more fun and add pricing", current pipeline processes it as one blob → DECOMP splits into structured todos before template matcher fires.

- **A1** owns NEW `src/contexts/intelligence/aisp/decompAtom.ts` — DECOMP_ATOM Crystal Atom: takes user utterance + INTENT classification, splits into ordered `Todo[]` (each: `{ verb, target, details, sourceSpan }`). Pure function, deterministic-rules baseline; LLM enrichment optional.
- **A2** owns NEW `src/contexts/intelligence/aisp/todoExecutor.ts` — orchestrates Todo[] through existing matcher → patches loop; emits structured trace per todo for ConversationLogTab.
- **A3** owns chatPipeline.ts wire (insert decomp BEFORE matcher; loop over todos applying per-todo patches) + `docs/adr/ADR-099-decomposition-atom.md`.

### Track B — Highlights + Log (2 agents)

Owner brief: chat + listen show 5-25 word highlights; ConversationLogTab carries full detail.

- **A4** owns NEW `src/lib/highlightExtractor.ts` (function `extractHighlight(text, min=5, max=25)`) + `src/components/shell/ChatThread.tsx` (use highlight mode for bradley replies) + `src/components/left-panel/ListenTab.tsx` light edit (highlights for transcript display).
- **A5** owns `src/components/center-canvas/ConversationLogTab.tsx` audit + enhancement (verify full detail visibility; add per-todo decomp trace if A1/A2 emit it).

### Track C — Full-site demo simulator (1 agent)

Owner brief: "simulator for a full listen mode to a Hey Bradley site with articles and changes in style."

- **A6** owns NEW `src/demos/FullSiteSimulator.tsx` — extends existing ListenModeDemo to a 10-step flow: hero → blog 3-card → article body → theme retro → typography → second article → image gallery → testimonials → CTA → final spec bundle. Self-contained scripted (no LLM). Linked from Welcome.

### Track D — Brutal-honest review (3 Explore agents, chunked at ≤600 LOC each)

- **A7** writes `plans/strategic-reviews/2026-05-01-comprehensive-review-1-features.md` (~600 LOC) — feature inventory + 1-100 scoring per feature; SOTA baseline 80/100; cite file:line.
- **A8** writes `plans/strategic-reviews/2026-05-01-comprehensive-review-2-design-ux.md` (~600 LOC) — design + UX + mobile + accessibility scoring vs SOTA.
- **A9** writes `plans/strategic-reviews/2026-05-01-comprehensive-review-3-gaps-resolutions.md` (~600 LOC) — gap analysis vs SOTA + resolution mapping to remaining sprints (P74-P84 per session summary).

### Track E — Tests + EOP closer (1 agent)

- **A10** owns NEW `tests/p74-decomp-and-highlights.spec.ts` (≥20 cases) + EOP triplet at `plans/implementation/phase-74/` + CLAUDE.md sync + ruvector entry.

---

## Hard rules (all 10 agents)

1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO new section types (16 unchanged)
4. NO touching files outside owned list
5. NO shell commands inside agents
6. TypeScript-strict; no `any`
7. Per-file LOC caps (specified per agent)
8. Track D (review) is read-only — no source edits

## Acceptance gates

- ADR-099 Accepted; DECOMP_ATOM splits multi-clause input deterministically
- Todo executor consumes `Todo[]` and applies patches in order
- chatPipeline runs decomp → todos → matcher loop without breaking single-clause path
- ChatThread + ListenTab show highlights ≤25 words
- ConversationLogTab shows full detail + decomp trace
- FullSiteSimulator renders 10-step scripted flow at `/demo/full-site`
- 3 review docs land at `plans/strategic-reviews/` (≤600 LOC each)
- 20+ new tests; tsc clean; cumulative ≥863 GREEN

## Successor

Owner picks from the OC-7 / OC-9 / OC-10 / OC-11 / OC-14 / OC-15 / OC-16 / OC-17 / OC-18 lineup per the v1.0.0 roadmap.
