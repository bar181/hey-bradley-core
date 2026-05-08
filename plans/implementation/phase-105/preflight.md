# P105 / RC-BLOCKERS-CLOSURE — Preflight

> **Phase:** P105 · **Sprint:** RC-BLOCKERS-CLOSURE · **Date:** 2026-05-04
> **Predecessor:** P104 / SCHEMA-GUARDS sealed at `47cbfe4` (~1335+ tests; 81 GREEN at anchor)
> **Audit:** `plans/strategic-reviews/2026-05-04-gaps-to-done/` (5 chunks · 73 items · 19 P1 / 35 P2 / 23 P3)

## Mandate

Close the **top-priority RC-blockers** surfaced by the brutal-honest deep-dive audit. These are the items that:
1. Break user-visible functionality on click-through (route 404s; missing log persistence; pipeline bypass of cleanTranscript)
2. Invalidate prior carry-forward closure claims (P104 `validateSectionType` is a no-op — 0 production callers)

Owner direction: **focus on blockers first; standard phase discipline (preflight, log, retrospective).**

## What's IN scope (4 P1 blockers)

### 1. Welcome.tsx route breakage (Track E E1)
- 5 CTAs link to `/onboarding`; route registered as `/new-project` (main.tsx:72,110)
- Every front-door click hits `*` NotFound
- **Fix:** ~5-line `replace_all` swap

### 2. AppShell mode-detection dead branches (Track E E2)
- `AppShell.tsx:65-99` branches on `pathname.startsWith('/planning'|'/agentics')` BUT those routes mount their page components directly in `main.tsx:88-89` — they never go through AppShell
- Branches are dead code; ADR-116 D3 (route-derived layout) says single source of truth is the URL
- **Fix:** delete the dead branches OR re-route `/planning`+`/agentics` THROUGH AppShell (cleaner). KISS = delete dead code.

### 3. writeLogEvent persistence gap (Track C C2)
- `writeLogEvent` writes to in-memory sql.js only; `persist()` to IndexedDB is exported from `db.ts:154` but never called by the log path
- Submits with zero patches (canned fallback / error path / listen reject) NEVER persist their logs
- **Fix:** debounced flush + `pagehide` listener; ~25 LOC delta

### 4. cleanTranscript pipeline bypass (Tracks B7 + D1 convergence)
- `cleanTranscript` called ONCE at `chatPipeline.ts:327` inside `emit()` (LOGGING only)
- Pipeline downstream (`classifyIntent`, `decompose`, `matchTemplates`, `runLLMPipeline`) sees the RAW transcript with disfluencies
- ADR-127 declared this a "wired" closure; it's wired for logs only
- **Fix:** call `cleanTranscript` BEFORE classification when `source === 'listen'`; threaded through subsequent atom calls; ~15 LOC delta

## What's OUT of scope (deferred to later sprints; see priority below)

- twoStepPipeline / SELECTION_ATOM 245-LOC dead-code purge → P106 / DEAD-CODE-PURGE
- 5 unwired event_types (multi_page_scope / error_event / etc) → P107 / LOG-INTEGRITY (broader)
- Empty `tests/p76-spec-export-quality.spec.ts` + mobile viewport projects → P108 / TEST-RUNTIME-SHIFT
- ADR README rebuild (claims 38 / disk has 125) → P109 / ADR-LEDGER-TRUTH-UP
- A1 atom→view dependency inversion (60 LOC, 4 files) → P106 (KISS-fit; pairs with dead-code purge)
- A2 PATCH_ATOM section-enum 3-way drift → P109 (paired with section-enum reconciliation)
- `validateSectionType` wire-or-delete (closes A6+B1 convergence) → could fold into P105 if cheap; otherwise P106

## Decision: validateSectionType in scope or not?

**IN SCOPE** as a 5th P1 (closes A6+B1 convergence; ~20 LOC; aligns with KISS — wire it at JSON-load time in `src/data/examples/index.ts` so EXAMPLE_SITES validation surfaces section-type aliases before they hit Zod). If kept out, the P104 closure-claim remains optimistic.

## Agents · 2 waves

### Wave 1 — 4 parallel disjoint-scope agents

#### A1 — Welcome routes + AppShell cleanup
**Owns:**
- `src/pages/Welcome.tsx` — `replace_all` `/onboarding` → `/new-project` (5 occurrences)
- `src/components/shell/AppShell.tsx` — delete dead `pathname.startsWith('/planning' | '/agentics')` branches; preserve only Whiteboard/Builder branch
**Cap:** ~40 LOC delta total

#### A2 — Log persistence flush
**Owns:**
- `src/contexts/persistence/repositories/comprehensiveLogs.ts` — wire debounced `persist()` flush after each `writeLogEvent` write (debounce 500ms; coalesce); also `writeEditHistory` boundary
- Optionally `src/contexts/persistence/db.ts` — register a `pagehide` listener once at `initDB()` to flush before tab close (idempotent guard)
**Cap:** ~30 LOC delta

#### A3 — cleanTranscript pipeline wire
**Owns:**
- `src/contexts/intelligence/chatPipeline.ts` — when `source === 'listen'`, compute `effectiveText = cleanTranscript(text)` ONCE at submit-entry; thread `effectiveText` through `classifyIntent` + `decompose` + `tryMatchTemplate` + `runLLMPipeline`; preserve raw `text` only for the logging emit at line 327
**Cap:** ~25 LOC delta

#### A4 — validateSectionType production wire
**Owns:**
- `src/data/examples/index.ts` — at module-init, iterate `EXAMPLE_SITES` and call `validateSectionType(s.type)` per section; warn on alias remap (already implemented in helper); zero-throw, zero-mutation (validation surfaces, doesn't enforce)
- ALTERNATIVELY: wire into a load-time guard in `src/lib/schemas/section.ts` pre-Zod check — but Zod is strict, so a separate `safeRemap(config)` helper that runs BEFORE Zod and maps aliases → canonical types is cleaner
- Pick the path that closes A6+B1 with ≤30 LOC and zero behavior change for canonical-type configs
**Cap:** ~30 LOC delta

### Wave 2 — Closer

#### A5 — Tests + EOP triplet + CLAUDE.md sync
**Owns:**
- `tests/p105-rc-blockers.spec.ts` (NEW; ≥15 cases / ≥5 describes)
  - P105.1 — Welcome routes use `/new-project` not `/onboarding` (regex on `Welcome.tsx`)
  - P105.2 — AppShell dead branches removed (regex confirms ≤1 branch left)
  - P105.3 — writeLogEvent integration + persist() wiring (regex finds `persist()` call within debounce/setTimeout near writeLogEvent)
  - P105.4 — cleanTranscript called pre-classify in chatPipeline.ts (regex/source check)
  - P105.5 — validateSectionType has ≥1 production import site outside its declaration file (closes A6+B1)
  - P105.6 — EOP triplet present at `plans/implementation/phase-105/seal/`
  - P105.7 — KISS denylist (no new deps; framer-motion/jszip mention check stays unchanged)
- `plans/implementation/phase-105/seal/02-post-review.md` (≤200 LOC)
- `plans/implementation/phase-105/seal/session-log.md` (≤120 LOC)
- `plans/implementation/phase-105/seal/retrospective.md` (≤120 LOC)
- `CLAUDE.md` sync — add P105 entry; close 4 carry-forwards (CF#7-equivalent: A6+B1 / B7+D1 / C2 / E1+E2)
- NO new ADR (this is a fix-pass closure sprint, not architecture; mirrors P102 + P104 precedent)

## Hard rules

1. NO new dependencies
2. Surgical edits only — preserve all unrelated behavior
3. Both tsc strict configs clean after seal
4. Wave 1 agents have DISJOINT file scopes (no overlap)
5. fire-and-forget try/catch contract preserved per ADR-126 D4 (no new throws upward)
6. ADR-043 BYOK trust boundary preserved (no new key-shape leak surfaces)
7. EOP triplet at `plans/implementation/phase-105/seal/` (mirrors P95-P104 pattern)
8. Test spec uses Playwright shape (mirrors p101-rc.spec.ts / p104-seed-smoke.spec.ts)
9. KISS — no new ADR; fix-pass discipline; cumulative regression target ≥85 GREEN at anchor

## Acceptance gates

- 4 P1 blockers closed (A1 routes + A2 persist + A3 cleanTranscript wire + A4 validateSectionType wire)
- ≥15 P105 tests GREEN
- Cumulative regression: P101 (25) + P102 (22) + P-E2E-2 (22) + P104 (12) + P105 (≥15) ≥ 96 GREEN
- Both tsc strict configs clean
- EOP triplet present at `plans/implementation/phase-105/seal/`
- CLAUDE.md syncs P105 + 4 carry-forward closures

## Priority for next phases (post-P105)

After P105 RC-BLOCKERS-CLOSURE:

| Order | Phase | Focus | LOC | Items closed | Why this order |
|-------|-------|-------|-----|--------------|----------------|
| 1 | **P106 / DEAD-CODE-PURGE + ATOM-VIEW-FIX** | Delete 245-LOC twoStepPipeline orphan; fix atom→view dependency inversion (4 files in `contexts/` import from `components/`); wire ASSUMPTIONS_FALLBACK_TEMPLATES; PATCH_ATOM section-enum drift fix | ~310 | 8 | Architectural debt that grows with every new feature; merging fixes earliest is cheapest |
| 2 | **P107 / LOG-INTEGRITY-EXPANSION** | Wire 5 declared-but-unwired event_types (multi_page_scope / error_event / todo_execution / decomp_split / export_emit) per A7+C1; centralized error-event capture replacing 7 console.warn DEV-only sites | ~200 | 5 | Builds on P105/A2 persist work; gives us full forensic coverage before owner BYOK smoke |
| 3 | **P108 / TEST-RUNTIME-SHIFT** | Fill empty `p76-spec-export-quality.spec.ts` (zero test calls); add mobile viewport projects to `playwright.config.ts` (375/390/428); behavioral coverage for cleanTranscript + validateEventType + validateSectionType (closes D-track P1s) | ~400 | 10 | Makes the seal gate trustworthy; required before owner does click-through; longest sprint |
| 4 | **P109 / ADR-LEDGER-TRUTH-UP** | Rebuild `docs/adr/README.md` (claims 38 ADRs through ADR-048; disk reality 125 through ADR-133); reconcile section-type 3-way drift (schema/PATCH_ATOM/intentAtom) | ~150 | 4 | Lowest user-visible impact; final cleanup before owner-required tasks |

After P109, **the open-core is owner-runnable** — only the 5 owner-attestation items remain (BYOK smoke / STT calibration / demo video / launch posts / Lighthouse). 8 Tier-2 items + 1 judgment-deferral (`useChatPipeline` hook extraction) carry forward.
