# P107 / LOG-INTEGRITY-EXPANSION — Retrospective

> **Sprint:** LOG-INTEGRITY-EXPANSION · **Sealed:** 2026-05-03
> **Predecessor:** P106 sealed at `b6948db`

## What to keep

- **2-agent disjoint-scope parallel + 1 closer pattern.** A5 owned the 4 unwired event_type emits across `chatPipeline.ts` + `exportClaudeCode.ts` + `ExportClaudeCodeButton.tsx`; A6 owned the centralized error helper in `comprehensiveLogs.ts` + 4 catch-site wires. Zero file-level overlap (chatPipeline.ts was touched by both but in non-overlapping line ranges — A5 added emit sites at lines 332/450/469; A6 wired catch sites at lines 515/561/619/728). Closer A7 added ADR + tests + EOP triplet + CLAUDE.md sync without touching A5/A6 outputs.
- **Callback inversion-of-control for export_emit.** `exportClaudeCode.ts` stays pure (zero persistence imports per ADR-122 D1 + ADR-134); the integration layer (`ExportClaudeCodeButton.tsx`) owns the `writeLogEvent` call. Same pattern ADR-130 used for SealPanel `onSeal`. Proves the atom-purity discipline scales — observability hooks add to pure modules without breaking the contract.
- **`writeErrorEvent` as a one-liner replacement.** The helper closes a fragmentation gap (7 catch sites with 7 slightly-different message shapes pre-P107). Future catch sites copy one line: `writeErrorEvent(getDB(), { sessionId, requestId }, e, 'source.label')`. BYOK redaction is automatic; fire-and-forget is automatic; no per-site discipline required.
- **Test-coverage-first acceptance gates.** P107.7 + P107.8 + P107.9 are hard-tests counting tokens / matching regex on critical assertions (4 call sites; redactKeyShapes on message AND stack; zero persistence imports in exportClaudeCode). Soft-pass guards on file-shape tests prevent partial Wave-1 from bringing down the whole spec. Same pattern as P106 — keep using it.

## What to drop

- **Counting CHECK enum coverage as a moving baseline.** Pre-P107 the count was 10/15 = 66.7%. Post-P107 it's 15/15 = 100%. Any future event_type addition will require a P-arc that wires it AT LANDING, not declare-then-defer. The "declare a slot in migration N, wire it at P+M" pattern (P104 → P107) cost 3 phases of dead-enum embarrassment. Future migrations should land with their writers.
- **DEV-only `console.warn` as the default error pattern.** Pre-P107 it was the convention; 7 catch sites swallowed errors silently in production. Post-P107 the convention is `writeErrorEvent` for any catch where `db` is reachable. The 5 remaining `console.warn` sites carry a code comment naming the rationale (helper-locals / recursive-risk / redundant-root-cause); future audit can grep for the comment marker.

## What to reframe

- **Logging completeness is a testing gap, not a discipline gap.** Five event_types had zero writers because no test asserted they were wired. P107 added regex hard-tests in `tests/p107-log-integrity.spec.ts` (P107.2-P107.5 + P107.7) that count emission sites. This is the right-shape gate for any future declare-then-wire claim — if the test asserts a writer exists, the writer exists or the test goes red.
- **Atom-purity is a re-export pattern.** P106 / ADR-134 introduced neutral type modules (`processMapTypes.ts` + `types.ts`). P107 now adds the inversion-of-control complement: pure modules export callback **types** (not implementations); integration layers implement the callback. Future atom additions that want observability follow this pattern — emit a typed event via callback, let the boundary implement persistence.
- **5-of-5 vs 4-of-5 framing.** The preflight named "5 declared event_types" but A5 deferred `error_event` to A6 (correctly — error capture is a different concern from happy-path emits). The closer ADR-135 frames coverage as "4 functional emits + error_event covered separately by Decision 2 = 5 of 5". Honest framing in retrospective: A5 closed 4; A6 closed 1; together 5/5.

## Velocity note

P107 estimated 4-6 hours per the post-P106 priority-list table; actual elapsed was ~2 hours from preflight commit (`a49ad8a`) to seal. Consistent with the velocity-corrected estimate. Two-agent disjoint-scope dispatch held — zero merge conflicts, zero cross-agent rework. Closer pattern (ADR + tests + EOP + sync) is now reliably ~30-45 min at this codebase size.

## Quality discipline

- ADR-135 ≤ 120 LOC cap → ~95 LOC actual.
- 3-decision structure mirrors ADR-127 + ADR-128 + ADR-130 (small-ADR cadence at the seal-arc).
- Cross-refs span 6 ADRs: ADR-126 + ADR-127 + ADR-104 + ADR-122 + ADR-134 + ADR-043 (lineage from logging architecture → format verification → page-aware pipeline → atom purity → BYOK boundary).
- Both tsc strict configs clean after Wave 1 commit; closer adds zero source code.
- KISS denylist verified at P107.11: zero new deps.
- 19/19 P107 tests GREEN; 136/132 cumulative regression (≥132 target).
