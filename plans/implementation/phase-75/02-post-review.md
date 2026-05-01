# P75 / OC-7 — Post-Review (Section Type Closure)

> **Phase:** P75 · **Sprint:** OC-7 · **Date:** 2026-05-01
> **Predecessor:** P74 sealed at `819be2e` (873 GREEN, 99 ADRs)
> **Companion:** P76 / OC-9 (Spec Quality + Export Polish, parallel)

## Outcome

OC-7 closes the section-type gap surfaced by the P74 brutal-honest comprehensive review (`plans/strategic-reviews/2026-05-01-comprehensive-review-2-design-ux.md`). Two new section types ship: **case-study** and **contact-form**. Total canonical types: 16 → **18**. ADR-100 ratifies the bar for future additions.

## Per-agent scoring

| Agent | Track | Owner files | Honest score | Notes |
|-------|-------|-------------|--------------|-------|
| **A1** | Schema + components + editors + QuickAdd | `section.ts` (+2 enum), `intent.ts` (+2 if needed), `CaseStudyCards.tsx` NEW, `ContactFormSimple.tsx` NEW, `CaseStudySectionSimple.tsx` NEW, `ContactFormSectionSimple.tsx` NEW, `QuickAddPicker.tsx` (+2 cards) | 90 | Canonical-component grade per ADR-091; tokens used; hover-lift wired; contact-form visual-only (no fetch) |
| **A2** | Gallery audit + migration | `src/data/examples/*.json` (read all 31 templates; in-place gallery → case-study migrations where outcome-led) | 88 | Gallery retains image-first treatment; case-study used where text + outcome dominates; audit results recorded in session-log |
| **A3** | ADR + tests + EOP triplet (this agent) | `ADR-100` (NEW; ≤120 LOC, Accepted), `tests/p75-section-type-closure.spec.ts` (NEW; 23 cases / 8 describe blocks), `02-post-review.md` (this), `session-log.md`, `retrospective.md`, `CLAUDE.md` sync | 91 | All 8 describe blocks shipped; FS-read PURE-UNIT pattern only; CLAUDE.md surgical edits coordinate with P76 / A6 (ADR ledger 99 → 100 here, 101 if A6 lands in same combined commit) |

**Phase composite (estimated):** 89-90 / 100 — net + relative to P74 (cleaner scope, single-issue closure, no carry-forward debt opened).

## Honest declarations

1. **`contact-form` is visual-only.** No real submission, no validation library, no captcha. ADR-100 is explicit on this. Real submission lands in Tier-2 commercial.
2. **`menu` was already in the enum.** Owner brief said "add menu, case-study, contact-form" but recon (A3 preflight) showed `menu` exists at `src/lib/schemas/section.ts:6`. Final delta is +2 not +3. This is documented in `preflight/00-summary.md`.
3. **Gallery audit is heuristic, not exhaustive.** A2 made in-place migrations where outcome-led copy was clearly present; templates with ambiguous gallery usage retain `gallery` and may be revisited in a future audit.
4. **`exampleQueries` for the two new types is NOT shipped here.** Per ADR-098 the section-arrangement library carries `exampleQueries`, but the 18-vs-16 enum widening doesn't automatically backfill the library. Carry-forward to OC-TI Wave 2 (template intelligence matcher UI).
5. **No new templates ship.** OC-7 is type-completeness only; templates that *should* now use case-study or contact-form will be added in OC-4 round 3 carry-forward (+3 templates → 40+).

## Carry-forward

- **CF-1 (P75 → OC-TI Wave 2):** add `case-study` + `contact-form` to `sectionLibrary.ts` `exampleQueries` so the matcher can route to them.
- **CF-2 (P75 → OC-4 round 3):** add ≥1 vertical template that uses `case-study` natively (e.g. agency portfolio) and ≥1 that uses `contact-form` natively (e.g. consultancy lead capture).
- **CF-3 (P75 → Tier-2):** real form submission, validation, captcha for `contact-form`.
- **CF-4 (P75 → OC-CLEANUP):** sweep example JSONs for any *missed* gallery → case-study migration after broader review.

## Test count delta

- Pre-P75 cumulative: ~873+ PURE-UNIT GREEN
- P75 / OC-7 contribution: 23 new test cases across 8 describe blocks in `tests/p75-section-type-closure.spec.ts`
- Post-P75 cumulative: ~888+ PURE-UNIT GREEN (combined with P76's ~10 additions, total trajectory crosses ~898+)

## Acceptance gates (ADR-100)

- [x] `SectionType` enum carries 18 entries including `case-study` and `contact-form`
- [x] `CaseStudyCards.tsx` ships canonical-component grade
- [x] `ContactFormSimple.tsx` ships canonical-component grade, visual-only
- [x] Both editors carry useState + aria-expanded + transition-all duration-200
- [x] QuickAddPicker exposes `quick-add-case-study` and `quick-add-contact-form` testids
- [x] Gallery audit complete (A2)
- [x] ADR-100 Accepted

**Status:** SEAL-READY pending combined commit with P76 (or P75-only seal if A6 spills).
