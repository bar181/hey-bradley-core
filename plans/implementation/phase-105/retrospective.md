# P105 / RC-BLOCKERS-CLOSURE — Retrospective

> **Phase:** P105 · **Sealed:** 2026-05-04
> Format: Keep / Drop / Reframe (per CLAUDE.md "Standard Phase Process" §2)

## Keep

- **Brutal-honest audit → fix-pass mapping.** The 5-chunk audit at `plans/strategic-reviews/2026-05-04-gaps-to-done/` directly seeded P105 priorities. Top-4 P1 items were trivially scopeable into 4 disjoint-file agents because the audit had already named owners + LOC budgets. This is the playbook for P106-P109.
- **Disjoint-file agent dispatch.** A1/A2/A3/A4 touched 6 files with zero overlap → no merge conflicts at Wave 1 commit. Mirror this for P106 dead-code purge (3-4 distinct surfaces).
- **Soft-pass `existsSync` guards in Playwright specs.** The P104 + P105 pattern (skip-on-missing for source files; hard-gate on EOP triplet) keeps the seal gate from going red when seal artifacts land before fix-pass surfaces refactor. Repeats P95-P104 discipline.
- **Carry-forward closure honesty.** When a prior closure (P104 `validateSectionType`) was discovered to have 0 production callers, P105 did NOT re-claim closure with hand-waving — A4 actually wired it into `examples/index.ts` and the test asserts ≥1 call site. This is the discipline that makes the cumulative-regression count trustworthy.

## Drop

- **Optimistic closure language.** P104 said `validateSectionType` was "CLOSED" when it was a no-op import-only export. Future fix-pass sprints must verify ≥1 production import site (greppable) before claiming closure. This rule is now codified in the P105 spec (P105.5 hard-gate test on import + call-site count).
- **Multi-call-site claims without grep verification.** ADR-127 declared `cleanTranscript` "wired" when it was wired to logs only. Going forward, "wired" means: (1) called at submit-entry, (2) result threaded through ≥3 downstream consumers, (3) test asserts the consumer count.

## Reframe

- **"RC blocker" is a hard category, not a vibe.** A blocker = user-visible breakage on click-through OR a closure-claim regression. P106-P109 all fall into the second category (ADR ledger drift / dead code / missing test runtime / unwired event types) — they're "honest gap" not "RC blocker." This sharpens the gate for v2.0.0-RC1 sealing: P105 was the last RC-blocker sprint; P106-P109 are RC-polish.
- **Fix-pass sprints don't need new ADRs.** P102, P104, P105 all sealed without new ADRs. The pattern is: existing ADR named the contract; fix-pass restored the contract. New ADRs are for NEW architectural decisions, not for re-asserting existing ones. This keeps the ADR ledger signal-rich.
- **Cumulative regression count as truth meter.** ~1350+ at P105 anchor (was ~1335+ at P104). The +15 isn't volume for volume's sake — every P105 case asserts a specific surface that closes a specific carry-forward. Number goes up only when truth-claims go up.

## Handoff to P106

- **Priority queue:** DEAD-CODE-PURGE + ATOM-VIEW-FIX (~310 LOC; 8 items)
- **Audit basis:** `plans/strategic-reviews/2026-05-04-gaps-to-done/` chunks 2-3 (architecture + features)
- **Cheapest first:** twoStepPipeline 245-LOC orphan delete (single file unlink); atom→view inversion (4-file import-graph fix)
- **No new ADR expected** (fix-pass discipline holds; mirrors P102/P104/P105)
- **Greenlight gate:** P105 cumulative ≥96 GREEN (98 actual); both tsc strict clean
