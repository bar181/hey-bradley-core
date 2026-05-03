# ADR-135 — Log Integrity Expansion (event_type Wires + writeErrorEvent Helper)

- **Status:** Accepted
- **Date:** 2026-05-03
- **Phase:** P107 / LOG-INTEGRITY-EXPANSION
- **Cross-refs (primary):** ADR-126 (Comprehensive LLM Interaction Logging — declared the 15-event_type CHECK enum + fire-and-forget contract D4), ADR-127 (Format Verification — surfaced the dead enum slots audit), ADR-104 (Page-Aware Chat Pipeline — defines `multi_page_scope` semantics)
- **Cross-refs (secondary):** ADR-122 D1 (Export Claude Code pure module — preserves atom-pure contract), ADR-134 (Atom→view inversion fix — same purity discipline applied to observability), ADR-043 (BYOK trust boundary — redaction at every write)

## Context

The brutal-honest gap audit at `plans/strategic-reviews/2026-05-04-gaps-to-done/` (Tracks A + C) surfaced two persistence/observability P1 items that did NOT block v2.0.0-RC1 release but that violated the stated coverage discipline:

1. **A7 + C1 — 5 declared event_types had zero production writers** (`multi_page_scope`, `error_event`, `todo_execution`, `decomp_split`, `export_emit`). The CHECK enum at migration 005 declared 15 values; only 10 had emit sites. Coverage 10/15 = 66.7% — dead enum slots are a lie-by-omission per ADR-126.
2. **C5 — No centralized error capture.** Seven `console.warn` DEV-only sites in `chatPipeline.ts` swallowed errors silently in production builds. Owner could not debug from a user's exported DB; the `error_event` enum slot was declared but never written.

P104 / SCHEMA-GUARDS extended the CHECK enum with `decomp_split` + `export_emit` (declaring intent). P107 wires the writers + adds the centralized error capture helper to deliver on the declaration.

## Decisions

### Decision 1 — 4 of 5 unwired event_types now have production writers

The CHECK enum slots declared at migration 005 + extended at P104 are now backed by emit sites:

| event_type | Emit site | Trigger condition |
|------------|-----------|-------------------|
| `multi_page_scope` | `chatPipeline.ts:332` | `pageIterator.getActivePage` resolves a non-default scope (per ADR-104) |
| `decomp_split` | `chatPipeline.ts:450` | DECOMP_ATOM produces ≥2 todos at submit-entry |
| `todo_execution` | `chatPipeline.ts:469` | Per-todo trace inside the executor loop |
| `export_emit` | `ExportClaudeCodeButton.tsx:44` (callback path) | Every `buildClaudeCodeBundle()` invocation |
| `error_event` | 4 chatPipeline.ts catch sites (Decision 2) | Any caught exception in DECOMP / template intelligence / template apply / runLLMPipeline |

Coverage post-P107: **5 of 5 originally-unwired event_types CLOSED** (4 functional emits + error_event covered by Decision 2). Total CHECK enum coverage: 15/15 = 100%. Verifier: `grep -rnE "event_type:\s*'(decomp_split|multi_page_scope|export_emit|todo_execution|error_event)'" src/` shows ≥1 production hit per slot.

### Decision 2 — Centralized `writeErrorEvent` helper replaces scattered console.warn

`src/contexts/persistence/repositories/comprehensiveLogs.ts` exports a NEW `writeErrorEvent(db, ctx, err, source)` helper (+39 LOC). Four `chatPipeline.ts` catch sites previously emitting DEV-only `console.warn` are wired to the helper (lines 515, 561, 619, 728). The helper:

- Calls `redactKeyShapes` on **both** `message` AND `stack` (BYOK trust boundary per ADR-043 + ADR-114 D3 — defence-in-depth at every error_event write).
- Wraps the underlying `writeLogEvent` call in its own try/catch so the error_event itself cannot escape and crash the pipeline (fire-and-forget per ADR-126 D4).
- Truncates stack traces to 500 chars to bound row size.

Five remaining `console.warn` sites kept dev-only with documented rationale (helper-locals where `db` is unavailable; recursive-risk inside the helper itself; redundant root-cause sites where the parent catch already logs).

### Decision 3 — `export_emit` callback pattern preserves atom-pure contract

`exportClaudeCode.ts` is a pure module per ADR-122 D1 + the atom-purity discipline reinforced by ADR-134 (no imports from `src/components/`, no persistence imports). To emit `export_emit` log_events without breaking that contract:

- `exportClaudeCode.ts` exports `ExportEmitEvent` interface + `ExportEmitCallback` type.
- `buildClaudeCodeBundle(phase, projectSlug?, onEmit?)` accepts an **optional** callback fired exactly once after the bundle is composed (slug + filename + fileCount + markdownLength).
- The integration layer (`ExportClaudeCodeButton.tsx`) implements the callback with its own `writeLogEvent` call wrapped in try/catch (fire-and-forget; missing/uninitialized DB is silently swallowed).

Result: pure module stays free of persistence imports; observability lands at the integration boundary where DB access is acceptable. Same inversion-of-control pattern ADR-130 used for SealPanel `onSeal`.

## Acceptance Gates

1. ADR-135 exists at `docs/adr/ADR-135-log-integrity-expansion.md`; ≤120 LOC; Status: Accepted.
2. `chatPipeline.ts` contains emit sites for `multi_page_scope` + `decomp_split` + `todo_execution` (≥1 each).
3. `ExportClaudeCodeButton.tsx` contains an `export_emit` emit site (callback path).
4. `comprehensiveLogs.ts` exports `writeErrorEvent`; helper calls `redactKeyShapes` on `message` AND `stack`.
5. `chatPipeline.ts` has ≥4 `writeErrorEvent(` call sites.
6. `exportClaudeCode.ts` exports `ExportEmitCallback` type (preserves atom-pure contract).
7. P107 EOP triplet at `plans/implementation/phase-107/seal/{02-post-review,session-log,retrospective}.md`.
8. CLAUDE.md sync: P107 entry; ADR-135 ledger entry.
9. Cumulative regression GREEN: P101 (25) + P102 (22) + P-E2E-2 (22) + P104 (12) + P105 (17) + P106 (19) + P107 (≥15) ≥ 132.

## Consequences

**Positive:** The dead enum slots are now backed by emitters — `error_event` rows now appear in production builds; an owner debugging from a user's exported DB sees actual root-cause stack traces instead of vacant dev-only logs. The centralized helper closes a fragmentation gap (7 catch sites with 7 slightly-different message shapes); future catch sites copy one line. The export-emit callback pattern proves the atom-purity discipline scales — observability hooks add to pure modules via inversion of control without breaking the contract.

**Negative:** The optional callback parameter widens `buildClaudeCodeBundle`'s signature (3 args instead of 2). Any third-party consumer that destructured the function's argument list at compile time would need a one-line update; none known. Slight increase in production log volume on multi-page sites (one `multi_page_scope` row per submit) — acceptable per ADR-126 retention policy (30/90 day prune).

**Mitigations:** The `onEmit` parameter is optional — existing callers (test harnesses, internal calls) ignore it without source change. Stack-trace truncation at 500 chars caps the row-size increase per error. Five `console.warn`-only catch sites kept dev-only with rationale in code comments; future audit can grep for the comment marker to find them.
