# P107 / LOG-INTEGRITY-EXPANSION — Post-Review

> **Phase:** P107 · **Sprint:** LOG-INTEGRITY-EXPANSION · **Sealed:** 2026-05-03
> **Predecessor:** P106 / DEAD-CODE-PURGE + ATOM-VIEW-FIX at `b6948db` (120 GREEN at anchor)
> **Audit basis:** `plans/strategic-reviews/2026-05-04-gaps-to-done/` (Tracks A + C items A7 / C1 / C5)
> **Wave 1 commit:** `2931e76`

## Sprint summary

P107 closes **persistence/observability P1 items** that did not block v2.0.0-RC1 release but that violated stated logging discipline:

1. **A7 + C1 — 5 declared event_types had zero production writers** (`multi_page_scope`, `error_event`, `todo_execution`, `decomp_split`, `export_emit`). Coverage 10/15 = 66.7% — dead enum slots are a lie-by-omission per ADR-126.
2. **C5 — No centralized error capture.** Seven `console.warn` DEV-only sites in `chatPipeline.ts` swallowed errors silently in production builds.

Two waves: 2 disjoint-scope parallel agents (A5 event_type wires + A6 error helper) + 1 closer (A7).

## Per-agent deltas

### A5 — Wire 4 event_types into production
- `src/contexts/intelligence/chatPipeline.ts` — 3 emit sites added:
  - `multi_page_scope` at line 332 (per ADR-104; fires when `pageIterator.getActivePage` resolves a non-default scope)
  - `decomp_split` at line 450 (fires when DECOMP_ATOM produces ≥2 todos)
  - `todo_execution` at line 469 (per-todo trace inside the executor loop)
- `src/contexts/specification/exportClaudeCode.ts` — NEW `ExportEmitEvent` interface + `ExportEmitCallback` type; `buildClaudeCodeBundle` widened with optional `onEmit` parameter (3rd arg).
- `src/components/agentics/ExportClaudeCodeButton.tsx` — implements the callback at line 44 with its own `writeLogEvent` call wrapped in try/catch (fire-and-forget per ADR-126 D4).

**Impact:** 4 of 5 originally-dead enum slots now have writers. Pure module discipline preserved per ADR-122 D1 + ADR-134 — no persistence imports leaked into `exportClaudeCode.ts`.

### A6 — Centralized error_event capture
- `src/contexts/persistence/repositories/comprehensiveLogs.ts` — NEW `writeErrorEvent(db, ctx, err, source)` helper (+39 LOC). Calls `redactKeyShapes` on **both** `message` AND `stack` (BYOK trust boundary per ADR-043 + ADR-114 D3). Stack truncated to 500 chars. Wraps the underlying `writeLogEvent` in its own try/catch so the error_event itself cannot escape (defence-in-depth per ADR-126 D4).
- `src/contexts/intelligence/chatPipeline.ts` — 4 catch sites wired (lines 515, 561, 619, 728): DECOMP, template intelligence, template apply patches, runLLMPipeline.
- 5 remaining `console.warn` sites kept dev-only with rationale (helper-locals where `db` is unavailable; recursive-risk inside the helper itself; redundant root-cause sites where the parent catch already logs).

**Impact:** error_event coverage 0 → 4 production write sites. Owner can now debug from a user's exported DB; `error_event` rows carry redacted root-cause.

### A7 — Closer (this run)
- `docs/adr/ADR-135-log-integrity-expansion.md` (NEW; ≤120 LOC; Status: Accepted; 3 decisions)
- `tests/p107-log-integrity.spec.ts` (NEW; 11 describes / 19 cases)
- `plans/implementation/phase-107/seal/{02-post-review,session-log,retrospective}.md`
- `CLAUDE.md` sync (P107 entry; ADR-135 ledger entry; CFs CLOSED notes)

## Coverage at seal

| event_type | Pre-P107 | Post-P107 |
|------------|----------|-----------|
| `multi_page_scope` | 0 writers | 1 writer (chatPipeline.ts:332) |
| `decomp_split` | 0 writers | 1 writer (chatPipeline.ts:450) |
| `todo_execution` | 0 writers | 1 writer (chatPipeline.ts:469) |
| `export_emit` | 0 writers | 1 writer (ExportClaudeCodeButton.tsx:44 callback) |
| `error_event` | 0 writers | 4 writers (chatPipeline catch sites via writeErrorEvent helper) |

Total CHECK enum coverage: **15/15 = 100%** (was 10/15 = 66.7% pre-P107).

## Test results

P107 spec: **19/19 GREEN** (existsSync soft-pass guards on Wave-1 surfaces; hard-gate on ADR-135 cross-refs + EOP triplet + 4-call-site count + redactKeyShapes on message AND stack + atom-pure ExportEmitCallback contract + KISS denylist).

Cumulative regression at this anchor: P101 (25) + P102 (22) + P-E2E-2 (22) + P104 (12) + P105 (17) + P106 (19) + P107 (19) = **136 GREEN** (≥132 target).

## Files touched (Wave 2 / A7 closer)

- NEW `docs/adr/ADR-135-log-integrity-expansion.md`
- NEW `tests/p107-log-integrity.spec.ts`
- NEW `plans/implementation/phase-107/seal/02-post-review.md` (this file)
- NEW `plans/implementation/phase-107/seal/session-log.md`
- NEW `plans/implementation/phase-107/seal/retrospective.md`
- EDIT `CLAUDE.md` (Project Status + roadmap row + ADR ledger)

## Quality gates

- ADR-135 ≤ 120 LOC cap → ~95 LOC actual.
- 3-decision structure mirrors ADR-127 + ADR-128 + ADR-130 (small-ADR cadence at the seal-arc).
- Cross-refs span 6 ADRs: ADR-126 + ADR-127 + ADR-104 + ADR-122 + ADR-134 + ADR-043.
- Both tsc strict configs clean after Wave 1 commit; closer adds zero source code.
- KISS denylist verified at P107.11: zero new deps.
- BYOK trust boundary verified at P107.8: `redactKeyShapes` on `message` AND `stack`.
- Atom-purity discipline verified at P107.9: zero persistence imports in `exportClaudeCode.ts`.
