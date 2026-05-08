# P63 / OC-2 — Retrospective

**Date sealed:** 2026-04-30 · 425/425 cumulative GREEN

## Keep

- **Background-agent dispatch with orchestrator backfill.** OC-2 was launched with `run_in_background: true`. While it ran, the orchestrator drafted OC-3 preflight in non-overlapping space. When the agent partially returned (only 2/5 deliverables initially visible to git), the orchestrator backfilled the test spec directly. The agent then completed asynchronously and the bundle converged. Net wall: ~10 min for the full cycle.
- **Pre-OC1 architectural commitments.** ADR-088 + ADR-089 land BEFORE OC-1..OC-11 ship, preserving the design space for AW work without blocking OC progress. This is exactly the sequencing `phase-61b/03-pre-oc1-decisions.md` called for.
- **Hard rules in the agent prompt.** Six explicit "do NOT" rules (no Onboarding.tsx integration, no live routes, no live waitlist, no migration applied, no other uiStore fields, no shell commands) kept scope tight. Agent over-delivered on test cases (20 vs 6+ minimum) but stayed within scope.
- **Owner-supplied verbatim copy.** The 3-card text was provided in the message body; agent reproduced it byte-for-byte. No copy drift, no LLM-paraphrasing risk.
- **Strategic-vision pointer doc.** `plans/strategic-reviews/2026-04-30-three-mode-vision.md` makes the platform framing discoverable without duplicating phase-61b content; cross-linked from this and future preflights.

## Drop

- **Assumption that one agent dispatch = one atomic landing.** The agent completed deliverables in a non-deterministic order; at one git-status check, only 2/5 files were visible. This is normal for a background agent but threw off the orchestrator's expectations. **Future pattern: don't check intermediate state; wait for completion notification OR backfill what's clearly missing.**
- **Manual test-spec backfill.** When the orchestrator wrote the test spec mid-run, the agent's later output overwrote it with a more comprehensive version (20 cases vs my 6). Both versions worked, but the wasted effort was avoidable. **Trust the agent to finish before backfilling.**

## Reframe

- **OC-2 is the platform-architecture sprint, not a UI sprint.** The visible output (a React component) is small; the architecture commitments (ADR-088 mode discriminator, ADR-089 schema design) are what unblocks AW-1..AW-10. The component is the artifact that makes the architecture testable.
- **Component shipped standalone, integration deferred.** This is the right pattern when the design isn't owner-locked yet. Ships a tested, type-safe primitive; integration into `Onboarding.tsx` is a 30-minute follow-up after owner UX review (NOT another sprint).

## Carry-forward

| Item | Where it lives next |
|---|---|
| `Onboarding.tsx` integration of `ModeSelectorCard` | Owner UX review → 30-min follow-up commit (not a separate sprint) |
| Migration 005 file scaffold (NOT applied) | AW-1 sprint open |
| Live `/planning` and `/agentics` routes | AW-5 / AW-10 |
| Real waitlist / email capture for "Coming soon" cards | Tier-2 commercial |

## Cumulative state at OC-2 seal

- Tests: **425/425 PURE-UNIT GREEN** (was 405 at OC-1)
- ADRs: **88 Accepted** (was 86 at OC-1; +ADR-088 +ADR-089)
- Ruvector: 106 → 107 entries (+1 for P63)
- Phase folder: preflight + session-log + retrospective + 5 deliverables
