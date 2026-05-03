# P102 — Retrospective (EOP triplet 3/3; A4 owns)

**Date:** 2026-05-03 · **Phase:** P102 / OC-POLISH-W5
**Outcome:** SEALED · v2.0.0-RC1 ready · 0/3 floor breaches · 4/4 brutal-review PASS

## Keep

1. **Disjoint-scope agent dispatch with self-projected persona scores.**
   A1+A2+A3 each produced a self-projection delta (+2/+2/+1) that A4
   verified against own brutal-review evidence. The discipline of
   "agent says how much they think they lifted, closer verifies" caught
   the temptation to inflate. Lars +3 evidenced; Grandma+Framer +2
   each evidenced. No paper-over.
2. **Chrome-vs-data distinction codified in ADR-132 §1.** Onboarding.tsx
   91→9 hex would have looked like incomplete migration; instead, the
   9 holdouts are documented as architectural-correct theme-palette
   JSON data. Future contributors get a rule, not a target to chase.
3. **Fire-and-forget pattern reuse for Agentics live-wire.** ADR-126 D4
   (write-side never throws upward) extends cleanly to read-side. Same
   try/catch shape; same `console.warn` discipline; same fallback
   semantics. Pattern is now the canonical mode-mount observability
   template for P103+ surfaces.
4. **EOP placement at `seal/` subfolder.** Mirrors P95–P101 pattern.
   Avoids filename collision with planning-sprint design docs at
   `phase-N/00..04`. Clean separation of pre-seal planning from post-seal
   archive.
5. **LOC caps with margin reporting.** Every file in this seal carries
   "X / Y cap (margin Z)". Forces conscious budget management; surfaces
   when a doc is bumping cap (ADR-132 at 120/120 — exactly at).

## Drop

1. **Optimistic ceiling projection.** R1 §6 of P101 brutal-review projected
   91/100 if CF#7+CF#8+CF#9 all closed. CF#9 deferred at P102 per KISS
   budget. The 91 ceiling now lives in CF#9 follow-up. Lesson: name the
   floor-clearing target (85/85/88), not the optimistic ceiling.
2. **Cumulative test count anchor as single number.** "~1300+ pure-unit
   GREEN" hides what changed. P102 added ~25 tests (8 describe blocks);
   that's the meaningful number for this seal. Future phases should
   report delta + cumulative, not just cumulative.

## Reframe

1. **Persona scoring is not feature-completeness.** Grandma 86 means
   "Grandma can use this without confusion at the marketing surface" —
   not "Grandma score = product quality". The +2 from token migration
   is real but indirect (felt via cross-mode consistency, not headline
   readability). ADR-131 § 2 was right to call P101 84/84/85 PARTIAL;
   ADR-132 is right to call 86/86/88 PASSED but capped below ceiling.
2. **CF deferral as discipline, not failure.** CF#9 + CF#10 deferring to
   P103+ is the KISS budget working. The temptation was to ship CF#9
   for the +3 Framer lift; resisting that temptation kept Wave 1 commit
   small (13 files / 710 / 330) and reviewable. Future phases should
   default to "carry-forward beats over-scope" when LOC budget exceeded.
3. **v2.0.0-RC1 is a release candidate, not a release.** Owner-required
   CF#4 (live LLM smoke) + CF#5 (STT calibration) gate the v2.0.0 final
   tag. P102 closes the surface; runtime activation is owner work. The
   release artifacts B3 ships (CHANGELOG / release notes / launch posts)
   are RC-stage; final-tag artifacts ship after CF#4 + CF#5 close.

## Carry-forward to P103+

| ID | Item | Driver | Owner |
|----|------|--------|-------|
| CF#9 | SVG legend strips (ProcessMap + DomainModel) | KISS budget | P103 |
| CF#10 | `useChatPipeline` hook extraction | LOW KISS-fit | P103+ if pipeline pushed |
| CF#4 | Live LLM verifications | BYOK runtime | Owner post-RC |
| CF#5 | Real STT calibration | Web Speech runtime | Owner post-RC |
| CF#6 | Build-time EOP pre-bake | Vite plugin scope | Tier-2 |

## Gate verdict

**P102 SEALED.** v2.0.0-RC1 ready for B3 final consolidated sync.
Persona acceptance gate met (ADR-132 §3): composite 86.7 ≥ 85, 0/3
floor breaches. SOTA composite ≥84/100 vs Lovable 80/100 defended by
file:line evidence in `04-brutal-review.md`.
