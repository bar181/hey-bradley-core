# E2E-TEST-2 — Retrospective

**Date:** 2026-05-03
**Phase:** E2E-TEST-2 (multi-scenario pipeline validation)

---

## Keep

- **Closer-owned defensive normalization at write time.** The `patch_applied → patch_validation` remap in `seed-e2e2-logevents.ts` shipped before any CHECK violation could surface in a real DB. This pattern (defensive remap at the seed layer + post-remap validation in the test spec) is the right shape for any future fixture sprint.
- **Trigger-word doc as a first-class output of E2E sprints.** Building 3 sites surfaced 4 implicit pipeline behaviors that lived only in source. Codifying them at `docs/aisp-adoption/03-trigger-word-taxonomy.md` means external bundle consumers can reproduce routing without grepping. Make this the convention going forward — every E2E sprint emits a taxonomy delta.
- **EOP triplet at `seal/` subfolder.** Mirrors P95-P103 pattern; avoids filename collision with phase-folder build logs. Unambiguous.
- **Pure-unit test discipline.** All 18 E2E2 cases run as Playwright `test()` shapes but never bootstrap a browser — pure FS reads + JSON.parse + regex asserts. Fast, hermetic, reliable.

---

## Drop

- **Implicit assumption that Wave 1 fixtures conform to the CHECK enum.** C3 emitted 8 rows with `patch_applied` because the agent reasoned from source variable names rather than from migration 005. Lesson: every Wave 1 spec must explicitly cite the CHECK-enum line numbers from the schema migration.
- **Over-broad section-type vocabulary in Wave 1 design docs.** C1's build log used "article" and "pull-quote" as section types; C2 used "testimonial". These are component types or section variants, not section enum types. Future site-build briefs should pre-resolve aliases to canonical enum values (now codified in §1 of trigger-word doc).

---

## Reframe

- **E2E sprints are documentation surfaces, not just validation surfaces.** The 3 sites built in Wave 1 are simulator-only — they don't exercise live LLM or live STT. Their value is **2x**: (1) they validate the pipeline shapes (chat / listen / DECOMP) by walking real source code paths; (2) they generate fixture data that codifies trigger-word vocabulary for downstream consumers. The closer's job is to harvest finding (2) into a public surface (taxonomy doc).
- **Schema-enum surprises are user-facing UX issues, not just internal hygiene.** When an external contributor writes a fixture with `patch_applied`, the seed script remaps but the underlying problem — the typo would silently fail at the DB layer with a CHECK violation that comprehensiveLogs.ts catches and warns rather than throws — is invisible. **Carry-forward suggestion:** add a `validateEventType(s: string)` exported helper in `comprehensiveLogs.ts` that runtime-checks against the CHECK enum and call it from the seed script + future fixture writers.
- **Velocity check: this sprint cleared in <1 working hour at velocity.** Wave 1 (3 sites) + closer (this run) is well within multi-hour shift discipline per CLAUDE.md §Effort Estimation Rule. No quality discipline was compressed (taxonomy doc, EOP triplet, brutal-honest gap section all shipped).
- **No ADR for E2E sprints.** Validation sprints don't add architectural decisions — ADR-126 already covers persistence, ADR-100 covers section enum, ADR-127 covers atom helpers. E2E sprints surface gaps that may motivate future ADRs (e.g. a future "Schema Validation Helpers" ADR if the carry-forward `validateEventType()` lands).
