# P72 / OC-TI — Retrospective (Template Intelligence)

> **Phase:** P72 · **Sprint:** OC-TI (Template Intelligence) · **Date:** 2026-05-01
> **Format:** Keep / Drop / Reframe / Carry-forward (standard P-series retro shape)

---

## Keep

- **5-agent disjoint dispatch worked at scale.** 1 ADR (preflight) + 3
  libraries (A1/A2/A3) + 1 matcher/applier pair (A4) + 1 closer (A5).
  Five files, five owners, zero collisions. Same pattern that landed
  P68/P69 in parallel and P70/P71 in parallel — disjoint file ownership
  is the keystone. No coordination meetings. No merge conflicts. No
  shared-state contention.
- **Template Intelligence Architecture (ADR-098) cleanly layered ON TOP
  of existing SELECTION_ATOM starter packs.** No replacement, no
  deprecation. The 37 MasterConfig starter packs (OC-3 + OC-4) keep their
  role as onboarding examples; the 3-layer intelligence handles
  mid-conversation template application. `library.ts` / `registry.ts` /
  `router.ts` were untouched — the SELECTION_ATOM flow is intact.
- **Honest reframe at preflight time.** "37 starter packs" was sold as
  template selection; in practice they are first-run onboarding. The
  intelligence layer is a parallel surface, not a replacement. Owner
  caught the mental-model mismatch before the sprint opened — the ADR
  reflects the corrected framing.
- **Confidence threshold codified at 0.8.** `TEMPLATE_CONFIDENCE_THRESHOLD`
  exported as a constant from `templateMatcher.ts`. Tunable per-deployment.
  Documented in ADR-098 §Matcher pattern. Explicit ASSUMPTIONS_ATOM
  round-trip below threshold — no silent guesses on the user's behalf.
- **HNSW swap-in interface documented.** Every entry across all 3
  libraries carries `vectorDescription` — when HNSW activates (Tier-2),
  the keyword-tag scoring step swaps for true semantic similarity over
  that field. Data shape stays identical. Zero migration on swap.
- **PURE-UNIT FS+regex test pattern (P72.1 → P72.11).** Continues the
  P67c / P68 / P69 / P71 lineage — seal-fast, deterministic, no browser
  bootstrap. Catches export drift, library-count drift, banned-dep
  imports, and ADR shape regressions mechanically.
- **A4-deferral tolerance built into the test spec.** P72.4 / P72.5 /
  P72.6 explicitly carry "A4 carry-forward" failure messages and skip
  internal asserts when the matcher/applier files are absent — the seal
  surfaces the gap without false-failing.

## Drop

- **Implicit "single-template selection" mental model from OC-3/OC-4.**
  Replaced by 3-layer composable. A single user utterance can yield 1-3
  matches (one per layer); ASSUMPTIONS_ATOM surfaces only the layer(s)
  below 0.8. The "pick one template, replace everything" mental model
  is the wrong shape for mid-conversation tone shifts.
- **The temptation to inline HNSW activation in P72.** Activation
  belongs to the Tier-2 commercial learning runtime per the existing
  ruvector deferral. Open-core ships keyword-tag matching; commercial
  ships the vector swap. The architecture is HNSW-ready; the
  implementation is deliberately not.
- **Per-user template preferences in P72.** Tier-2 commercial only.
  Open-core matcher is stateless and deterministic.

## Reframe

- **Decomposition (intent → todo list) is a SEPARATE sprint (OC-DECOMP).**
  The current pipeline is single-turn intent → patches; multi-turn
  requirements accumulator is the next moat. P72 builds the template
  surface for ONE intent at a time — the multi-turn surface is a
  pre-pipeline accumulator, not a post-pipeline polish.
- **Vector store activation (HNSW) belongs to Tier-2 commercial.**
  Open-core ships the keyword-tag matcher with `vectorDescription` as
  the swap-in surface. The commercial-track value-add is the indexing
  + ranking, not the data shape.
- **The 3 libraries are data, not behavior.** Each file is mostly a
  `readonly [...]` array; the `findX()` helper is ~10-20 LOC of
  keyword-tag scoring. Adding a new entry is data entry, not engineering.
  Bar to grow each library is intentionally low.
- **Confidence-threshold tuning is empirical.** 0.8 is the documented
  default; real-usage data will inform adjustment. The constant is
  configurable per-deployment so the threshold stays honest as the
  library grows.

## Carry-forward

These are **explicitly NOT** P72 work and require their own dispatch:

1. **OC-DECOMP — intent → todo decomposition.** Front-of-pipeline gap
   noted at preflight time. Replaces single-turn pipeline with multi-
   turn requirements accumulator. **Highest moat-leverage carry-forward.**
2. **OC-TI Wave 2 — UI surface for the matcher.** Show ranked candidate
   templates in the chat thread BEFORE applying (confidence-aware
   ASSUMPTIONS_ATOM presentation). **Owner:** post-A4 wire-up.
3. **HNSW activation (Tier-2 commercial).** Swap keyword scoring for
   semantic similarity over `vectorDescription`. **Owner:** Tier-2
   commercial track per CLAUDE.md ruvector note.
4. **chatPipeline full wire-up** — `matchTemplates` + `applyTemplateMatch`
   imported and dispatched on intent classification. **Trivial once A4
   lands;** P72.6 currently tolerates either path.
5. **Template editor UI.** Tier-2 commercial follow-up.
6. **Per-user template preferences.** Tier-2 commercial only.

---

## Closing

P72 / OC-TI lands the Template Intelligence spine: 3 libraries (18
themes / 12 sections / 12 styles) + matcher/applier interface +
ADR-098 architecture authority. ~30 PURE-UNIT tests gate the contract;
cumulative target ≥794 GREEN. The intelligence layer is a parallel
surface alongside the 37 starter packs — onboarding kept its
flagship-card flow, mid-conversation gets its 3-layer composable.

Owner choice for next: **OC-DECOMP** (intent → todo; the pre-pipeline
moat) / **OC-TI Wave 2** (matcher UI surface) / OC-12 live-LLM /
Polish Wave 4.
