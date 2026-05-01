# P80 / OC-15 — Retrospective

> **Phase:** P80 · **Sprint:** OC-15 (Agentic-Product Templates) · **Date:** 2026-05-01

## Keep

- **Three-track parallel dispatch (A1 templates+wire / A2 scoring doc / A3 closer) on disjoint surfaces.** Agentic-product family is genuinely a multi-artifact ship (4 JSON files + index wire + scoring doc + ADR + tests + EOP), and splitting on those seams kept each agent in a narrow blast radius. No collisions on the source files because A1 owned `src/data/examples/*` and `index.ts`, A2 owned a scoring doc under `plans/strategic-reviews/`, and A3 (this agent) ships docs + tests + CLAUDE.md only.
- **FS-read pure-unit pattern with `existsSync` guards on A1 surfaces.** The closer test ships GREEN even when A1 lands slightly later — the spec only hard-gates A3 deliverables (ADR-105 file shape, EOP triplet present). This pattern (used at P74 for Track-D review docs, P78 for A4/A5 surfaces, P79 for A2/A3 surfaces) keeps the seal-gate honest without forcing serial dispatch.
- **ADR-105 stays ≤120 LOC (actual: 73 LOC).** Tight ADR with 3-decision shape + cross-refs is more useful than a long essay. Naming the gap explicitly ("Hey Bradley templated everyone's market except its own") makes the why land in two paragraphs.
- **+4 over the literal floor (37 → 41 vs. floor 40) — buffer of 1.** The P73 OC-TPL-AUDIT carry-forward named the literal floor as "+3 to reach 40+." Shipping +4 with an explicit buffer entry means the next template-audit sprint can drop one if quality demands it without breaking the floor commitment.
- **Inherited standards over new standards.** ADR-105 cross-refs ADR-096 (expansion standard), ADR-098 (intelligence / `exampleQueries`), ADR-091 (canonical-quality). No new standards introduced. New templates are required to clear the existing bar; the bar is unchanged.
- **No new section types.** P75 / ADR-100 closed the section-type enum at 18 (with `case-study` + `contact-form`). The agentic-product family relies heavily on those two, validating the ADR-100 closure decision retroactively.

## Drop

- **The temptation to ship "AI animated hero" demos.** OC-15 preflight punted animation-library hero embeds to Tier-2 commercial. Hold the line. ADR-091 hover-lift only.
- **The temptation to widen the section enum mid-sprint.** Each agentic-product vertical can be tempting to support with a new "agent-card" or "workflow-step" section type. Punt. The existing `feature-grid` + `case-study` + `pricing-tiers` + `contact-form` cover it.
- **The temptation to ship 6+ templates instead of 4.** Closing the gap at the floor + 1 buffer is the right call; quality over quantity (P73 audit verdict). +9 stretch to reach Lovable / Framer's 50+ stays carry-forward.
- **Multi-page agentic-product templates.** ADR-103 / ADR-104 wire is in place but P80 templates ship single-page — getting the vertical positioning right on each landing surface is hard enough; multi-page expansion is a P82+ candidate.
- **Worry about pricing-tier copy aging.** Pricing-tier copy ages; that's a known property. Mitigation isn't "leave it generic"; it's "audit-fix sprint cadence." Same pattern as P73 OC-TPL-AUDIT.

## Reframe

- **Hey Bradley not having agentic-product templates was meta-embarrassing.** The product templates everyone else's market — healthcare, creator, dev-tools, local-business, SaaS — but skipped the very category Hey Bradley itself competes in. P80 closes that. Reframe: every future template-expansion sprint should ask "are we templating our own category?" before "are we templating someone else's?"
- **Vertical positioning is more valuable than feature parity.** A generic "AI product landing" template would have been faster to ship but less useful. Four vertical-positioned templates (marketplace / coding-copilot / workflow-platform / support-copilot) each speak to a real persona and a real ROI story. The agentic-product market is too crowded for generic; vertical is the moat.
- **`exampleQueries` (P73 / ADR-098) becomes a moat compounding mechanic.** Every new template adds an `exampleQueries` row to the LLM-training surface. P80's 4 templates add ~16-20 queries. The Tier-2 HNSW activation gets cheaper with every template-expansion sprint.
- **The 3-agent dispatch shape (vs. P79's 4-agent) is fine.** Agent count flexes with sprint shape; OC-14 needed an audit pass (4 agents), OC-15 doesn't (3 agents). Keep the shape lean per sprint.

## Carry-forward

- **A2's polish recommendations** (per-template visual coherence findings — typography drift, palette tightening, image-density tuning) — input to next template-audit sprint
- **+9 stretch templates to reach 50+ (SOTA reference)** — carry-forward as "OC-4 round 4" or analogue
- **BYO per-template theme generation** (P82 candidate; per-template synthesis from scratch)
- **Multi-page expansion of agentic-product templates** (P82+ candidate; ADR-103 / ADR-104 wire is in place)
- **Animated hero / video embeds** (Tier-2 commercial)
- **Live-LLM matrix run against P80 templates** (OC-12 candidate; verifies vertical-positioning copy survives LLM-rewrite passes)
- **`exampleQueries` LLM-training corpus refresh** with P80 entries (Tier-2 HNSW activation prep)

## Velocity note

P80 closer (this triplet + ADR-105 + spec + CLAUDE.md edit) sized as ~30-45 minutes of A3 wall-clock at velocity. P80 as a 3-agent dispatch on a single working session is on-budget per the 3-phase-sprint ≈ 1 working day baseline (CLAUDE.md "Effort Estimation Rule"). The 3-agent dispatch shape is well within the 6-8 maxAgents recommendation — sustainable.

## Composite trajectory

P74 design+UX aggregate: 74.9/100 (Capstone 76 / Grandma 72 / Framer 71 / Lars 70). P77 + P78 lifted perf+a11y + multi-page sub-scores; P79 closed the latent page-naïve patch-routing bug. P80 closes Gap 6 (P2 / high-leverage) — agentic-product template gap that would have shown up the moment a real prosumer-AI-builder visitor landed in the picker and saw zero templates speaking to their use case.

Open P1 items after P80: page-aware INTENT (P82), DECOMP page-targeting (P82), mobile drawer page selector (P82). OC-CLEANUP at P82 remains the natural next live candidate — three deferred P1s converge on the same sprint, plus A2's polish recommendations from P80 fold in as input.
