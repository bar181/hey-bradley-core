# P75 / OC-7 — Retrospective

> **Phase:** P75 · **Sprint:** OC-7 (Section Type Closure)
> **Date:** 2026-05-01

## Keep

- **3-agent dispatch is the right grain for type-closure.** A1 owns source, A2 owns data audit, A3 owns ADR+tests+EOP. Clean role boundaries, zero file-collision risk.
- **PURE-UNIT FS-read test pattern.** Reading source files from disk and asserting text invariants kept the P75 spec stable while A1's component LOC was still moving. No mock-resolution flakes; no module-graph instability.
- **Recon before writing.** A3 caught that `menu` was already in the enum during preflight; brief said +3 types but truth is +2. Saved a wasted sub-agent run and avoided publishing a wrong-count CLAUDE.md.
- **ADR with explicit Tier-2 boundary.** ADR-100 is explicit that `contact-form` is visual-only — sets honest user expectation now rather than at marketing-page time.
- **`existsSync` guards in the test spec.** Missing files surface as clean assertion failures, not module-resolution crashes. Critical for an in-flight 3-agent dispatch.

## Drop

- **The implicit "more types is better" instinct.** OC-7 was nearly scoped to add 5+ types. ADR-100's bar (≥3 verticals, can't-be-a-variant, canonical-grade) is the brake. Future OC-7+ proposals must clear the gates before any code is written.
- **Coupling section-type adds to template adds.** OC-7 is type-completeness only. Templates that *should* use the new types are deferred to OC-4 round 3 carry-forward. Mixing the two would have doubled scope and slowed the dispatch.
- **Auto-injecting `exampleQueries` for new types.** Section-arrangement library backfill (ADR-098) was a tempting tack-on but belongs in OC-TI Wave 2 — keeping P75 narrow.

## Reframe

- "Section types" is really **two distinct surfaces**: the schema enum (configuration bounded context) and the component+editor+QuickAdd surface (ui-shell bounded context). ADR-100 makes this explicit so future widening proposals can be scoped per-surface.
- **"Visual-only" is a feature, not a limitation.** Open-core ships the design surface; commercial ships the runtime. Marketing copy on `/contact-form` capability should say "design your form here, ship submissions in commercial" — turns the limit into a signal.
- **Gallery audit is a recurring, not one-off, sprint task.** Every time we add a new content-shape type (case-study now; testimonial-grid maybe later) we'll need to sweep the example JSONs. Reframe: the audit is a sprint-level cleanup pattern, not a P75-specific exception.

## Carry-forward

- **CF-1:** add `case-study` + `contact-form` exampleQueries to `sectionLibrary.ts` (OC-TI Wave 2)
- **CF-2:** add ≥1 vertical template using `case-study` natively + ≥1 using `contact-form` natively (OC-4 round 3 → 40+)
- **CF-3:** real form submission + validation for `contact-form` (Tier-2 commercial)
- **CF-4:** broader gallery → case-study sweep on the next OC-CLEANUP sprint
- **CF-5:** matcher UI surface (ranked candidates for new types) — already in OC-TI Wave 2 backlog from P74

## Velocity note

P75 / OC-7 dispatched cleanly in a single round (no recursive review pass needed at A3 close). 3 agents, 3 deliverable bundles, 23 new tests, +1 ADR, +2 section types. Within the multi-hour shift budget per the post-P19 reality-check rule.
