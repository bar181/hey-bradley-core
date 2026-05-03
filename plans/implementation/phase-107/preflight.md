# P107 / LOG-INTEGRITY-EXPANSION — Preflight

> **Phase:** P107 · **Sprint:** LOG-INTEGRITY-EXPANSION · **Date:** 2026-05-04
> **Predecessor:** P106 / DEAD-CODE-PURGE + ATOM-VIEW-FIX sealed at `b6948db` (120/120 cumulative GREEN)

## Mandate

Close the persistence/observability gaps surfaced by Tracks A + C. Three concerns:

1. **A7 + C1 — 5 declared event_types are dead enum slots** (no production writers): `multi_page_scope`, `error_event`, `todo_execution`, `decomp_split`, `export_emit`. Coverage 10/15 = 66.7%. Wire emit sites for the 4 functional ones (defer todo_execution if cheap; it's lower priority).
2. **C5 — No centralized error capture** — 7 `console.warn` DEV-only sites swallow errors in `chatPipeline.ts`. Production builds emit zero `error_event` rows. Owner cannot debug from a user's exported DB. ~25 LOC fix.
3. **C12 — `editHist` skips writes when `projectId` is null** — homepage demo / anonymous flows lose forensics. Allow nullable projectId path with sentinel value (`'_anonymous'`).

## Out of scope

- ASSUMPTIONS_FALLBACK_TEMPLATES wire (B8) — defer to post-launch (judgment call: low value)
- Empty p76 spec / mobile viewports → P108
- ADR README rebuild → P109

## Agents · 2 waves

### Wave 1 — 2 parallel disjoint-scope agents

#### A5 — Wire 4 event_types into production
**Owns:**
- `src/contexts/intelligence/chatPipeline.ts` — emit:
  - `decomp_split` after DECOMP_ATOM produces ≥2 todos (with todo summary array; no key shapes)
  - `multi_page_scope` when `pageIterator.getActivePage` resolves a non-default scope (per ADR-104)
  - `export_emit` (alternative location: `src/contexts/specification/exportClaudeCode.ts` — emit on every `buildClaudeCodeBundle()` call with bundle slug + filename + size)
- `src/contexts/intelligence/aisp/decomposeExecutor.ts` (if exists) OR `chatPipeline.ts` — emit `todo_execution` per executor pass

Acceptance: `grep -rnE "event_type:\s*'(decomp_split|multi_page_scope|export_emit|todo_execution)'" src/` shows ≥1 production site each (4 of 5 unwired event_types now have writers).

**Cap:** ~80 LOC delta across 2-3 files

#### A6 — Centralized error_event capture
**Owns:**
- `src/contexts/persistence/repositories/comprehensiveLogs.ts` — add NEW exported helper:
  ```ts
  export function writeErrorEvent(db: Database, ctx: { sessionId, requestId? }, err: unknown, source: string): void {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack?.slice(0, 500) : undefined
    writeLogEvent(db, {
      session_id: ctx.sessionId,
      request_id: ctx.requestId ?? null,
      event_type: 'error_event',
      event_data: { source, message: redactKeyShapes(message), stack: stack ? redactKeyShapes(stack) : undefined },
      latency_ms: 0,
      created_at: Date.now(),
    })
  }
  ```
- `src/contexts/intelligence/chatPipeline.ts` — replace ≥4 of the 7 `console.warn` catch sites with `writeErrorEvent(...)` + preserve dev-mode console; keep fire-and-forget contract per ADR-126 D4

Acceptance: `grep -rnE "writeErrorEvent\(" src/` shows ≥4 production call sites; `grep -nE "event_type.*'error_event'" src/contexts/persistence/repositories/comprehensiveLogs.ts` shows the writer.

**Cap:** ~50 LOC delta

### Wave 2 — Closer

#### A7 — ADR-135 + tests + EOP
**Owns:**
- `docs/adr/ADR-135-log-integrity-expansion.md` (NEW; ≤120 LOC; Status: Accepted)
  - 3 decisions: (1) 4 of 5 unwired event_types now have production writers (decomp_split + multi_page_scope + export_emit + todo_execution); (2) centralized `writeErrorEvent` helper replaces scattered console.warn (BYOK redaction at every write); (3) projectId null path → `'_anonymous'` sentinel for homepage demo / anonymous edits (C12 closure deferred if non-trivial)
  - Cross-refs: ADR-126, ADR-127, ADR-104
- `tests/p107-log-integrity.spec.ts` (NEW; ≥15 cases / ≥6 describes)
  - P107.1 — ADR-135 file shape
  - P107.2 — `decomp_split` event_type emission site exists in chatPipeline.ts (regex match)
  - P107.3 — `multi_page_scope` emission site exists
  - P107.4 — `export_emit` emission site exists in exportClaudeCode.ts OR chatPipeline.ts
  - P107.5 — `todo_execution` emission site exists OR documented carry-forward
  - P107.6 — `writeErrorEvent` exported from comprehensiveLogs.ts
  - P107.7 — ≥4 call sites of `writeErrorEvent` in chatPipeline.ts
  - P107.8 — BYOK redaction in error path: `redactKeyShapes` called on message + stack
  - P107.9 — EOP triplet at `plans/implementation/phase-107/seal/`
  - Plus 6+ more cases
- `plans/implementation/phase-107/seal/{02-post-review,session-log,retrospective}.md`
- `CLAUDE.md` sync (P107 entry; ADR ledger update; CFs CLOSED notes)

## Hard rules

1. NO new dependencies
2. fire-and-forget contract preserved per ADR-126 D4 (writeErrorEvent never throws upward)
3. BYOK redaction at every error_event write boundary
4. Both tsc strict configs clean after seal
5. KISS — no new schema migrations (event_types already in CHECK enum from P104)
6. EOP triplet at `plans/implementation/phase-107/seal/`

## Acceptance gates

- 4+ unwired event_types now have production writers
- `writeErrorEvent` helper exported + ≥4 call sites
- ADR-135 Accepted citing ADR-126+127+104
- ≥15 P107 tests GREEN
- Cumulative regression: 120 + 15 = ≥135 GREEN
- Both tsc strict configs clean
